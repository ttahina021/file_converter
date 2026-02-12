# Améliorations SEO pour ConviFree

## ✅ Éléments SEO implémentés

### 1. Métadonnées de base
- **Title tags** : Titres uniques pour chaque page avec template
- **Meta descriptions** : Descriptions optimisées pour chaque page
- **Keywords** : Mots-clés pertinents pour chaque outil
- **Canonical URLs** : URLs canoniques pour éviter le contenu dupliqué

### 2. Open Graph & Twitter Cards
- **Open Graph** : Métadonnées pour le partage sur les réseaux sociaux
- **Twitter Cards** : Format optimisé pour Twitter
- **Images OG** : Images de partage (à créer : `/images/og-image.png`)

### 3. Structured Data (Schema.org)
- **WebSite** : Schéma pour le site web
- **Organization** : Informations sur l'organisation
- **SoftwareApplication** : Schéma pour l'application web

### 4. Fichiers techniques SEO
- **sitemap.ts** : Génération automatique du sitemap XML
- **robots.ts** : Configuration des robots d'indexation
- **manifest.ts** : Manifest PWA pour l'installation

### 5. Balises sémantiques HTML5
- Utilisation de `<header>`, `<main>`, `<section>`, `<article>`, `<aside>`
- Attributs ARIA pour l'accessibilité
- Alt text descriptifs pour les images

### 6. Métadonnées par page
Chaque page d'outil a maintenant ses propres métadonnées :
- `/tools/json-to-excel` : Métadonnées pour la conversion JSON
- `/tools/pdf-converter` : Métadonnées pour la conversion PDF
- `/tools/image-converter` : Métadonnées pour la conversion d'images
- `/tools/qr-generator` : Métadonnées pour le générateur QR
- `/support` : Métadonnées pour la page de soutien

## 📋 Actions à faire manuellement

### 1. Créer l'image Open Graph
Créez une image `/public/images/og-image.png` de 1200x630px avec :
- Le logo ConviFree
- Un texte accrocheur
- Les couleurs de la marque (bleu canard)

### 2. Ajouter les codes de vérification
Dans `app/layout.tsx`, décommentez et ajoutez vos codes de vérification :
```typescript
verification: {
  google: 'votre-code-google',
  yandex: 'votre-code-yandex',
  bing: 'votre-code-bing',
},
```

### 3. Mettre à jour l'URL de base
Si votre domaine est différent de `https://convifree.com`, mettez à jour :
- `app/layout.tsx` : `metadataBase`
- `app/sitemap.ts` : `baseUrl`
- `app/robots.ts` : `sitemap`
- `app/components/StructuredData.tsx` : toutes les URLs

### 4. Ajouter les réseaux sociaux
Dans `app/components/StructuredData.tsx`, ajoutez vos liens sociaux :
```typescript
sameAs: [
  'https://twitter.com/convifree',
  'https://facebook.com/convifree',
],
```

### 5. Soumettre le sitemap
Une fois en production, soumettez votre sitemap à :
- Google Search Console : `https://convifree.com/sitemap.xml`
- Bing Webmaster Tools
- Autres moteurs de recherche

## 🎯 Prochaines étapes recommandées

1. **Performance** : Optimiser les images (WebP, lazy loading)
2. **Accessibilité** : Ajouter plus d'attributs ARIA si nécessaire
3. **Contenu** : Ajouter du contenu textuel riche sur chaque page
4. **Liens internes** : Optimiser la structure des liens internes
5. **Analytics** : Intégrer Google Analytics ou autre outil
6. **Core Web Vitals** : Optimiser les métriques de performance

## 📊 Vérification

Utilisez ces outils pour vérifier votre SEO :
- [Google Search Console](https://search.google.com/search-console)
- [Google Rich Results Test](https://search.google.com/test/rich-results)
- [Schema Markup Validator](https://validator.schema.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

