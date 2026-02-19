import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Base64 Encode / Decode', description: 'Encodez et décodez en Base64 gratuitement.',
  keywords: ['Base64', 'encode Base64', 'decode Base64'],
  openGraph: { title: 'Base64 Encode / Decode - ConviFree' },
  alternates: { canonical: '/tools/base64' },
}
export default function Base64Layout({ children }: { children: React.ReactNode }) { return <>{children}</> }

