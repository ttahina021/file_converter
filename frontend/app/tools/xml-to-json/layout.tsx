import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'XML vers JSON', description: 'Convertissez vos fichiers XML en JSON gratuitement. Aucune inscription requise.',
  keywords: ['XML JSON', 'convertir XML', 'XML vers JSON'],
  openGraph: { title: 'Convertisseur XML vers JSON - ConviFree', description: 'Convertissez vos fichiers XML en JSON gratuitement.', url: 'https://convifree.com/tools/xml-to-json' },
  alternates: { canonical: '/tools/xml-to-json' },
}
export default function XmlToJsonLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

