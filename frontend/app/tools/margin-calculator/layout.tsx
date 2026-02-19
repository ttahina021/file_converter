import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calcul Marge', description: 'Calculez vos marges bénéficiaires gratuitement.',
  keywords: ['calcul marge', 'marge bénéficiaire', 'calculer marge'],
  openGraph: { title: 'Calcul Marge - ConviFree' },
  alternates: { canonical: '/tools/margin-calculator' },
}
export default function MarginCalculatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

