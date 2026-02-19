import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'HTML Beautifier', description: 'Formatez et beautifiez votre code HTML gratuitement.',
  keywords: ['HTML beautifier', 'formater HTML', 'HTML formatter'],
  openGraph: { title: 'HTML Beautifier - ConviFree', description: 'Formatez et beautifiez votre code HTML.' },
  alternates: { canonical: '/tools/html-beautifier' },
}
export default function HtmlBeautifierLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

