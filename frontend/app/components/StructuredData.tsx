export default function StructuredData() {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'ConviFree',
    alternateName: 'ConviFree - Outils de conversion gratuits',
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business, outils Madagascar',
    url: 'https://convifree.com',
    inLanguage: 'fr-FR',
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
    logo: {
      '@type': 'ImageObject',
      url: 'https://convifree.com/images/logo.png',
      width: 512,
      height: 512,
    },
    description: 'Organisation fournissant des outils de conversion gratuits et simples pour tous vos besoins professionnels et personnels',
    foundingDate: '2024',
    sameAs: [
      // Ajoutez vos réseaux sociaux ici
      // 'https://twitter.com/convifree',
      // 'https://facebook.com/convifree',
      // 'https://linkedin.com/company/convifree',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Support',
      availableLanguage: ['French', 'English'],
    },
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ConviFree',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'Web',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    softwareVersion: '1.0',
    releaseNotes: 'Suite complète d\'outils de conversion et d\'utilitaires gratuits',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
    },
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business, outils Madagascar',
    featureList: [
      'Conversion JSON vers Excel et Excel vers JSON',
      'Conversion PDF vers Word, Excel, PowerPoint',
      'Fusionner, diviser, compresser, protéger et signer PDF',
      'Conversion d\'images (PNG, JPG, WebP, SVG)',
      'Compression et redimensionnement d\'images',
      'Générateur QR Code personnalisé',
      'Générateur favicon et conversion image en icône',
      'Conversion CSV, XML, YAML, SQL',
      'Nettoyage CSV et suppression de doublons',
      'Comparateur de fichiers',
      'Formatters JSON, XML, HTML',
      'Minification CSS et JavaScript',
      'Base64 encode/decode',
      'Générateur UUID, Hash, API Key',
      'Générateur facture PDF et devis',
      'Calcul TVA, marge, simulateur crédit',
      'Calcul IRSA, CNAPS, OSTIE (Madagascar)',
      'Générateur fiche de paie et contrat de travail',
      'Outils SEO : meta tags, Open Graph, robots.txt, sitemap.xml',
      'Compteur mots et analyse densité mots-clés',
      '100% gratuit',
      'Sans inscription',
      'Données privées et sécurisées',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
      bestRating: '5',
      worstRating: '1',
    },
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

