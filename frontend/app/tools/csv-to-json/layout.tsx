import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'CSV vers JSON',
  description: 'Convertissez vos fichiers CSV en JSON gratuitement. Support des délimiteurs personnalisés. Aucune inscription requise.',
  keywords: ['CSV JSON', 'convertir CSV', 'CSV vers JSON', 'convertisseur CSV'],
  openGraph: {
    title: 'Convertisseur CSV vers JSON - ConviFree',
    description: 'Convertissez vos fichiers CSV en JSON gratuitement.',
    url: 'https://convifree.com/tools/csv-to-json',
  },
  alternates: {
    canonical: '/tools/csv-to-json',
  },
}

export default function CsvToJsonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

