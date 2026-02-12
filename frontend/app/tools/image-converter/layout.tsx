import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Convertisseur d\'images',
  description: 'Convertissez vos images entre PNG, JPG, WebP et SVG gratuitement. Conversion rapide et de qualité. Aucune inscription requise.',
  keywords: ['PNG JPG', 'convertir image', 'JPG WebP', 'convertisseur image', 'PNG vers JPG', 'WebP PNG', 'conversion image'],
  openGraph: {
    title: 'Convertisseur d\'images - ConviFree',
    description: 'Convertissez vos images entre PNG, JPG, WebP et SVG gratuitement.',
    url: 'https://convifree.com/tools/image-converter',
  },
  alternates: {
    canonical: '/tools/image-converter',
  },
}

export default function ImageConverterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
