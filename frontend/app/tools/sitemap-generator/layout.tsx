import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur sitemap.xml', description: 'Créez un sitemap.xml pour votre site web gratuitement.',
  keywords: ['sitemap', 'sitemap.xml', 'SEO', 'search engine'],
  openGraph: { title: 'Générateur sitemap.xml - ConviFree' },
  alternates: { canonical: '/tools/sitemap-generator' },
}
export default function SitemapGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

