using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Text.Json;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using DocumentFormat.OpenXml;
using DocumentFormat.OpenXml.Packaging;
using DocumentFormat.OpenXml.Wordprocessing;
using DocumentFormat.OpenXml.Spreadsheet;
using DocumentFormat.OpenXml.Presentation;
using DocumentFormat.OpenXml.Drawing;
using A = DocumentFormat.OpenXml.Drawing;
using P = DocumentFormat.OpenXml.Presentation;
using System.Text;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;
using SixLabors.ImageSharp.PixelFormats;
using Svg;
using QRCoder;

namespace FileConverter.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConvertController : ControllerBase
{
    [HttpPost("json-to-excel")]
    public async Task<IActionResult> ConvertJsonToExcel(IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        if (!file.FileName.EndsWith(".json", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format JSON" });
        }

        try
        {
            // Lire le contenu du fichier JSON
            using var reader = new StreamReader(file.OpenReadStream());
            var jsonContent = await reader.ReadToEndAsync();

            // Parser le JSON
            JsonElement jsonData;
            try
            {
                jsonData = JsonSerializer.Deserialize<JsonElement>(jsonContent);
            }
            catch (JsonException)
            {
                return BadRequest(new { message = "Le fichier JSON est invalide" });
            }

            // Créer le fichier Excel en mémoire
            using var package = new ExcelPackage();
            var worksheet = package.Workbook.Worksheets.Add("Données");

            // Convertir JSON en Excel
            ConvertJsonToExcel(jsonData, worksheet, 1, 1);

            // Ajuster la largeur des colonnes
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();

            // Retourner le fichier Excel
            var stream = new MemoryStream();
            await package.SaveAsAsync(stream);
            stream.Position = 0;

            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".xlsx";
            return File(stream, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    private void ConvertJsonToExcel(JsonElement jsonElement, ExcelWorksheet worksheet, int row, int col)
    {
        if (jsonElement.ValueKind == JsonValueKind.Object)
        {
            // Si c'est un objet, créer des colonnes pour chaque propriété
            int currentRow = row;
            foreach (var property in jsonElement.EnumerateObject())
            {
                worksheet.Cells[currentRow, col].Value = property.Name;
                
                if (property.Value.ValueKind == JsonValueKind.Array)
                {
                    // Si la valeur est un tableau, traiter chaque élément
                    int arrayRow = currentRow;
                    foreach (var item in property.Value.EnumerateArray())
                    {
                        if (item.ValueKind == JsonValueKind.Object)
                        {
                            ConvertJsonToExcel(item, worksheet, arrayRow, col + 1);
                        }
                        else
                        {
                            worksheet.Cells[arrayRow, col + 1].Value = GetValue(item);
                        }
                        arrayRow++;
                    }
                    currentRow = arrayRow;
                }
                else if (property.Value.ValueKind == JsonValueKind.Object)
                {
                    // Si la valeur est un objet, le convertir récursivement
                    ConvertJsonToExcel(property.Value, worksheet, currentRow, col + 1);
                    currentRow++;
                }
                else
                {
                    worksheet.Cells[currentRow, col + 1].Value = GetValue(property.Value);
                    currentRow++;
                }
            }
        }
        else if (jsonElement.ValueKind == JsonValueKind.Array)
        {
            // Si c'est un tableau, créer une ligne pour chaque élément
            int currentRow = row;
            bool isFirstItem = true;
            
            foreach (var item in jsonElement.EnumerateArray())
            {
                if (item.ValueKind == JsonValueKind.Object)
                {
                    // Pour le premier élément, créer les en-têtes
                    if (isFirstItem)
                    {
                        int headerCol = col;
                        foreach (var prop in item.EnumerateObject())
                        {
                            worksheet.Cells[row, headerCol].Value = prop.Name;
                            headerCol++;
                        }
                        isFirstItem = false;
                        currentRow = row + 1;
                    }
                    
                    // Ajouter les valeurs
                    int valueCol = col;
                    foreach (var prop in item.EnumerateObject())
                    {
                        if (prop.Value.ValueKind == JsonValueKind.Array || prop.Value.ValueKind == JsonValueKind.Object)
                        {
                            worksheet.Cells[currentRow, valueCol].Value = prop.Value.ToString();
                        }
                        else
                        {
                            worksheet.Cells[currentRow, valueCol].Value = GetValue(prop.Value);
                        }
                        valueCol++;
                    }
                    currentRow++;
                }
                else
                {
                    worksheet.Cells[currentRow, col].Value = GetValue(item);
                    currentRow++;
                }
            }
        }
        else
        {
            worksheet.Cells[row, col].Value = GetValue(jsonElement);
        }
    }

    private object? GetValue(JsonElement element)
    {
        return element.ValueKind switch
        {
            JsonValueKind.String => element.GetString(),
            JsonValueKind.Number => element.GetDecimal(),
            JsonValueKind.True => true,
            JsonValueKind.False => false,
            JsonValueKind.Null => null,
            _ => element.ToString()
        };
    }

    [HttpPost("pdf-to-office")]
    public async Task<IActionResult> ConvertPdfToOffice(IFormFile file, [FromForm] string outputFormat)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format PDF" });
        }

        if (string.IsNullOrEmpty(outputFormat) || !new[] { "word", "excel", "powerpoint" }.Contains(outputFormat.ToLower()))
        {
            return BadRequest(new { message = "Format de sortie invalide. Utilisez 'word', 'excel' ou 'powerpoint'" });
        }

        try
        {
            // Extraire le texte du PDF
            var pdfText = await ExtractTextFromPdf(file);

            if (string.IsNullOrWhiteSpace(pdfText))
            {
                return BadRequest(new { message = "Impossible d'extraire le texte du PDF. Le fichier peut être scanné ou protégé." });
            }

            // Convertir selon le format demandé
            var outputFormatLower = outputFormat.ToLower();
            MemoryStream outputStream = new MemoryStream();
            string contentType;
            string fileExtension;

            switch (outputFormatLower)
            {
                case "word":
                    await CreateWordDocument(pdfText, outputStream);
                    contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
                    fileExtension = ".docx";
                    break;

                case "excel":
                    await CreateExcelDocument(pdfText, outputStream);
                    contentType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
                    fileExtension = ".xlsx";
                    break;

                case "powerpoint":
                    await CreatePowerPointDocument(pdfText, outputStream);
                    contentType = "application/vnd.openxmlformats-officedocument.presentationml.presentation";
                    fileExtension = ".pptx";
                    break;

                default:
                    return BadRequest(new { message = "Format de sortie non supporté" });
            }

            outputStream.Position = 0;
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + fileExtension;
            return File(outputStream, contentType, fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    private async Task<string> ExtractTextFromPdf(IFormFile file)
    {
        var text = new StringBuilder();
        
        using var stream = file.OpenReadStream();
        using var pdfReader = new PdfReader(stream);
        using var pdfDocument = new PdfDocument(pdfReader);

        for (int page = 1; page <= pdfDocument.GetNumberOfPages(); page++)
        {
            var strategy = new SimpleTextExtractionStrategy();
            var pageText = PdfTextExtractor.GetTextFromPage(pdfDocument.GetPage(page), strategy);
            text.AppendLine(pageText);
        }

        return text.ToString();
    }

    private async Task CreateWordDocument(string text, MemoryStream outputStream)
    {
        using (var wordDocument = WordprocessingDocument.Create(outputStream, WordprocessingDocumentType.Document))
        {
            var mainPart = wordDocument.AddMainDocumentPart();
            mainPart.Document = new Document();
            var body = mainPart.Document.AppendChild(new Body());

            // Diviser le texte en paragraphes
            var paragraphs = text.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.RemoveEmptyEntries);
            
            foreach (var paragraphText in paragraphs)
            {
                var paragraph = new DocumentFormat.OpenXml.Wordprocessing.Paragraph();
                var run = new DocumentFormat.OpenXml.Wordprocessing.Run();
                run.AppendChild(new DocumentFormat.OpenXml.Wordprocessing.Text(paragraphText));
                paragraph.AppendChild(run);
                body.AppendChild(paragraph);
            }
        }
        await Task.CompletedTask;
    }

    private async Task CreateExcelDocument(string text, MemoryStream outputStream)
    {
        using var package = new ExcelPackage();
        var worksheet = package.Workbook.Worksheets.Add("Contenu PDF");

        // Diviser le texte en lignes
        var lines = text.Split(new[] { "\r\n", "\r", "\n" }, StringSplitOptions.None);
        
        for (int i = 0; i < lines.Length; i++)
        {
            // Diviser chaque ligne en colonnes (par tabulation ou espace)
            var columns = lines[i].Split(new[] { '\t' }, StringSplitOptions.None);
            
            for (int j = 0; j < columns.Length; j++)
            {
                worksheet.Cells[i + 1, j + 1].Value = columns[j].Trim();
            }
        }

        // Ajuster la largeur des colonnes
        if (worksheet.Dimension != null)
        {
            worksheet.Cells[worksheet.Dimension.Address].AutoFitColumns();
        }

        await package.SaveAsAsync(outputStream);
    }

    private async Task CreatePowerPointDocument(string text, MemoryStream outputStream)
    {
        // Pour PowerPoint, on va créer un document simple avec une seule diapositive
        // La création complète de PowerPoint est complexe, donc on crée une version simplifiée
        using (var presentation = PresentationDocument.Create(outputStream, PresentationDocumentType.Presentation))
        {
            var presentationPart = presentation.AddPresentationPart();
            presentationPart.Presentation = new Presentation(
                new SlideIdList(),
                new SlideSize { Cx = 9144000, Cy = 6858000 },
                new NotesSize { Cx = 6858000, Cy = 9144000 },
                new DefaultTextStyle());

            var slideIdList = presentationPart.Presentation.GetFirstChild<SlideIdList>()!;

            // Créer une diapositive
            var slidePart = presentationPart.AddNewPart<SlidePart>();
            var slideId = new SlideId { Id = 256, RelationshipId = presentationPart.GetIdOfPart(slidePart) };
            slideIdList.AppendChild(slideId);

            // Créer le contenu de la diapositive avec le texte
            var slideText = text.Length > 2000 ? text.Substring(0, 2000) + "..." : text;
            
            slidePart.Slide = new Slide(
                new CommonSlideData(
                    new ShapeTree(
                        new P.NonVisualGroupShapeProperties(
                            new P.NonVisualDrawingProperties { Id = 1, Name = "" },
                            new P.NonVisualGroupShapeDrawingProperties(),
                            new ApplicationNonVisualDrawingProperties()),
                        new GroupShapeProperties(new TransformGroup()),
                        new P.Shape(
                            new P.NonVisualShapeProperties(
                                new P.NonVisualDrawingProperties { Id = 2, Name = "TextBox" },
                                new P.NonVisualShapeDrawingProperties(new ShapeLocks { NoGrouping = true }),
                                new ApplicationNonVisualDrawingProperties()),
                            new P.ShapeProperties(),
                            new P.TextBody(
                                new BodyProperties(),
                                new ListStyle(),
                                new A.Paragraph(
                                    new A.ParagraphProperties { Alignment = TextAlignmentTypeValues.Left },
                                    new A.Run(
                                        new P.Text(slideText))))
                        )
                    )
                ),
                new ColorMapOverride(new MasterColorMapping())
            );

            slidePart.Slide.Save();
            presentationPart.Presentation.Save();
        }
        await Task.CompletedTask;
    }

    [HttpPost("image")]
    public async Task<IActionResult> ConvertImage(IFormFile file, [FromForm] string outputFormat)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        var validFormats = new[] { "png", "jpg", "jpeg", "webp", "svg" };
        var fileExtension = System.IO.Path.GetExtension(file.FileName).ToLower().TrimStart('.');
        
        if (!validFormats.Contains(fileExtension))
        {
            return BadRequest(new { message = "Format d'image non supporté" });
        }

        if (string.IsNullOrEmpty(outputFormat) || !validFormats.Contains(outputFormat.ToLower()))
        {
            return BadRequest(new { message = "Format de sortie invalide. Utilisez 'png', 'jpg', 'webp' ou 'svg'" });
        }

        try
        {
            var outputFormatLower = outputFormat.ToLower();
            MemoryStream outputStream = new MemoryStream();
            string contentType;

            using (var inputStream = file.OpenReadStream())
            {
                // Si le format de sortie est SVG, c'est plus complexe
                if (outputFormatLower == "svg")
                {
                    return BadRequest(new { message = "La conversion vers SVG n'est pas supportée depuis les formats raster" });
                }

                // Charger l'image
                using var image = await Image.LoadAsync(inputStream);

                // Convertir selon le format demandé
                switch (outputFormatLower)
                {
                    case "png":
                        await image.SaveAsync(outputStream, new PngEncoder());
                        contentType = "image/png";
                        break;

                    case "jpg":
                    case "jpeg":
                        await image.SaveAsync(outputStream, new JpegEncoder { Quality = 90 });
                        contentType = "image/jpeg";
                        break;

                    case "webp":
                        await image.SaveAsync(outputStream, new WebpEncoder { Quality = 90 });
                        contentType = "image/webp";
                        break;

                    default:
                        return BadRequest(new { message = "Format de sortie non supporté" });
                }
            }

            outputStream.Position = 0;
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + 
                          (outputFormatLower == "jpg" || outputFormatLower == "jpeg" ? ".jpg" : $".{outputFormatLower}");
            
            return File(outputStream, contentType, fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("qr-code")]
    public async Task<IActionResult> GenerateQrCode(
        [FromForm] string text,
        [FromForm] string foregroundColor = "#000000",
        [FromForm] string backgroundColor = "#FFFFFF",
        [FromForm] int size = 300,
        IFormFile? logo = null)
    {
        if (string.IsNullOrWhiteSpace(text))
        {
            return BadRequest(new { message = "Le texte ne peut pas être vide" });
        }

        if (size < 100 || size > 1000)
        {
            return BadRequest(new { message = "La taille doit être entre 100 et 1000 pixels" });
        }

        try
        {
            // Parser les couleurs
            var fgColor = System.Drawing.ColorTranslator.FromHtml(foregroundColor);
            var bgColor = System.Drawing.ColorTranslator.FromHtml(backgroundColor);

            // Générer le QR code avec les couleurs personnalisées
            using var qrGenerator = new QRCodeGenerator();
            var qrCodeData = qrGenerator.CreateQrCode(text, QRCodeGenerator.ECCLevel.Q);
            using var qrCode = new PngByteQRCode(qrCodeData);
            
            // Générer le QR code en bytes avec les couleurs
            var qrCodeBytes = qrCode.GetGraphic(20, new byte[] { fgColor.R, fgColor.G, fgColor.B }, new byte[] { bgColor.R, bgColor.G, bgColor.B });

            // Charger l'image du QR code avec ImageSharp
            using var qrImage = Image.Load<Rgba32>(qrCodeBytes);
            
            // Redimensionner si nécessaire
            if (qrImage.Width != size || qrImage.Height != size)
            {
                qrImage.Mutate(x => x.Resize(size, size));
            }

            // Ajouter le logo si fourni
            if (logo != null && logo.Length > 0)
            {
                using var logoStream = logo.OpenReadStream();
                using var logoImage = await Image.LoadAsync(logoStream);
                
                // Redimensionner le logo (environ 20% de la taille du QR code)
                var logoSize = (int)(size * 0.2f);
                logoImage.Mutate(x => x.Resize(new ResizeOptions
                {
                    Size = new SixLabors.ImageSharp.Size(logoSize, logoSize),
                    Mode = ResizeMode.Max
                }));

                // Calculer la position pour centrer le logo
                var x = (size - logoSize) / 2;
                var y = (size - logoSize) / 2;

                // Dessiner le logo au centre avec un fond blanc
                var whiteSize = (int)(size * 0.25f);
                var whiteX = (size - whiteSize) / 2;
                var whiteY = (size - whiteSize) / 2;

                qrImage.Mutate(ctx =>
                {
                    // Créer un rectangle blanc pour le fond du logo
                    using var whiteRect = new Image<Rgba32>(whiteSize, whiteSize);
                    whiteRect.Mutate(w => w.BackgroundColor(new Rgba32(255, 255, 255, 255)));
                    
                    // Dessiner le fond blanc
                    ctx.DrawImage(whiteRect, new SixLabors.ImageSharp.Point(whiteX, whiteY), 1f);
                    // Dessiner le logo
                    ctx.DrawImage(logoImage, new SixLabors.ImageSharp.Point(x, y), 1f);
                });
            }

            // Sauvegarder l'image finale
            var outputStream = new MemoryStream();
            await qrImage.SaveAsync(outputStream, new PngEncoder());
            outputStream.Position = 0;

            return File(outputStream, "image/png", "qrcode.png");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération du QR code: {ex.Message}" });
        }
    }

}

