import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Nettoyage CSV', description: 'Nettoyez et formatez vos fichiers CSV gratuitement.', keywords: ['nettoyer CSV', 'formater CSV'], openGraph: { title: 'Nettoyage CSV - ConviFree' }, alternates: { canonical: '/tools/clean-csv' } }
export default function CleanCsvLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

