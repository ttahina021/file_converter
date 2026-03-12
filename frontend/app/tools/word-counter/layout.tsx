import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Compteur mots', description: 'Comptez les mots, caractères et paragraphes de votre texte gratuitement.',
  keywords: ['compteur mots', 'word counter', 'compteur caractères'],
  openGraph: { title: 'Compteur mots - ConviFree' },
  alternates: { canonical: '/tools/word-counter' },
}
export default function WordCounterLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

