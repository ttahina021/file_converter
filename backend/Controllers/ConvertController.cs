using Microsoft.AspNetCore.Mvc;
using OfficeOpenXml;
using System.Text.Json;
using iText.Kernel.Pdf;
using iText.Kernel.Pdf.Canvas.Parser;
using iText.Kernel.Pdf.Canvas.Parser.Listener;
using iText.Kernel.Pdf.Xobject;
using iText.Kernel.Geom;
using iText.Kernel.Pdf.Canvas;
using iText.IO.Image;
using iText.Kernel.Crypto;
using iText.Layout;
using iText.Layout.Element;
using iText.Layout.Properties;
using iTextLayoutDocument = iText.Layout.Document;
using iTextLayoutImage = iText.Layout.Element.Image;
using iTextRectangle = iText.Kernel.Geom.Rectangle;
using ImageSharpImage = SixLabors.ImageSharp.Image;
using System.IO.Compression;
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
            mainPart.Document = new DocumentFormat.OpenXml.Wordprocessing.Document();
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
                using var image = await ImageSharpImage.LoadAsync(inputStream);

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
            using var qrImage = ImageSharpImage.Load<Rgba32>(qrCodeBytes);
            
            // Redimensionner si nécessaire
            if (qrImage.Width != size || qrImage.Height != size)
            {
                qrImage.Mutate(x => x.Resize(size, size));
            }

            // Ajouter le logo si fourni
            if (logo != null && logo.Length > 0)
            {
                using var logoStream = logo.OpenReadStream();
                using var logoImage = await ImageSharpImage.LoadAsync(logoStream);
                
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

    [HttpPost("merge-pdf")]
    public async Task<IActionResult> MergePdf()
    {
        var files = Request.Form.Files;
        
        if (files == null || files.Count < 2)
        {
            return BadRequest(new { message = "Au moins 2 fichiers PDF sont requis pour la fusion" });
        }

        try
        {
            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream);
            using var mergedPdf = new PdfDocument(writer);

            foreach (var file in files)
            {
                if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
                {
                    return BadRequest(new { message = $"Le fichier {file.FileName} n'est pas un PDF" });
                }

                using var inputStream = file.OpenReadStream();
                using var reader = new PdfReader(inputStream);
                using var sourcePdf = new PdfDocument(reader);

                int numberOfPages = sourcePdf.GetNumberOfPages();
                for (int i = 1; i <= numberOfPages; i++)
                {
                    var page = sourcePdf.GetPage(i);
                    mergedPdf.AddPage(page.CopyTo(mergedPdf));
                }
            }

            mergedPdf.Close();
            outputStream.Position = 0;

            return File(outputStream, "application/pdf", "fichier-fusionne.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la fusion: {ex.Message}" });
        }
    }

    [HttpPost("split-pdf")]
    public async Task<IActionResult> SplitPdf(IFormFile file, [FromForm] string splitMode, [FromForm] string? pageRange = null, [FromForm] string? customPages = null)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format PDF" });
        }

        try
        {
            using var inputStream = file.OpenReadStream();
            using var reader = new PdfReader(inputStream);
            using var sourcePdf = new PdfDocument(reader);

            int totalPages = sourcePdf.GetNumberOfPages();
            var pagesToExtract = new List<int>();

            switch (splitMode.ToLower())
            {
                case "all":
                    // Extraire toutes les pages
                    for (int i = 1; i <= totalPages; i++)
                    {
                        pagesToExtract.Add(i);
                    }
                    break;

                case "range":
                    if (string.IsNullOrEmpty(pageRange))
                    {
                        return BadRequest(new { message = "Veuillez spécifier un intervalle de pages" });
                    }
                    pagesToExtract = ParsePageRange(pageRange, totalPages);
                    break;

                case "custom":
                    if (string.IsNullOrEmpty(customPages))
                    {
                        return BadRequest(new { message = "Veuillez spécifier les numéros de pages" });
                    }
                    pagesToExtract = ParseCustomPages(customPages, totalPages);
                    break;

                default:
                    return BadRequest(new { message = "Mode de division invalide" });
            }

            if (pagesToExtract.Count == 0)
            {
                return BadRequest(new { message = "Aucune page valide à extraire" });
            }

            // Créer un fichier ZIP avec tous les PDFs extraits
            using var zipStream = new MemoryStream();
            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
            {
                foreach (var pageNum in pagesToExtract)
                {
                    if (pageNum < 1 || pageNum > totalPages)
                        continue;

                    var entry = archive.CreateEntry($"page-{pageNum}.pdf");
                    using (var entryStream = entry.Open())
                    {
                        using var pagePdf = new PdfDocument(new PdfWriter(entryStream));
                        var sourcePage = sourcePdf.GetPage(pageNum);
                        sourcePage.CopyTo(pagePdf);
                        pagePdf.Close();
                    }
                }
            }

            zipStream.Position = 0;
            return File(zipStream, "application/zip", "fichier-divise.zip");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la division: {ex.Message}" });
        }
    }

    private List<int> ParsePageRange(string range, int maxPages)
    {
        var pages = new List<int>();
        var parts = range.Split(',');

        foreach (var partItem in parts)
        {
            var part = partItem.Trim();
            if (part.Contains("-"))
            {
                var rangeParts = part.Split('-');
                if (rangeParts.Length == 2 && int.TryParse(rangeParts[0], out int start) && int.TryParse(rangeParts[1], out int end))
                {
                    for (int i = Math.Max(1, start); i <= Math.Min(maxPages, end); i++)
                    {
                        pages.Add(i);
                    }
                }
            }
            else if (int.TryParse(part, out int pageNum))
            {
                if (pageNum >= 1 && pageNum <= maxPages)
                {
                    pages.Add(pageNum);
                }
            }
        }

        return pages.Distinct().OrderBy(p => p).ToList();
    }

    private List<int> ParseCustomPages(string pagesStr, int maxPages)
    {
        var pages = new List<int>();
        var parts = pagesStr.Split(',');

        foreach (var part in parts)
        {
            if (int.TryParse(part.Trim(), out int pageNum))
            {
                if (pageNum >= 1 && pageNum <= maxPages)
                {
                    pages.Add(pageNum);
                }
            }
        }

        return pages.Distinct().OrderBy(p => p).ToList();
    }

    [HttpPost("compress-pdf")]
    public async Task<IActionResult> CompressPdf(IFormFile file, [FromForm] string compressionLevel)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format PDF" });
        }

        if (string.IsNullOrEmpty(compressionLevel) || !new[] { "low", "medium", "high" }.Contains(compressionLevel.ToLower()))
        {
            return BadRequest(new { message = "Niveau de compression invalide. Utilisez 'low', 'medium' ou 'high'" });
        }

        try
        {
            using var inputStream = file.OpenReadStream();
            using var reader = new PdfReader(inputStream);
            
            // Configurer les options de compression selon le niveau
            var writerProperties = new WriterProperties();
            
            int compressionValue = compressionLevel.ToLower() switch
            {
                "low" => 0,      // Compression minimale - qualité maximale
                "medium" => 5,   // Compression moyenne - équilibre
                "high" => 9,     // Compression maximale - taille minimale
                _ => 5
            };

            // Activer la compression des objets et des flux
            writerProperties.SetFullCompressionMode(true);
            writerProperties.SetCompressionLevel(compressionValue);

            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream, writerProperties);
            using var sourcePdf = new PdfDocument(reader);
            using var compressedPdf = new PdfDocument(writer);

            // Copier toutes les pages
            int numberOfPages = sourcePdf.GetNumberOfPages();
            for (int i = 1; i <= numberOfPages; i++)
            {
                var page = sourcePdf.GetPage(i);
                compressedPdf.AddPage(page.CopyTo(compressedPdf));
            }

            compressedPdf.Close();
            outputStream.Position = 0;

            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-compresse.pdf";
            return File(outputStream, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la compression: {ex.Message}" });
        }
    }

    [HttpPost("protect-pdf")]
    public async Task<IActionResult> ProtectPdf(IFormFile file, [FromForm] string password)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier fourni" });
        }

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format PDF" });
        }

        if (string.IsNullOrEmpty(password) || password.Length < 4)
        {
            return BadRequest(new { message = "Le mot de passe doit contenir au moins 4 caractères" });
        }

        try
        {
            using var inputStream = file.OpenReadStream();
            using var reader = new PdfReader(inputStream);
            
            var writerProperties = new WriterProperties();
            // Ajouter le mot de passe utilisateur (pour ouvrir le PDF)
            writerProperties.SetStandardEncryption(
                System.Text.Encoding.UTF8.GetBytes(password),
                null,
                EncryptionConstants.ALLOW_PRINTING | EncryptionConstants.ALLOW_COPY | EncryptionConstants.ALLOW_MODIFY_ANNOTATIONS,
                EncryptionConstants.ENCRYPTION_AES_128
            );

            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream, writerProperties);
            using var sourcePdf = new PdfDocument(reader);
            using var protectedPdf = new PdfDocument(writer);

            // Copier toutes les pages
            int numberOfPages = sourcePdf.GetNumberOfPages();
            for (int i = 1; i <= numberOfPages; i++)
            {
                var page = sourcePdf.GetPage(i);
                protectedPdf.AddPage(page.CopyTo(protectedPdf));
            }

            protectedPdf.Close();
            outputStream.Position = 0;

            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-protege.pdf";
            return File(outputStream, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la protection: {ex.Message}" });
        }
    }

    [HttpPost("sign-pdf")]
    public async Task<IActionResult> SignPdf(
        IFormFile file,
        IFormFile signature,
        [FromForm] string position,
        [FromForm] int pageNumber = 1)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Aucun fichier PDF fourni" });
        }

        if (signature == null || signature.Length == 0)
        {
            return BadRequest(new { message = "Aucune image de signature fournie" });
        }

        if (!file.FileName.EndsWith(".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Le fichier doit être au format PDF" });
        }

        var validImageTypes = new[] { "image/png", "image/jpeg", "image/jpg", "image/webp" };
        if (!validImageTypes.Contains(signature.ContentType.ToLower()) && 
            !signature.FileName.EndsWith(".png", StringComparison.OrdinalIgnoreCase) &&
            !signature.FileName.EndsWith(".jpg", StringComparison.OrdinalIgnoreCase) &&
            !signature.FileName.EndsWith(".jpeg", StringComparison.OrdinalIgnoreCase) &&
            !signature.FileName.EndsWith(".webp", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "L'image de signature doit être au format PNG, JPG ou WebP" });
        }

        if (pageNumber < 1)
        {
            return BadRequest(new { message = "Le numéro de page doit être supérieur à 0" });
        }

        try
        {
            using var pdfStream = file.OpenReadStream();
            using var pdfReader = new PdfReader(pdfStream);
            using var pdfDocument = new PdfDocument(pdfReader);

            // Vérifier que la page existe
            if (pageNumber > pdfDocument.GetNumberOfPages())
            {
                return BadRequest(new { message = $"Le PDF ne contient que {pdfDocument.GetNumberOfPages()} page(s)" });
            }

            // Charger l'image de signature
            using var signatureStream = signature.OpenReadStream();
            using var signatureImage = await ImageSharpImage.LoadAsync(signatureStream);
            
            // Convertir l'image en bytes PNG pour l'ajouter au PDF
            using var imageBytes = new MemoryStream();
            await signatureImage.SaveAsync(imageBytes, new PngEncoder());
            imageBytes.Position = 0;

            // Créer un PdfImageXObject à partir de l'image
            var pdfImage = new PdfImageXObject(ImageDataFactory.Create(imageBytes.ToArray()));
            
            // Obtenir la page cible
            var page = pdfDocument.GetPage(pageNumber);
            var pageSize = page.GetPageSize();
            
            // Calculer la position de la signature
            float x = 0, y = 0;
            float signatureWidth = 150; // Largeur de la signature en points
            float signatureHeight = (signatureWidth * signatureImage.Height) / signatureImage.Width; // Conserver le ratio
            
            switch (position.ToLower())
            {
                case "bottom-right":
                    x = pageSize.GetWidth() - signatureWidth - 20;
                    y = 20;
                    break;
                case "bottom-left":
                    x = 20;
                    y = 20;
                    break;
                case "top-right":
                    x = pageSize.GetWidth() - signatureWidth - 20;
                    y = pageSize.GetHeight() - signatureHeight - 20;
                    break;
                case "top-left":
                    x = 20;
                    y = pageSize.GetHeight() - signatureHeight - 20;
                    break;
                case "center":
                    x = (pageSize.GetWidth() - signatureWidth) / 2;
                    y = (pageSize.GetHeight() - signatureHeight) / 2;
                    break;
                default:
                    x = pageSize.GetWidth() - signatureWidth - 20;
                    y = 20;
                    break;
            }

            // Sauvegarder le PDF modifié
            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream);
            using var outputPdf = new PdfDocument(writer);
            
            // Copier toutes les pages
            int numberOfPages = pdfDocument.GetNumberOfPages();
            for (int i = 1; i <= numberOfPages; i++)
            {
                var sourcePage = pdfDocument.GetPage(i);
                var newPage = outputPdf.AddPage(sourcePage.CopyTo(outputPdf));
                
                // Ajouter la signature sur la page cible
                if (i == pageNumber)
                {
                    var canvas = new PdfCanvas(newPage);
                    var rect = new iTextRectangle(x, y, signatureWidth, signatureHeight);
                    canvas.AddXObjectAt(pdfImage, x, y);
                    canvas.Release();
                }
            }

            outputPdf.Close();
            outputStream.Position = 0;

            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-signe.pdf";
            return File(outputStream, "application/pdf", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la signature: {ex.Message}" });
        }
    }

    [HttpPost("excel-to-json")]
    public async Task<IActionResult> ConvertExcelToJson(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".xlsx", StringComparison.OrdinalIgnoreCase) && 
            !file.FileName.EndsWith(".xls", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format Excel (.xlsx ou .xls)" });

        try
        {
            using var package = new ExcelPackage(file.OpenReadStream());
            var result = new Dictionary<string, object>();

            foreach (var worksheet in package.Workbook.Worksheets)
            {
                var sheetData = new List<Dictionary<string, object?>>();
                var headers = new List<string>();

                if (worksheet.Dimension != null)
                {
                    // Lire les en-têtes
                    for (int col = 1; col <= worksheet.Dimension.End.Column; col++)
                    {
                        var header = worksheet.Cells[1, col].Value?.ToString() ?? $"Column{col}";
                        headers.Add(header);
                    }

                    // Lire les données
                    for (int row = 2; row <= worksheet.Dimension.End.Row; row++)
                    {
                        var rowData = new Dictionary<string, object?>();
                        for (int col = 1; col <= headers.Count; col++)
                        {
                            rowData[headers[col - 1]] = worksheet.Cells[row, col].Value;
                        }
                        sheetData.Add(rowData);
                    }
                }

                result[worksheet.Name] = sheetData;
            }

            var json = JsonSerializer.Serialize(result, new JsonSerializerOptions { WriteIndented = true });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            return File(bytes, "application/json", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".json");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("csv-to-json")]
    public async Task<IActionResult> ConvertCsvToJson(IFormFile file, [FromForm] string delimiter = ",")
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format CSV" });

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var lines = new List<string>();
            while (!reader.EndOfStream)
                lines.Add(await reader.ReadLineAsync() ?? "");

            if (lines.Count == 0)
                return BadRequest(new { message = "Le fichier CSV est vide" });

            var headers = lines[0].Split(new[] { delimiter }, StringSplitOptions.None);
            var result = new List<Dictionary<string, string>>();

            for (int i = 1; i < lines.Count; i++)
            {
                var values = lines[i].Split(new[] { delimiter }, StringSplitOptions.None);
                var row = new Dictionary<string, string>();
                for (int j = 0; j < headers.Length && j < values.Length; j++)
                {
                    row[headers[j].Trim()] = values[j].Trim();
                }
                result.Add(row);
            }

            var json = JsonSerializer.Serialize(result, new JsonSerializerOptions { WriteIndented = true });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            return File(bytes, "application/json", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".json");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("xml-to-json")]
    public async Task<IActionResult> ConvertXmlToJson(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".xml", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format XML" });

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var xmlContent = await reader.ReadToEndAsync();
            var xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(xmlContent);

            var json = JsonSerializer.Serialize(xmlDoc, new JsonSerializerOptions { WriteIndented = true });
            var bytes = System.Text.Encoding.UTF8.GetBytes(json);
            return File(bytes, "application/json", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".json");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("yaml-to-json")]
    public async Task<IActionResult> ConvertYamlToJson(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".yaml", StringComparison.OrdinalIgnoreCase) && 
            !file.FileName.EndsWith(".yml", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format YAML" });

        try
        {
            // Note: Nécessite une bibliothèque YAML comme YamlDotNet
            // Pour l'instant, retourner une erreur indiquant que c'est à implémenter
            return BadRequest(new { message = "La conversion YAML vers JSON nécessite l'installation de YamlDotNet. À implémenter." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("json-to-yaml")]
    public async Task<IActionResult> ConvertJsonToYaml(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".json", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format JSON" });

        try
        {
            // Note: Nécessite une bibliothèque YAML comme YamlDotNet
            return BadRequest(new { message = "La conversion JSON vers YAML nécessite l'installation de YamlDotNet. À implémenter." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("sql-to-csv")]
    public async Task<IActionResult> ConvertSqlToCsv(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".sql", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format SQL" });

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var sqlContent = await reader.ReadToEndAsync();
            
            // Extraire les données INSERT et les convertir en CSV
            var csvLines = new List<string>();
            var insertPattern = new System.Text.RegularExpressions.Regex(@"INSERT\s+INTO\s+\w+\s*\(([^)]+)\)\s*VALUES\s*\(([^)]+)\)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
            var matches = insertPattern.Matches(sqlContent);
            
            if (matches.Count > 0)
            {
                var headers = matches[0].Groups[1].Value.Split(',').Select(h => h.Trim().Trim('\'')).ToList();
                csvLines.Add(string.Join(",", headers));
                
                foreach (System.Text.RegularExpressions.Match match in matches)
                {
                    var values = match.Groups[2].Value.Split(',').Select(v => v.Trim().Trim('\'')).ToList();
                    csvLines.Add(string.Join(",", values));
                }
            }

            var csv = string.Join("\n", csvLines);
            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            return File(bytes, "text/csv", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".csv");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("clean-csv")]
    public async Task<IActionResult> CleanCsv(IFormFile file, [FromForm] string options)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.FileName.EndsWith(".csv", StringComparison.OrdinalIgnoreCase))
            return BadRequest(new { message = "Le fichier doit être au format CSV" });

        try
        {
            var cleanOptions = JsonSerializer.Deserialize<Dictionary<string, bool>>(options) ?? new Dictionary<string, bool>();
            using var reader = new StreamReader(file.OpenReadStream());
            var lines = new List<string>();
            
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync() ?? "";
                if (cleanOptions.GetValueOrDefault("trimWhitespace", false))
                    line = line.Trim();
                if (cleanOptions.GetValueOrDefault("removeQuotes", false))
                    line = line.Trim('"');
                if (!cleanOptions.GetValueOrDefault("removeEmptyRows", false) || !string.IsNullOrWhiteSpace(line))
                    lines.Add(line);
            }

            var csv = string.Join("\n", lines);
            var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
            return File(bytes, "text/csv", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-nettoye.csv");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors du nettoyage: {ex.Message}" });
        }
    }

    [HttpPost("remove-duplicates")]
    public async Task<IActionResult> RemoveDuplicates(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        try
        {
            using var reader = new StreamReader(file.OpenReadStream());
            var seen = new HashSet<string>();
            var uniqueLines = new List<string>();
            
            while (!reader.EndOfStream)
            {
                var line = await reader.ReadLineAsync() ?? "";
                if (!seen.Contains(line))
                {
                    seen.Add(line);
                    uniqueLines.Add(line);
                }
            }

            var content = string.Join("\n", uniqueLines);
            var bytes = System.Text.Encoding.UTF8.GetBytes(content);
            var extension = System.IO.Path.GetExtension(file.FileName);
            return File(bytes, "application/octet-stream", System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-sans-doublons" + extension);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la suppression des doublons: {ex.Message}" });
        }
    }

    [HttpPost("compare-files")]
    public async Task<IActionResult> CompareFiles(IFormFile file1, IFormFile file2)
    {
        if (file1 == null || file2 == null || file1.Length == 0 || file2.Length == 0)
            return BadRequest(new { message = "Veuillez fournir deux fichiers" });

        try
        {
            using var reader1 = new StreamReader(file1.OpenReadStream());
            using var reader2 = new StreamReader(file2.OpenReadStream());
            var content1 = await reader1.ReadToEndAsync();
            var content2 = await reader2.ReadToEndAsync();

            var areEqual = content1 == content2;
            var message = areEqual 
                ? "Les fichiers sont identiques." 
                : $"Les fichiers sont différents. Taille: {file1.Length} vs {file2.Length} bytes";

            return Ok(new { message, areEqual, size1 = file1.Length, size2 = file2.Length });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la comparaison: {ex.Message}" });
        }
    }

    [HttpPost("format-json")]
    public IActionResult FormatJson([FromBody] dynamic request)
    {
        try
        {
            var jsonString = request.json?.ToString() ?? "";
            var indent = request.indent?.ToString() ?? "2";
            
            var jsonElement = JsonSerializer.Deserialize<JsonElement>(jsonString);
            var options = new JsonSerializerOptions 
            { 
                WriteIndented = true,
                Encoder = System.Text.Encodings.Web.JavaScriptEncoder.UnsafeRelaxedJsonEscaping
            };
            
            if (int.TryParse(indent, out int indentSize) && indentSize > 0)
            {
                // Pour l'indentation personnalisée, on formate manuellement
                var formatted = JsonSerializer.Serialize(jsonElement, options);
                return Ok(new { formatted });
            }
            else
            {
                var formatted = JsonSerializer.Serialize(jsonElement, options);
                return Ok(new { formatted });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"JSON invalide: {ex.Message}" });
        }
    }

    [HttpPost("minify-json")]
    public IActionResult MinifyJson([FromBody] dynamic request)
    {
        try
        {
            var jsonString = request.json?.ToString() ?? "";
            var jsonElement = JsonSerializer.Deserialize<JsonElement>(jsonString);
            var minified = JsonSerializer.Serialize(jsonElement);
            return Ok(new { minified });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"JSON invalide: {ex.Message}" });
        }
    }

    [HttpPost("format-xml")]
    public IActionResult FormatXml([FromBody] dynamic request)
    {
        try
        {
            var xmlString = request.xml?.ToString() ?? "";
            var xmlDoc = new System.Xml.XmlDocument();
            xmlDoc.LoadXml(xmlString);
            
            using var stringWriter = new System.IO.StringWriter();
            using var xmlWriter = new System.Xml.XmlTextWriter(stringWriter)
            {
                Formatting = System.Xml.Formatting.Indented,
                Indentation = 2
            };
            xmlDoc.WriteTo(xmlWriter);
            
            return Ok(new { formatted = stringWriter.ToString() });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"XML invalide: {ex.Message}" });
        }
    }

    [HttpPost("beautify-html")]
    public IActionResult BeautifyHtml([FromBody] dynamic request)
    {
        try
        {
            var htmlString = request.html?.ToString() ?? "";
            // Formatage HTML basique (suppression des espaces multiples, indentation)
            var formatted = System.Text.RegularExpressions.Regex.Replace(htmlString, @">\s+<", "><");
            formatted = System.Text.RegularExpressions.Regex.Replace(formatted, @"\s+", " ");
            // Ajouter des retours à la ligne après les balises fermantes
            formatted = System.Text.RegularExpressions.Regex.Replace(formatted, @"(<[^/>]+>)([^<]+)(</[^>]+>)", "$1\n    $2\n$3");
            return Ok(new { beautified = formatted });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du formatage: {ex.Message}" });
        }
    }

    [HttpPost("minify")]
    public IActionResult Minify([FromBody] dynamic request)
    {
        try
        {
            var code = request.code?.ToString() ?? "";
            var type = request.type?.ToString() ?? "css";
            
            // Minification basique : suppression des commentaires et espaces
            var minified = code;
            
            if (type == "css")
            {
                // Supprimer les commentaires CSS
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "");
                // Supprimer les espaces multiples
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"\s+", " ");
                // Supprimer les espaces autour des caractères spéciaux
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"\s*([{}:;,])\s*", "$1");
                minified = minified.Trim();
            }
            else if (type == "js")
            {
                // Supprimer les commentaires JavaScript
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"//.*", "");
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"/\*[^*]*\*+(?:[^/*][^*]*\*+)*/", "");
                // Supprimer les espaces multiples
                minified = System.Text.RegularExpressions.Regex.Replace(minified, @"\s+", " ");
                minified = minified.Trim();
            }
            
            return Ok(new { minified });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors de la minification: {ex.Message}" });
        }
    }

    [HttpPost("base64")]
    public IActionResult Base64EncodeDecode([FromBody] dynamic request)
    {
        try
        {
            var text = request.text?.ToString() ?? "";
            var operation = request.operation?.ToString() ?? "encode";
            
            if (operation == "encode")
            {
                var bytes = System.Text.Encoding.UTF8.GetBytes(text);
                var encoded = Convert.ToBase64String(bytes);
                return Ok(new { result = encoded });
            }
            else
            {
                var bytes = Convert.FromBase64String(text);
                var decoded = System.Text.Encoding.UTF8.GetString(bytes);
                return Ok(new { result = decoded });
            }
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur: {ex.Message}" });
        }
    }

    [HttpPost("generate-uuid")]
    public IActionResult GenerateUuid([FromBody] dynamic request)
    {
        try
        {
            var count = request.count?.ToString() ?? "1";
            if (!int.TryParse(count, out int uuidCount) || uuidCount < 1 || uuidCount > 100)
            {
                return BadRequest(new { message = "Le nombre doit être entre 1 et 100" });
            }
            
            var uuids = new List<string>();
            for (int i = 0; i < uuidCount; i++)
            {
                uuids.Add(Guid.NewGuid().ToString());
            }
            
            return Ok(new { uuids });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("generate-hash")]
    public IActionResult GenerateHash([FromBody] dynamic request)
    {
        try
        {
            var text = request.text?.ToString() ?? "";
            var hashType = request.type?.ToString() ?? "md5";
            
            var inputBytes = System.Text.Encoding.UTF8.GetBytes(text);
            string hash;
            
            using (var hasher = System.Security.Cryptography.HashAlgorithm.Create(hashType.ToUpper()))
            {
                if (hasher == null)
                {
                    return BadRequest(new { message = "Type de hash non supporté" });
                }
                var hashBytes = hasher.ComputeHash(inputBytes);
                hash = BitConverter.ToString(hashBytes).Replace("-", "").ToLower();
            }
            
            return Ok(new { hash });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("generate-api-key")]
    public IActionResult GenerateApiKey([FromBody] dynamic request)
    {
        try
        {
            var length = request.length?.ToString() ?? "32";
            var prefix = request.prefix?.ToString() ?? "";
            
            if (!int.TryParse(length, out int keyLength) || keyLength < 8 || keyLength > 128)
            {
                return BadRequest(new { message = "La longueur doit être entre 8 et 128 caractères" });
            }
            
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            var random = new Random();
            var key = new string(Enumerable.Range(0, keyLength)
                .Select(_ => chars[random.Next(chars.Length)])
                .ToArray());
            
            var apiKey = prefix + key;
            
            return Ok(new { apiKey });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("compress-image")]
    public async Task<IActionResult> CompressImage(IFormFile file, [FromForm] int quality = 80)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest(new { message = "Le fichier doit être une image" });

        if (quality < 10 || quality > 100)
            return BadRequest(new { message = "La qualité doit être entre 10 et 100" });

        try
        {
            using var inputStream = file.OpenReadStream();
            using var image = await ImageSharpImage.LoadAsync(inputStream);
            
            using var outputStream = new MemoryStream();
            
            // Déterminer le format de sortie selon le format d'entrée
            var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            string contentType;
            
            if (extension == ".png" || file.ContentType == "image/png")
            {
                await image.SaveAsync(outputStream, new PngEncoder { CompressionLevel = PngCompressionLevel.BestCompression });
                contentType = "image/png";
            }
            else if (extension == ".jpg" || extension == ".jpeg" || file.ContentType == "image/jpeg")
            {
                await image.SaveAsync(outputStream, new JpegEncoder { Quality = quality });
                contentType = "image/jpeg";
            }
            else if (extension == ".webp" || file.ContentType == "image/webp")
            {
                await image.SaveAsync(outputStream, new WebpEncoder { Quality = quality });
                contentType = "image/webp";
            }
            else
            {
                // Par défaut, convertir en JPEG pour la compression
                await image.SaveAsync(outputStream, new JpegEncoder { Quality = quality });
                contentType = "image/jpeg";
            }

            outputStream.Position = 0;
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-compresse" + 
                          (contentType == "image/jpeg" ? ".jpg" : contentType == "image/png" ? ".png" : ".webp");
            
            return File(outputStream, contentType, fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la compression: {ex.Message}" });
        }
    }

    [HttpPost("resize-image")]
    public async Task<IActionResult> ResizeImage(IFormFile file, [FromForm] int width, [FromForm] int height, [FromForm] bool maintainAspectRatio = true)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest(new { message = "Le fichier doit être une image" });

        if (width < 1 || height < 1)
            return BadRequest(new { message = "Les dimensions doivent être supérieures à 0" });

        try
        {
            using var inputStream = file.OpenReadStream();
            using var image = await ImageSharpImage.LoadAsync(inputStream);
            
            int finalWidth = width;
            int finalHeight = height;
            
            if (maintainAspectRatio)
            {
                var ratio = Math.Min((double)width / image.Width, (double)height / image.Height);
                finalWidth = (int)(image.Width * ratio);
                finalHeight = (int)(image.Height * ratio);
            }
            
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new SixLabors.ImageSharp.Size(finalWidth, finalHeight),
                Mode = ResizeMode.Max
            }));
            
            using var outputStream = new MemoryStream();
            var extension = System.IO.Path.GetExtension(file.FileName).ToLower();
            
            if (extension == ".png" || file.ContentType == "image/png")
            {
                await image.SaveAsync(outputStream, new PngEncoder());
            }
            else if (extension == ".jpg" || extension == ".jpeg" || file.ContentType == "image/jpeg")
            {
                await image.SaveAsync(outputStream, new JpegEncoder { Quality = 90 });
            }
            else if (extension == ".webp" || file.ContentType == "image/webp")
            {
                await image.SaveAsync(outputStream, new WebpEncoder { Quality = 90 });
            }
            else
            {
                await image.SaveAsync(outputStream, new PngEncoder());
            }

            outputStream.Position = 0;
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + "-redimensionnee" + extension;
            
            return File(outputStream, file.ContentType, fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors du redimensionnement: {ex.Message}" });
        }
    }

    [HttpPost("generate-favicon")]
    public async Task<IActionResult> GenerateFavicon(IFormFile file, [FromForm] string sizes)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest(new { message = "Le fichier doit être une image" });

        try
        {
            var sizeList = JsonSerializer.Deserialize<string[]>(sizes) ?? new[] { "16x16", "32x32", "48x48" };
            
            using var inputStream = file.OpenReadStream();
            using var sourceImage = await ImageSharpImage.LoadAsync(inputStream);
            
            using var zipStream = new MemoryStream();
            using (var archive = new ZipArchive(zipStream, ZipArchiveMode.Create, true))
            {
                foreach (var sizeStr in sizeList)
                {
                    var sizeParts = sizeStr.Split('x');
                    if (sizeParts.Length != 2 || !int.TryParse(sizeParts[0], out int size) || size < 1)
                        continue;
                    
                    using var faviconImage = sourceImage.CloneAs<Rgba32>();
                    faviconImage.Mutate(x => x.Resize(new ResizeOptions
                    {
                        Size = new SixLabors.ImageSharp.Size(size, size),
                        Mode = ResizeMode.Max
                    }));
                    
                    var entry = archive.CreateEntry($"favicon-{sizeStr}.png");
                    using (var entryStream = entry.Open())
                    {
                        await faviconImage.SaveAsync(entryStream, new PngEncoder());
                    }
                }
            }

            zipStream.Position = 0;
            return File(zipStream, "application/zip", "favicons.zip");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("image-to-icon")]
    public async Task<IActionResult> ConvertImageToIcon(IFormFile file, [FromForm] int size = 256)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { message = "Aucun fichier fourni" });

        if (!file.ContentType.StartsWith("image/"))
            return BadRequest(new { message = "Le fichier doit être une image" });

        if (size < 16 || size > 256)
            return BadRequest(new { message = "La taille doit être entre 16 et 256 pixels" });

        try
        {
            using var inputStream = file.OpenReadStream();
            using var image = await ImageSharpImage.LoadAsync(inputStream);
            
            // Redimensionner l'image
            image.Mutate(x => x.Resize(new ResizeOptions
            {
                Size = new SixLabors.ImageSharp.Size(size, size),
                Mode = ResizeMode.Max
            }));
            
            // Convertir en PNG d'abord (les fichiers .ico sont complexes, on retourne un PNG carré)
            // Note: Pour un vrai fichier .ico, il faudrait une bibliothèque spécialisée
            using var outputStream = new MemoryStream();
            await image.SaveAsync(outputStream, new PngEncoder());
            
            outputStream.Position = 0;
            var fileName = System.IO.Path.GetFileNameWithoutExtension(file.FileName) + ".ico";
            
            // Retourner comme image/png car .ico nécessite un format spécial
            // En production, utiliser une bibliothèque .ico dédiée
            return File(outputStream, "image/png", fileName);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la conversion: {ex.Message}" });
        }
    }

    [HttpPost("generate-invoice")]
    public async Task<IActionResult> GenerateInvoice([FromBody] dynamic request)
    {
        try
        {
            var invoiceNumber = request.invoiceNumber?.ToString() ?? "";
            var invoiceDate = request.invoiceDate?.ToString() ?? DateTime.Now.ToString("yyyy-MM-dd");
            var dueDate = request.dueDate?.ToString() ?? "";
            var seller = request.seller;
            var buyer = request.buyer;
            var items = request.items;
            var notes = request.notes?.ToString() ?? "";
            var total = request.total?.ToString() ?? "0";

            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream);
            using var pdf = new PdfDocument(writer);
            var document = new iText.Layout.Document(pdf);

            // En-tête
            var header = new iText.Layout.Element.Paragraph("FACTURE")
                .SetFontSize(24)
                .SetBold()
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
            document.Add(header);

            document.Add(new iText.Layout.Element.Paragraph($"Numéro : {invoiceNumber}").SetFontSize(12));
            document.Add(new iText.Layout.Element.Paragraph($"Date : {invoiceDate}").SetFontSize(12));
            if (!string.IsNullOrEmpty(dueDate))
            {
                document.Add(new iText.Layout.Element.Paragraph($"Échéance : {dueDate}").SetFontSize(12));
            }

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Informations vendeur et client
            var infoTable = new iText.Layout.Element.Table(2);
            infoTable.SetWidth(500);
            
            var sellerCell = new iText.Layout.Element.Cell();
            sellerCell.Add(new iText.Layout.Element.Paragraph("Vendeur :").SetBold());
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.name?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.address?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.email?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.phone?.ToString() ?? ""));
            
            var buyerCell = new iText.Layout.Element.Cell();
            buyerCell.Add(new iText.Layout.Element.Paragraph("Client :").SetBold());
            buyerCell.Add(new iText.Layout.Element.Paragraph(buyer?.name?.ToString() ?? ""));
            buyerCell.Add(new iText.Layout.Element.Paragraph(buyer?.address?.ToString() ?? ""));

            infoTable.AddCell(sellerCell);
            infoTable.AddCell(buyerCell);
            document.Add(infoTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Tableau des articles
            var itemsTable = new iText.Layout.Element.Table(5);
            itemsTable.SetWidth(500);
            
            itemsTable.AddHeaderCell("Description");
            itemsTable.AddHeaderCell("Qté");
            itemsTable.AddHeaderCell("Prix unit.");
            itemsTable.AddHeaderCell("TVA %");
            itemsTable.AddHeaderCell("Total");

            if (items != null)
            {
                foreach (var item in items)
                {
                    var desc = item.description?.ToString() ?? "";
                    var qty = item.quantity?.ToString() ?? "0";
                    var price = item.unitPrice?.ToString() ?? "0";
                    var tva = item.tva?.ToString() ?? "0";
                    var subtotal = (double.Parse(qty) * double.Parse(price));
                    var tvaAmount = subtotal * (double.Parse(tva) / 100);
                    var totalItem = subtotal + tvaAmount;

                    itemsTable.AddCell(desc);
                    itemsTable.AddCell(qty);
                    itemsTable.AddCell($"{price} €");
                    itemsTable.AddCell($"{tva}%");
                    itemsTable.AddCell($"{totalItem:F2} €");
                }
            }

            document.Add(itemsTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph($"Total TTC : {total} €").SetFontSize(14).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));

            if (!string.IsNullOrEmpty(notes))
            {
                document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));
                document.Add(new iText.Layout.Element.Paragraph($"Notes : {notes}").SetFontSize(10).SetItalic());
            }

            document.Close();
            outputStream.Position = 0;

            return File(outputStream, "application/pdf", $"facture-{invoiceNumber}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("generate-quote")]
    public async Task<IActionResult> GenerateQuote([FromBody] dynamic request)
    {
        try
        {
            var quoteNumber = request.quoteNumber?.ToString() ?? "";
            var quoteDate = request.quoteDate?.ToString() ?? DateTime.Now.ToString("yyyy-MM-dd");
            var validityDate = request.validityDate?.ToString() ?? "";
            var seller = request.seller;
            var buyer = request.buyer;
            var items = request.items;
            var notes = request.notes?.ToString() ?? "";
            var total = request.total?.ToString() ?? "0";

            using var outputStream = new MemoryStream();
            using var writer = new PdfWriter(outputStream);
            using var pdf = new PdfDocument(writer);
            var document = new iText.Layout.Document(pdf);

            // En-tête
            var header = new iText.Layout.Element.Paragraph("DEVIS")
                .SetFontSize(24)
                .SetBold()
                .SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER);
            document.Add(header);

            document.Add(new iText.Layout.Element.Paragraph($"Numéro : {quoteNumber}").SetFontSize(12));
            document.Add(new iText.Layout.Element.Paragraph($"Date : {quoteDate}").SetFontSize(12));
            if (!string.IsNullOrEmpty(validityDate))
            {
                document.Add(new iText.Layout.Element.Paragraph($"Valide jusqu'au : {validityDate}").SetFontSize(12));
            }

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Informations vendeur et client
            var infoTable = new iText.Layout.Element.Table(2);
            infoTable.SetWidth(500);
            
            var sellerCell = new iText.Layout.Element.Cell();
            sellerCell.Add(new iText.Layout.Element.Paragraph("Vendeur :").SetBold());
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.name?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.address?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.email?.ToString() ?? ""));
            sellerCell.Add(new iText.Layout.Element.Paragraph(seller?.phone?.ToString() ?? ""));
            
            var buyerCell = new iText.Layout.Element.Cell();
            buyerCell.Add(new iText.Layout.Element.Paragraph("Client :").SetBold());
            buyerCell.Add(new iText.Layout.Element.Paragraph(buyer?.name?.ToString() ?? ""));
            buyerCell.Add(new iText.Layout.Element.Paragraph(buyer?.address?.ToString() ?? ""));

            infoTable.AddCell(sellerCell);
            infoTable.AddCell(buyerCell);
            document.Add(infoTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Tableau des articles
            var itemsTable = new iText.Layout.Element.Table(5);
            itemsTable.SetWidth(500);
            
            itemsTable.AddHeaderCell("Description");
            itemsTable.AddHeaderCell("Qté");
            itemsTable.AddHeaderCell("Prix unit.");
            itemsTable.AddHeaderCell("TVA %");
            itemsTable.AddHeaderCell("Total");

            if (items != null)
            {
                foreach (var item in items)
                {
                    var desc = item.description?.ToString() ?? "";
                    var qty = item.quantity?.ToString() ?? "0";
                    var price = item.unitPrice?.ToString() ?? "0";
                    var tva = item.tva?.ToString() ?? "0";
                    var subtotal = (double.Parse(qty) * double.Parse(price));
                    var tvaAmount = subtotal * (double.Parse(tva) / 100);
                    var totalItem = subtotal + tvaAmount;

                    itemsTable.AddCell(desc);
                    itemsTable.AddCell(qty);
                    itemsTable.AddCell($"{price} €");
                    itemsTable.AddCell($"{tva}%");
                    itemsTable.AddCell($"{totalItem:F2} €");
                }
            }

            document.Add(itemsTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph($"Total TTC : {total} €").SetFontSize(14).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));

            if (!string.IsNullOrEmpty(notes))
            {
                document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));
                document.Add(new iText.Layout.Element.Paragraph($"Notes : {notes}").SetFontSize(10).SetItalic());
            }

            document.Close();
            outputStream.Position = 0;

            return File(outputStream, "application/pdf", $"devis-{quoteNumber}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("calculate-vat")]
    public IActionResult CalculateVat([FromBody] dynamic request)
    {
        try
        {
            var amount = double.Parse(request.amount?.ToString() ?? "0");
            var vatRate = double.Parse(request.vatRate?.ToString() ?? "20");
            var calculationType = request.calculationType?.ToString() ?? "ht-to-ttc";

            double ht = 0, tva = 0, ttc = 0;

            switch (calculationType)
            {
                case "ht-to-ttc":
                    ht = amount;
                    tva = ht * (vatRate / 100);
                    ttc = ht + tva;
                    break;
                case "ttc-to-ht":
                    ttc = amount;
                    ht = ttc / (1 + vatRate / 100);
                    tva = ttc - ht;
                    break;
                case "vat-amount":
                    tva = amount;
                    ht = tva / (vatRate / 100);
                    ttc = ht + tva;
                    break;
            }

            return Ok(new { ht = Math.Round(ht, 2), tva = Math.Round(tva, 2), ttc = Math.Round(ttc, 2) });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("calculate-margin")]
    public IActionResult CalculateMargin([FromBody] dynamic request)
    {
        try
        {
            var calculationType = request.calculationType?.ToString() ?? "from-cost-price";
            double costPrice = 0, salePrice = 0, margin = 0, marginPercent = 0;

            switch (calculationType)
            {
                case "from-cost-price":
                    costPrice = double.Parse(request.costPrice?.ToString() ?? "0");
                    marginPercent = double.Parse(request.marginPercent?.ToString() ?? "0");
                    salePrice = costPrice / (1 - marginPercent / 100);
                    margin = salePrice - costPrice;
                    break;
                case "from-sale-price":
                    salePrice = double.Parse(request.salePrice?.ToString() ?? "0");
                    marginPercent = double.Parse(request.marginPercent?.ToString() ?? "0");
                    costPrice = salePrice * (1 - marginPercent / 100);
                    margin = salePrice - costPrice;
                    break;
                case "from-margin":
                    costPrice = double.Parse(request.costPrice?.ToString() ?? "0");
                    salePrice = double.Parse(request.salePrice?.ToString() ?? "0");
                    margin = salePrice - costPrice;
                    marginPercent = (margin / salePrice) * 100;
                    break;
            }

            return Ok(new 
            { 
                costPrice = Math.Round(costPrice, 2), 
                salePrice = Math.Round(salePrice, 2), 
                margin = Math.Round(margin, 2), 
                marginPercent = Math.Round(marginPercent, 2) 
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("simulate-credit")]
    public IActionResult SimulateCredit([FromBody] dynamic request)
    {
        try
        {
            var loanAmount = double.Parse(request.loanAmount?.ToString() ?? "0");
            var interestRate = double.Parse(request.interestRate?.ToString() ?? "0") / 100 / 12; // Taux mensuel
            var loanTerm = int.Parse(request.loanTerm?.ToString() ?? "0") * 12; // Durée en mois

            if (loanAmount <= 0 || loanTerm <= 0)
            {
                return BadRequest(new { message = "Le montant et la durée doivent être supérieurs à 0" });
            }

            // Calcul de la mensualité
            double monthlyPayment = 0;
            if (interestRate > 0)
            {
                monthlyPayment = (loanAmount * interestRate * Math.Pow(1 + interestRate, loanTerm)) / (Math.Pow(1 + interestRate, loanTerm) - 1);
            }
            else
            {
                monthlyPayment = loanAmount / loanTerm;
            }

            var totalPayment = monthlyPayment * loanTerm;
            var totalInterest = totalPayment - loanAmount;

            // Tableau d'amortissement (premiers mois)
            var schedule = new List<object>();
            double balance = loanAmount;

            for (int month = 1; month <= Math.Min(loanTerm, 12); month++)
            {
                var interestPayment = balance * interestRate;
                var principalPayment = monthlyPayment - interestPayment;
                balance -= principalPayment;

                schedule.Add(new
                {
                    month,
                    principal = Math.Round(principalPayment, 2),
                    interest = Math.Round(interestPayment, 2),
                    balance = Math.Round(Math.Max(0, balance), 2)
                });
            }

            return Ok(new
            {
                monthlyPayment = Math.Round(monthlyPayment, 2),
                totalPayment = Math.Round(totalPayment, 2),
                totalInterest = Math.Round(totalInterest, 2),
                schedule
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    // ========== OUTILS MADAGASCAR ==========

    [HttpPost("calculate-irsa")]
    public IActionResult CalculateIrsa([FromBody] dynamic request)
    {
        try
        {
            var grossSalary = double.Parse(request.grossSalary?.ToString() ?? "0");

            if (grossSalary < 0)
            {
                return BadRequest(new { message = "Le salaire brut doit être positif" });
            }

            // Barème IRSA Madagascar (exemple - à adapter selon les barèmes officiels)
            double irsa = 0;
            if (grossSalary > 350000)
            {
                var excess = grossSalary - 350000;
                if (excess <= 500000)
                {
                    irsa = excess * 0.05;
                }
                else if (excess <= 1500000)
                {
                    irsa = 500000 * 0.05 + (excess - 500000) * 0.10;
                }
                else
                {
                    irsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20;
                }
            }

            var netSalary = grossSalary - irsa;

            return Ok(new
            {
                grossSalary = Math.Round(grossSalary, 0),
                irsa = Math.Round(irsa, 0),
                netSalary = Math.Round(netSalary, 0)
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("calculate-cnaps")]
    public IActionResult CalculateCnaps([FromBody] dynamic request)
    {
        try
        {
            var grossSalary = double.Parse(request.grossSalary?.ToString() ?? "0");
            const double CONTRIBUTION_CAP = 2101440; // Plafond de cotisation en MGA (non agricole)

            if (grossSalary < 0)
            {
                return BadRequest(new { message = "Le salaire brut doit être positif" });
            }

            // CNAPS : 1% salarié + 1% employeur
            // Les cotisations sont plafonnées à 2 101 440 MGA
            var capped = grossSalary > CONTRIBUTION_CAP;
            var baseAmount = Math.Min(grossSalary, CONTRIBUTION_CAP);
            var employeeRate = 0.01;
            var employerRate = 0.01;
            var employeeContribution = baseAmount * employeeRate;
            var employerContribution = baseAmount * employerRate;
            var total = employeeContribution + employerContribution;

            return Ok(new
            {
                grossSalary = Math.Round(grossSalary, 0),
                employeeContribution = Math.Round(employeeContribution, 0),
                employerContribution = Math.Round(employerContribution, 0),
                total = Math.Round(total, 0),
                capped = capped,
                capAmount = CONTRIBUTION_CAP
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("calculate-ostie")]
    public IActionResult CalculateOstie([FromBody] dynamic request)
    {
        try
        {
            var grossSalary = double.Parse(request.grossSalary?.ToString() ?? "0");
            const double CONTRIBUTION_CAP = 2101440; // Plafond de cotisation en MGA (non agricole)

            if (grossSalary < 0)
            {
                return BadRequest(new { message = "Le salaire brut doit être positif" });
            }

            // OSTIE : 1% salarié + 1% employeur
            // Les cotisations sont plafonnées à 2 101 440 MGA
            var capped = grossSalary > CONTRIBUTION_CAP;
            var baseAmount = Math.Min(grossSalary, CONTRIBUTION_CAP);
            var employeeRate = 0.01;
            var employerRate = 0.01;
            var employeeContribution = baseAmount * employeeRate;
            var employerContribution = baseAmount * employerRate;
            var total = employeeContribution + employerContribution;

            return Ok(new
            {
                grossSalary = Math.Round(grossSalary, 0),
                employeeContribution = Math.Round(employeeContribution, 0),
                employerContribution = Math.Round(employerContribution, 0),
                total = Math.Round(total, 0),
                capped = capped,
                capAmount = CONTRIBUTION_CAP
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("calculate-gross-salary")]
    public IActionResult CalculateGrossSalary([FromBody] dynamic request)
    {
        try
        {
            var netSalary = double.Parse(request.netSalary?.ToString() ?? "0");

            if (netSalary < 0)
            {
                return BadRequest(new { message = "Le salaire net doit être positif" });
            }

            // Calcul itératif pour trouver le salaire brut
            double gross = netSalary;
            int iterations = 0;
            const int maxIterations = 20;

            const double CONTRIBUTION_CAP = 2101440; // Plafond de cotisation en MGA (non agricole)

            while (iterations < maxIterations)
            {
                // CNAPS et OSTIE : 1% chacun (salarié) - plafonnées
                var baseAmount = Math.Min(gross, CONTRIBUTION_CAP);
                var cnaps = baseAmount * 0.01;
                var ostie = baseAmount * 0.01;

                double irsa = 0;
                if (gross > 350000)
                {
                    var excess = gross - 350000;
                    if (excess <= 500000)
                    {
                        irsa = excess * 0.05;
                    }
                    else if (excess <= 1500000)
                    {
                        irsa = 500000 * 0.05 + (excess - 500000) * 0.10;
                    }
                    else
                    {
                        irsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20;
                    }
                }

                var totalDeductions = irsa + cnaps + ostie;
                var calculatedNet = gross - totalDeductions;

                if (Math.Abs(calculatedNet - netSalary) < 1) break;

                gross = netSalary + totalDeductions;
                iterations++;
            }

            // Recalcul final
            var finalBaseAmount = Math.Min(gross, CONTRIBUTION_CAP);
            var finalCnaps = finalBaseAmount * 0.01;
            var finalOstie = finalBaseAmount * 0.01;
            double finalIrsa = 0;
            if (gross > 350000)
            {
                var excess = gross - 350000;
                if (excess <= 500000)
                {
                    finalIrsa = excess * 0.05;
                }
                else if (excess <= 1500000)
                {
                    finalIrsa = 500000 * 0.05 + (excess - 500000) * 0.10;
                }
                else
                {
                    finalIrsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20;
                }
            }

            var capped = gross > CONTRIBUTION_CAP;
            return Ok(new
            {
                netSalary = Math.Round(netSalary, 0),
                irsa = Math.Round(finalIrsa, 0),
                cnaps = Math.Round(finalCnaps, 0),
                ostie = Math.Round(finalOstie, 0),
                totalDeductions = Math.Round(finalIrsa + finalCnaps + finalOstie, 0),
                grossSalary = Math.Round(gross, 0),
                capped = capped
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = $"Erreur lors du calcul: {ex.Message}" });
        }
    }

    [HttpPost("generate-payslip")]
    public async Task<IActionResult> GeneratePayslip([FromBody] dynamic request)
    {
        try
        {
            var period = request.period?.ToString() ?? "";
            var employee = request.employee;
            var company = request.company;
            var salary = request.salary;

            var outputStream = new MemoryStream();
            var writer = new PdfWriter(outputStream);
            var pdf = new PdfDocument(writer);
            var document = new iText.Layout.Document(pdf);

            // En-tête
            document.Add(new iText.Layout.Element.Paragraph("FICHE DE PAIE").SetFontSize(20).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            document.Add(new iText.Layout.Element.Paragraph($"Période : {period}").SetFontSize(12).SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Informations entreprise
            var companyTable = new iText.Layout.Element.Table(1);
            companyTable.SetWidth(500);
            companyTable.AddCell(new iText.Layout.Element.Paragraph("ENTREPRISE").SetBold());
            companyTable.AddCell(new iText.Layout.Element.Paragraph(company?.name?.ToString() ?? ""));
            companyTable.AddCell(new iText.Layout.Element.Paragraph(company?.address?.ToString() ?? ""));
            if (company?.nif != null) companyTable.AddCell(new iText.Layout.Element.Paragraph($"NIF : {company.nif}"));
            if (company?.stat != null) companyTable.AddCell(new iText.Layout.Element.Paragraph($"STAT : {company.stat}"));
            document.Add(companyTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Informations employé
            var employeeTable = new iText.Layout.Element.Table(1);
            employeeTable.SetWidth(500);
            employeeTable.AddCell(new iText.Layout.Element.Paragraph("EMPLOYÉ").SetBold());
            employeeTable.AddCell(new iText.Layout.Element.Paragraph($"Nom : {employee?.name?.ToString() ?? ""}"));
            if (employee?.id != null) employeeTable.AddCell(new iText.Layout.Element.Paragraph($"Matricule : {employee.id}"));
            if (employee?.position != null) employeeTable.AddCell(new iText.Layout.Element.Paragraph($"Poste : {employee.position}"));
            document.Add(employeeTable);

            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Détails salaire
            var gross = double.Parse(salary?.gross?.ToString() ?? "0");
            var irsa = double.Parse(salary?.irsa?.ToString() ?? "0");
            var cnapsEmp = double.Parse(salary?.cnapsEmployee?.ToString() ?? "0");
            var cnapsEmpr = double.Parse(salary?.cnapsEmployer?.ToString() ?? "0");
            var ostieEmp = double.Parse(salary?.ostieEmployee?.ToString() ?? "0");
            var ostieEmpr = double.Parse(salary?.ostieEmployer?.ToString() ?? "0");
            var bonus = double.Parse(salary?.bonus?.ToString() ?? "0");
            var deductions = double.Parse(salary?.deductions?.ToString() ?? "0");

            var salaryTable = new iText.Layout.Element.Table(2);
            salaryTable.SetWidth(500);

            salaryTable.AddCell(new iText.Layout.Element.Paragraph("SALAIRE BRUT").SetBold());
            salaryTable.AddCell(new iText.Layout.Element.Paragraph($"{gross:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));

            if (irsa > 0)
            {
                salaryTable.AddCell(new iText.Layout.Element.Paragraph("IRSA"));
                salaryTable.AddCell(new iText.Layout.Element.Paragraph($"- {irsa:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));
            }

            if (cnapsEmp > 0)
            {
                salaryTable.AddCell(new iText.Layout.Element.Paragraph("CNAPS (Salarié)"));
                salaryTable.AddCell(new iText.Layout.Element.Paragraph($"- {cnapsEmp:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));
            }

            if (ostieEmp > 0)
            {
                salaryTable.AddCell(new iText.Layout.Element.Paragraph("OSTIE (Salarié)"));
                salaryTable.AddCell(new iText.Layout.Element.Paragraph($"- {ostieEmp:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));
            }

            if (bonus > 0)
            {
                salaryTable.AddCell(new iText.Layout.Element.Paragraph("Prime/Bonus"));
                salaryTable.AddCell(new iText.Layout.Element.Paragraph($"+ {bonus:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));
            }

            if (deductions > 0)
            {
                salaryTable.AddCell(new iText.Layout.Element.Paragraph("Autres déductions"));
                salaryTable.AddCell(new iText.Layout.Element.Paragraph($"- {deductions:N0} Ar").SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));
            }

            var netSalary = gross - irsa - cnapsEmp - ostieEmp - deductions + bonus;
            salaryTable.AddCell(new iText.Layout.Element.Paragraph("SALAIRE NET").SetBold());
            salaryTable.AddCell(new iText.Layout.Element.Paragraph($"{netSalary:N0} Ar").SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.RIGHT));

            document.Add(salaryTable);

            document.Close();
            outputStream.Position = 0;

            return File(outputStream, "application/pdf", $"fiche-paie-{period}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

    [HttpPost("generate-employment-contract")]
    public async Task<IActionResult> GenerateEmploymentContract([FromBody] dynamic request)
    {
        try
        {
            var contractDate = request.contractDate?.ToString() ?? DateTime.Now.ToString("yyyy-MM-dd");
            var contractType = request.contractType?.ToString() ?? "cdi";
            var startDate = request.startDate?.ToString() ?? "";
            var endDate = request.endDate?.ToString();
            var trialPeriod = request.trialPeriod?.ToString() ?? "";
            var employee = request.employee;
            var company = request.company;
            var terms = request.terms;
            var notes = request.notes?.ToString() ?? "";

            var outputStream = new MemoryStream();
            var writer = new PdfWriter(outputStream);
            var pdf = new PdfDocument(writer);
            var document = new iText.Layout.Document(pdf);

            // Titre
            document.Add(new iText.Layout.Element.Paragraph("CONTRAT DE TRAVAIL").SetFontSize(20).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Type de contrat
            string contractTypeText = contractType switch
            {
                "cdi" => "CONTRAT À DURÉE INDÉTERMINÉE (CDI)",
                "cdd" => "CONTRAT À DURÉE DÉTERMINÉE (CDD)",
                "stage" => "CONTRAT DE STAGE",
                "interim" => "CONTRAT D'INTÉRIM",
                _ => "CONTRAT DE TRAVAIL"
            };
            document.Add(new iText.Layout.Element.Paragraph(contractTypeText).SetFontSize(14).SetBold().SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Date du contrat
            document.Add(new iText.Layout.Element.Paragraph($"Fait à {company?.address?.ToString() ?? "Madagascar"}, le {DateTime.Parse(contractDate).ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("fr-FR"))}").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Entreprise
            document.Add(new iText.Layout.Element.Paragraph("ENTRE LES SOUSSIGNÉS :").SetBold());
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(5));
            document.Add(new iText.Layout.Element.Paragraph($"La société {company?.name?.ToString() ?? ""}, " +
                $"située au {company?.address?.ToString() ?? ""}, " +
                $"NIF : {company?.nif?.ToString() ?? ""}, " +
                $"STAT : {company?.stat?.ToString() ?? ""}, " +
                $"représentée par {company?.representative?.ToString() ?? ""}, " +
                $"en qualité de {company?.representativePosition?.ToString() ?? ""}, " +
                $"ci-après dénommée « L'EMPLOYEUR »").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Employé
            document.Add(new iText.Layout.Element.Paragraph("ET :").SetBold());
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(5));
            document.Add(new iText.Layout.Element.Paragraph($"{employee?.name?.ToString() ?? ""}, " +
                $"né(e) le {(!string.IsNullOrEmpty(employee?.birthDate?.ToString()) ? DateTime.Parse(employee.birthDate.ToString()).ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("fr-FR")) : "")} " +
                $"à {employee?.birthPlace?.ToString() ?? ""}, " +
                $"porteur de la CIN n° {employee?.id?.ToString() ?? ""}, " +
                $"demeurant au {employee?.address?.ToString() ?? ""}, " +
                $"ci-après dénommé(e) « L'EMPLOYÉ(E) »").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Préambule
            document.Add(new iText.Layout.Element.Paragraph("IL A ÉTÉ CONVENU ET ARRÊTÉ CE QUI SUIT :").SetBold());
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Article 1 - Poste
            document.Add(new iText.Layout.Element.Paragraph("ARTICLE 1 - POSTE").SetBold());
            document.Add(new iText.Layout.Element.Paragraph($"L'EMPLOYEUR engage l'EMPLOYÉ(E) au poste de {employee?.position?.ToString() ?? ""}.").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Article 2 - Durée
            document.Add(new iText.Layout.Element.Paragraph("ARTICLE 2 - DURÉE DU CONTRAT").SetBold());
            if (contractType == "cdi")
            {
                document.Add(new iText.Layout.Element.Paragraph("Le présent contrat est conclu pour une durée indéterminée.").SetFontSize(10));
            }
            else
            {
                document.Add(new iText.Layout.Element.Paragraph($"Le présent contrat est conclu pour une durée déterminée du {(!string.IsNullOrEmpty(startDate) ? DateTime.Parse(startDate).ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("fr-FR")) : "")} au {(!string.IsNullOrEmpty(endDate) ? DateTime.Parse(endDate).ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("fr-FR")) : "")}.").SetFontSize(10));
            }
            document.Add(new iText.Layout.Element.Paragraph($"Le contrat prend effet le {(!string.IsNullOrEmpty(startDate) ? DateTime.Parse(startDate).ToString("dd MMMM yyyy", new System.Globalization.CultureInfo("fr-FR")) : "")}.").SetFontSize(10));
            if (!string.IsNullOrEmpty(trialPeriod))
            {
                document.Add(new iText.Layout.Element.Paragraph($"Période d'essai : {trialPeriod} jours.").SetFontSize(10));
            }
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Article 3 - Rémunération
            document.Add(new iText.Layout.Element.Paragraph("ARTICLE 3 - RÉMUNÉRATION").SetBold());
            var grossSalary = double.Parse(terms?.grossSalary?.ToString() ?? "0");
            document.Add(new iText.Layout.Element.Paragraph($"L'EMPLOYÉ(E) percevra un salaire brut mensuel de {grossSalary:N0} Ariary.").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Article 4 - Lieu et horaires
            document.Add(new iText.Layout.Element.Paragraph("ARTICLE 4 - LIEU ET HORAIRES DE TRAVAIL").SetBold());
            document.Add(new iText.Layout.Element.Paragraph($"Lieu de travail : {terms?.workLocation?.ToString() ?? ""}.").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph($"Horaires : {terms?.workSchedule?.ToString() ?? ""}.").SetFontSize(10));
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));

            // Notes
            if (!string.IsNullOrEmpty(notes))
            {
                document.Add(new iText.Layout.Element.Paragraph("AUTRES DISPOSITIONS").SetBold());
                document.Add(new iText.Layout.Element.Paragraph(notes).SetFontSize(10));
                document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(10));
            }

            // Signatures
            document.Add(new iText.Layout.Element.Paragraph(" ").SetFontSize(20));
            var signatureTable = new iText.Layout.Element.Table(2);
            signatureTable.SetWidth(500);
            signatureTable.AddCell(new iText.Layout.Element.Paragraph("L'EMPLOYEUR").SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            signatureTable.AddCell(new iText.Layout.Element.Paragraph("L'EMPLOYÉ(E)").SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            signatureTable.AddCell(new iText.Layout.Element.Paragraph(" ").SetHeight(50));
            signatureTable.AddCell(new iText.Layout.Element.Paragraph(" ").SetHeight(50));
            signatureTable.AddCell(new iText.Layout.Element.Paragraph($"{company?.representative?.ToString() ?? ""}").SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            signatureTable.AddCell(new iText.Layout.Element.Paragraph($"{employee?.name?.ToString() ?? ""}").SetTextAlignment(iText.Layout.Properties.TextAlignment.CENTER));
            document.Add(signatureTable);

            document.Close();
            outputStream.Position = 0;

            return File(outputStream, "application/pdf", $"contrat-travail-{employee?.name?.ToString()?.Replace(" ", "-") ?? "contrat"}.pdf");
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { message = $"Erreur lors de la génération: {ex.Message}" });
        }
    }

}

