export interface Tool {
  id: string
  name: string
  icon: string
  path: string
  description: string
  category?: string
}

export interface MenuCategory {
  id: string
  name: string
  icon: string
  path?: string
  submenus: Tool[]
}

export const menuCategories: MenuCategory[] = [
  {
    id: 'accueil',
    name: 'Accueil',
    icon: '🏠',
    path: '/',
    submenus: []
  },
  {
    id: 'pdf',
    name: 'PDF',
    icon: '📄',
    submenus: [
      {
        id: 'pdf-converter',
        name: 'PDF vers Office',
        icon: '📄',
        path: '/tools/pdf-converter',
        description: 'Convertissez vos fichiers PDF en Word, Excel ou PowerPoint',
        category: 'pdf'
      },
      {
        id: 'merge-pdf',
        name: 'Fusionner PDF',
        icon: '🔗',
        path: '/tools/merge-pdf',
        description: 'Fusionnez plusieurs fichiers PDF en un seul document',
        category: 'pdf'
      },
      {
        id: 'split-pdf',
        name: 'Diviser PDF',
        icon: '✂️',
        path: '/tools/split-pdf',
        description: 'Divisez un PDF en plusieurs fichiers par pages',
        category: 'pdf'
      },
      {
        id: 'compress-pdf',
        name: 'Compresser PDF',
        icon: '🗜️',
        path: '/tools/compress-pdf',
        description: 'Réduisez la taille de vos fichiers PDF',
        category: 'pdf'
      },
      {
        id: 'protect-pdf',
        name: 'Protéger PDF',
        icon: '🔒',
        path: '/tools/protect-pdf',
        description: 'Ajoutez un mot de passe à votre PDF pour le protéger',
        category: 'pdf'
      },
      {
        id: 'sign-pdf',
        name: 'Signer PDF',
        icon: '✍️',
        path: '/tools/sign-pdf',
        description: 'Signez numériquement votre PDF avec une signature',
        category: 'pdf'
      }
    ]
  },
  {
    id: 'donnees',
    name: 'Données',
    icon: '📊',
    submenus: [
      {
        id: 'json-to-excel',
        name: 'JSON vers Excel',
        icon: '📊',
        path: '/tools/json-to-excel',
        description: 'Convertissez vos fichiers JSON en Excel',
        category: 'donnees'
      },
      {
        id: 'excel-to-json',
        name: 'Excel vers JSON',
        icon: '📈',
        path: '/tools/excel-to-json',
        description: 'Convertissez vos fichiers Excel en JSON',
        category: 'donnees'
      },
      {
        id: 'csv-to-json',
        name: 'CSV vers JSON',
        icon: '📋',
        path: '/tools/csv-to-json',
        description: 'Convertissez vos fichiers CSV en JSON',
        category: 'donnees'
      },
      {
        id: 'xml-to-json',
        name: 'XML vers JSON',
        icon: '📄',
        path: '/tools/xml-to-json',
        description: 'Convertissez vos fichiers XML en JSON',
        category: 'donnees'
      },
      {
        id: 'yaml-json',
        name: 'YAML ↔ JSON',
        icon: '🔄',
        path: '/tools/yaml-json',
        description: 'Convertissez entre YAML et JSON dans les deux sens',
        category: 'donnees'
      },
      {
        id: 'sql-to-csv',
        name: 'SQL vers CSV',
        icon: '🗄️',
        path: '/tools/sql-to-csv',
        description: 'Convertissez vos fichiers SQL en CSV',
        category: 'donnees'
      },
      {
        id: 'clean-csv',
        name: 'Nettoyage CSV',
        icon: '🧹',
        path: '/tools/clean-csv',
        description: 'Nettoyez et formatez vos fichiers CSV',
        category: 'donnees'
      },
      {
        id: 'remove-duplicates',
        name: 'Supprimer doublons',
        icon: '🔍',
        path: '/tools/remove-duplicates',
        description: 'Supprimez les lignes en double de vos fichiers',
        category: 'donnees'
      },
      {
        id: 'file-comparator',
        name: 'Comparateur fichiers',
        icon: '⚖️',
        path: '/tools/file-comparator',
        description: 'Comparez deux fichiers pour détecter les différences',
        category: 'donnees'
      }
    ]
  },
  {
    id: 'developpeur',
    name: 'Développeur',
    icon: '💻',
    submenus: [
      {
        id: 'json-formatter',
        name: 'JSON Formatter',
        icon: '📝',
        path: '/tools/json-formatter',
        description: 'Formatez et validez vos fichiers JSON',
        category: 'developpeur'
      },
      {
        id: 'xml-formatter',
        name: 'XML Formatter',
        icon: '📄',
        path: '/tools/xml-formatter',
        description: 'Formatez et validez vos fichiers XML',
        category: 'developpeur'
      },
      {
        id: 'html-beautifier',
        name: 'HTML Beautifier',
        icon: '🌐',
        path: '/tools/html-beautifier',
        description: 'Formatez et beautifiez votre code HTML',
        category: 'developpeur'
      },
      {
        id: 'css-js-minify',
        name: 'CSS / JS Minify',
        icon: '🗜️',
        path: '/tools/css-js-minify',
        description: 'Minifiez vos fichiers CSS et JavaScript',
        category: 'developpeur'
      },
      {
        id: 'base64',
        name: 'Base64 Encode / Decode',
        icon: '🔐',
        path: '/tools/base64',
        description: 'Encodez et décodez en Base64',
        category: 'developpeur'
      },
      {
        id: 'uuid-generator',
        name: 'Générateur UUID',
        icon: '🆔',
        path: '/tools/uuid-generator',
        description: 'Générez des identifiants UUID uniques',
        category: 'developpeur'
      },
      {
        id: 'hash-generator',
        name: 'Hash Generator',
        icon: '🔑',
        path: '/tools/hash-generator',
        description: 'Générez des hash MD5, SHA256 et plus',
        category: 'developpeur'
      },
      {
        id: 'api-key-generator',
        name: 'Générateur API Key',
        icon: '🔑',
        path: '/tools/api-key-generator',
        description: 'Générez des clés API sécurisées',
        category: 'developpeur'
      }
    ]
  },
  {
    id: 'image',
    name: 'Image',
    icon: '🖼️',
    submenus: [
      {
        id: 'image-converter',
        name: 'Convertisseur d\'images',
        icon: '🖼️',
        path: '/tools/image-converter',
        description: 'Convertissez vos images entre PNG, JPG, WebP et SVG',
        category: 'image'
      },
      {
        id: 'image-compress',
        name: 'Compression Image',
        icon: '🗜️',
        path: '/tools/image-compress',
        description: 'Compressez vos images pour réduire leur taille',
        category: 'image'
      },
      {
        id: 'image-resize',
        name: 'Redimensionnement',
        icon: '📐',
        path: '/tools/image-resize',
        description: 'Redimensionnez vos images à la taille souhaitée',
        category: 'image'
      },
      {
        id: 'favicon-generator',
        name: 'Générateur favicon',
        icon: '⭐',
        path: '/tools/favicon-generator',
        description: 'Générez des favicons à partir de vos images',
        category: 'image'
      },
      {
        id: 'image-to-icon',
        name: 'Convertisseur image en icone',
        icon: '🎯',
        path: '/tools/image-to-icon',
        description: 'Convertissez vos images en fichiers .ico',
        category: 'image'
      }
    ]
  },
  {
    id: 'business',
    name: 'Business',
    icon: '💼',
    submenus: [
      {
        id: 'qr-generator',
        name: 'Générateur QR Code',
        icon: '📱',
        path: '/tools/qr-generator',
        description: 'Générez des QR codes personnalisés avec logo et couleurs',
        category: 'business'
      },
      {
        id: 'invoice-generator',
        name: 'Générateur Facture PDF',
        icon: '🧾',
        path: '/tools/invoice-generator',
        description: 'Générez des factures PDF professionnelles',
        category: 'business'
      },
      {
        id: 'quote-generator',
        name: 'Générateur Devis',
        icon: '📄',
        path: '/tools/quote-generator',
        description: 'Créez des devis PDF professionnels',
        category: 'business'
      },
      {
        id: 'vat-calculator',
        name: 'Calcul TVA',
        icon: '💰',
        path: '/tools/vat-calculator',
        description: 'Calculez la TVA de vos montants',
        category: 'business'
      },
      {
        id: 'margin-calculator',
        name: 'Calcul Marge',
        icon: '📊',
        path: '/tools/margin-calculator',
        description: 'Calculez vos marges bénéficiaires',
        category: 'business'
      },
      {
        id: 'credit-simulator',
        name: 'Simulateur Crédit',
        icon: '🏦',
        path: '/tools/credit-simulator',
        description: 'Simulez vos remboursements de crédit',
        category: 'business'
      }
    ]
  },
  {
    id: 'seo',
    name: 'SEO',
    icon: '🔍',
    submenus: [
      {
        id: 'meta-tag-generator',
        name: 'Générateur Meta Tag',
        icon: '🏷️',
        path: '/tools/meta-tag-generator',
        description: 'Générez des balises meta optimisées pour le SEO',
        category: 'seo'
      },
      {
        id: 'open-graph-generator',
        name: 'Générateur Open Graph',
        icon: '📱',
        path: '/tools/open-graph-generator',
        description: 'Créez des balises Open Graph pour les réseaux sociaux',
        category: 'seo'
      },
      {
        id: 'robots-txt-generator',
        name: 'Générateur robots.txt',
        icon: '🤖',
        path: '/tools/robots-txt-generator',
        description: 'Générez un fichier robots.txt personnalisé',
        category: 'seo'
      },
      {
        id: 'sitemap-generator',
        name: 'Générateur sitemap.xml',
        icon: '🗺️',
        path: '/tools/sitemap-generator',
        description: 'Créez un sitemap.xml pour votre site web',
        category: 'seo'
      },
      {
        id: 'word-counter',
        name: 'Compteur mots',
        icon: '📊',
        path: '/tools/word-counter',
        description: 'Comptez les mots, caractères et paragraphes de votre texte',
        category: 'seo'
      },
      {
        id: 'keyword-density',
        name: 'Analyse densité mots-clés',
        icon: '📈',
        path: '/tools/keyword-density',
        description: 'Analysez la densité des mots-clés dans votre texte',
        category: 'seo'
      }
    ]
  },
  {
    id: 'ia',
    name: 'IA',
    icon: '🤖',
    submenus: []
  },
  {
    id: 'madagascar',
    name: 'Madagascar',
    icon: '🇲🇬',
    submenus: [
      {
        id: 'irsa-calculator',
        name: 'Calcul IRSA',
        icon: '💰',
        path: '/tools/irsa-calculator',
        description: 'Calculez l\'IRSA (Impôt sur le Revenu des Salariés)',
        category: 'madagascar'
      },
      {
        id: 'cnaps-calculator',
        name: 'Calcul CNAPS',
        icon: '🏛️',
        path: '/tools/cnaps-calculator',
        description: 'Calculez les cotisations CNAPS',
        category: 'madagascar'
      },
      {
        id: 'ostie-calculator',
        name: 'Calcul OSTIE',
        icon: '🏥',
        path: '/tools/ostie-calculator',
        description: 'Calculez les cotisations OSTIE',
        category: 'madagascar'
      },
      {
        id: 'gross-salary-calculator',
        name: 'Calcul Salaire brut',
        icon: '💵',
        path: '/tools/gross-salary-calculator',
        description: 'Calculez le salaire brut à partir du salaire net',
        category: 'madagascar'
      },
      {
        id: 'payslip-generator',
        name: 'Générateur Fiche de Paie',
        icon: '📋',
        path: '/tools/payslip-generator',
        description: 'Générez des fiches de paie PDF professionnelles',
        category: 'madagascar'
      },
      {
        id: 'employment-contract-generator',
        name: 'Générateur Contrat de Travail',
        icon: '📝',
        path: '/tools/employment-contract-generator',
        description: 'Générez des contrats de travail PDF',
        category: 'madagascar'
      }
    ]
  }
]

// Liste plate de tous les outils pour compatibilité avec l'ancien code
export const tools: Tool[] = menuCategories
  .flatMap(category => category.submenus)
  .filter(tool => tool.path !== undefined) as Tool[]

