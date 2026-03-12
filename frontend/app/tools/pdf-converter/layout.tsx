import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'PDF vers Office',
  description: 'Convertissez vos fichiers PDF en Word, Excel ou PowerPoint gratuitement. Extraction de texte et conversion automatique. Aucune inscription requise.',
  keywords: ['PDF Word', 'PDF Excel', 'PDF PowerPoint', 'convertir PDF', 'PDF vers DOCX', 'PDF vers XLSX', 'PDF vers PPTX'],
  openGraph: {
    title: 'Convertisseur PDF vers Office - ConviFree',
    description: 'Convertissez vos fichiers PDF en Word, Excel ou PowerPoint gratuitement.',
    url: 'https://convifree.com/tools/pdf-converter',
  },
  alternates: {
    canonical: '/tools/pdf-converter',
  },
}

export default function PdfConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
