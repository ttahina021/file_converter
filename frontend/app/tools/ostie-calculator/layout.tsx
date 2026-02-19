import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calcul OSTIE', description: 'Calculez les cotisations OSTIE à Madagascar gratuitement.',
  keywords: ['OSTIE', 'calcul OSTIE', 'cotisation OSTIE'],
  openGraph: { title: 'Calcul OSTIE - ConviFree' },
  alternates: { canonical: '/tools/ostie-calculator' },
}
export default function OstieCalculatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

