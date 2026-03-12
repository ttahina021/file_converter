import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur robots.txt', description: 'Générez un fichier robots.txt personnalisé gratuitement.',
  keywords: ['robots.txt', 'SEO', 'crawler', 'search engine'],
  openGraph: { title: 'Générateur robots.txt - ConviFree' },
  alternates: { canonical: '/tools/robots-txt-generator' },
}
export default function RobotsTxtGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

