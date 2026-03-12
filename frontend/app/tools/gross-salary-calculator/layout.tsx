import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Calcul Salaire brut', description: 'Calculez le salaire brut à partir du salaire net à Madagascar.',
  keywords: ['salaire brut', 'calcul salaire', 'salaire net'],
  openGraph: { title: 'Calcul Salaire brut - ConviFree' },
  alternates: { canonical: '/tools/gross-salary-calculator' },
}
export default function GrossSalaryCalculatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

