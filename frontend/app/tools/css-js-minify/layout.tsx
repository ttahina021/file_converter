import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'CSS / JS Minify', description: 'Minifiez vos fichiers CSS et JavaScript gratuitement.',
  keywords: ['CSS minify', 'JS minify', 'minifier CSS', 'minifier JavaScript'],
  openGraph: { title: 'CSS / JS Minify - ConviFree' },
  alternates: { canonical: '/tools/css-js-minify' },
}
export default function CssJsMinifyLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

