import { MetadataRoute } from 'next'
import { menuCategories } from './config/tools'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://convifree.com'
  const currentDate = new Date()

  // Page d'accueil
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/support`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  // Ajouter toutes les pages d'outils
  menuCategories.forEach((category) => {
    // Page de catégorie si elle a un path
    if (category.path) {
      routes.push({
        url: `${baseUrl}${category.path}`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.9,
      })
    }

    // Pages des outils
    category.submenus.forEach((tool) => {
      if (tool.path) {
        routes.push({
          url: `${baseUrl}${tool.path}`,
          lastModified: currentDate,
          changeFrequency: 'monthly',
          priority: 0.7,
        })
      }
    })
  })

  return routes
}
