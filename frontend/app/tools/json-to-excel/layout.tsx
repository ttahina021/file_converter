import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'JSON vers Excel',
  description: 'Convertissez vos fichiers JSON en Excel gratuitement. Support des tableaux, objets et structures complexes. Aucune inscription requise, vos données restent privées.',
  keywords: ['JSON Excel', 'convertir JSON', 'JSON vers XLSX', 'convertisseur JSON', 'JSON to Excel', 'conversion JSON'],
  openGraph: {
    title: 'Convertisseur JSON vers Excel - ConviFree',
    description: 'Convertissez vos fichiers JSON en Excel gratuitement avec visualisation et édition en ligne.',
    url: 'https://convifree.com/tools/json-to-excel',
  },
  alternates: {
    canonical: '/tools/json-to-excel',
  },
}

export default function JsonToExcelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
