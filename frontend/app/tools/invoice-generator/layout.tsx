import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur Facture PDF', description: 'Générez des factures PDF professionnelles gratuitement.',
  keywords: ['facture PDF', 'générateur facture', 'créer facture'],
  openGraph: { title: 'Générateur Facture PDF - ConviFree' },
  alternates: { canonical: '/tools/invoice-generator' },
}
export default function InvoiceGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

