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
]

