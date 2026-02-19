import type { Metadata } from 'next'
export const metadata: Metadata = {
  title: 'Générateur API Key', description: 'Générez des clés API sécurisées gratuitement.',
  keywords: ['API key', 'générateur clé API', 'API key generator'],
  openGraph: { title: 'Générateur API Key - ConviFree' },
  alternates: { canonical: '/tools/api-key-generator' },
}
export default function ApiKeyGeneratorLayout({ children }: { children: React.ReactNode }) { return <>{children}</> }

