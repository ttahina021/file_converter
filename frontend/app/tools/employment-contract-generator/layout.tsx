import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur Contrat de Travail', description: 'Générez des contrats de travail PDF professionnels à Madagascar gratuitement.',
  keywords: ['contrat de travail', 'générateur contrat', 'contrat emploi'],
  openGraph: { title: 'Générateur Contrat de Travail - ConviFree' },
  alternates: { canonical: '/tools/employment-contract-generator' },
}
export default function EmploymentContractGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

