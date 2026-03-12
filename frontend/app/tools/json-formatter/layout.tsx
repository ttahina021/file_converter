import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'JSON Formatter', description: 'Formatez et validez vos fichiers JSON gratuitement. Aucune inscription requise.',
  keywords: ['JSON formatter', 'formater JSON', 'valider JSON', 'JSON beautifier'],
  openGraph: { title: 'JSON Formatter - ConviFree', description: 'Formatez et validez vos fichiers JSON.', url: 'https://convifree.com/tools/json-formatter' },
  alternates: { canonical: '/tools/json-formatter' },
}
export default function JsonFormatterLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

