import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calcul IRSA', description: 'Calculez l\'IRSA (Impôt sur le Revenu des Salariés) à Madagascar gratuitement.',
  keywords: ['IRSA', 'calcul IRSA', 'impôt Madagascar'],
  openGraph: { title: 'Calcul IRSA - ConviFree' },
  alternates: { canonical: '/tools/irsa-calculator' },
}
export default function IrsaCalculatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

