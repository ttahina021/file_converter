import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Supprimer doublons', description: 'Supprimez les lignes en double de vos fichiers gratuitement.', keywords: ['supprimer doublons', 'déduplication'], openGraph: { title: 'Supprimer doublons - ConviFree' }, alternates: { canonical: '/tools/remove-duplicates' } }
export default function RemoveDuplicatesLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

