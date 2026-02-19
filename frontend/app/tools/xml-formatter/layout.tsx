import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'XML Formatter', description: 'Formatez et validez vos fichiers XML gratuitement.',
  keywords: ['XML formatter', 'formater XML', 'valider XML'],
  openGraph: { title: 'XML Formatter - ConviFree', description: 'Formatez et validez vos fichiers XML.' },
  alternates: { canonical: '/tools/xml-formatter' },
}
export default function XmlFormatterLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

