import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Excel vers JSON',
  description: 'Convertissez vos fichiers Excel en JSON gratuitement. Support des fichiers .xlsx et .xls. Aucune inscription requise.',
  keywords: ['Excel JSON', 'convertir Excel', 'Excel vers JSON', 'XLSX JSON', 'convertisseur Excel'],
  openGraph: {
    title: 'Convertisseur Excel vers JSON - ConviFree',
    description: 'Convertissez vos fichiers Excel en JSON gratuitement.',
    url: 'https://convifree.com/tools/excel-to-json',
  },
  alternates: {
    canonical: '/tools/excel-to-json',
  },
}

export default function ExcelToJsonLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}

