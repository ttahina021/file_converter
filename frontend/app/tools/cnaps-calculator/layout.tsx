import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calcul CNAPS', description: 'Calculez les cotisations CNAPS à Madagascar gratuitement.',
  keywords: ['CNAPS', 'calcul CNAPS', 'cotisation CNAPS'],
  openGraph: { title: 'Calcul CNAPS - ConviFree' },
  alternates: { canonical: '/tools/cnaps-calculator' },
}
export default function CnapsCalculatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

