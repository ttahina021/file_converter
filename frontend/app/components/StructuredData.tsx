export default function StructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ConviFree',
    description: 'Outils de conversion gratuits et simples pour tous vos besoins',
    url: 'https://convifree.com',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://convifree.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ConviFree',
    url: 'https://convifree.com',
    logo: 'https://convifree.com/images/logo.png',
    description: 'Outils de conversion gratuits et simples',
    sameAs: [
      // Ajoutez vos réseaux sociaux ici
      // 'https://twitter.com/convifree',
      // 'https://facebook.com/convifree',
    ],
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ConviFree',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
    },
    description: 'Suite d\'outils de conversion gratuits : JSON vers Excel, PDF vers Office, images, QR Code',
    featureList: [
      'Conversion JSON vers Excel',
      'Conversion PDF vers Word, Excel, PowerPoint',
      'Conversion d\'images (PNG, JPG, WebP)',
      'Générateur QR Code personnalisé',
      '100% gratuit',
      'Sans inscription',
      'Données privées',
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
    </>
  )
}

