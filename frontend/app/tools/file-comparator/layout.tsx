import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Comparateur fichiers', description: 'Comparez deux fichiers pour détecter les différences gratuitement.', keywords: ['comparer fichiers', 'diff fichiers'], openGraph: { title: 'Comparateur fichiers - ConviFree' }, alternates: { canonical: '/tools/file-comparator' } }
export default function FileComparatorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

