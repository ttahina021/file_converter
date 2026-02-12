export interface Tool {
  id: string
  name: string
  icon: string
  path: string
  description: string
}

export const tools: Tool[] = [
  {
    id: 'json-to-excel',
    name: 'JSON vers Excel',
    icon: '📊',
    path: '/tools/json-to-excel',
    description: 'Convertissez vos fichiers JSON en Excel'
  },
  {
    id: 'pdf-converter',
    name: 'PDF vers Office',
    icon: '📄',
    path: '/tools/pdf-converter',
    description: 'Convertissez vos fichiers PDF en Word, Excel ou PowerPoint'
  },
  {
    id: 'image-converter',
    name: 'Convertisseur d\'images',
    icon: '🖼️',
    path: '/tools/image-converter',
    description: 'Convertissez vos images entre PNG, JPG, WebP et SVG'
  },
  {
    id: 'qr-generator',
    name: 'Générateur QR Code',
    icon: '📱',
    path: '/tools/qr-generator',
    description: 'Générez des QR codes personnalisés avec logo et couleurs'
  },
]

