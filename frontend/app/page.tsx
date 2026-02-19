import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { menuCategories } from './config/tools'
import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Accueil - ConviFree | Outils de conversion gratuits',
  description: 'ConviFree - Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, conversion d\'images, générateur QR Code, outils SEO, calculatrices business, outils Madagascar. Aucune inscription requise, vos données restent privées et sécurisées.',
  keywords: [
    'conversion fichiers', 'JSON Excel', 'PDF Word', 'convertisseur image', 'QR code', 
    'outils gratuits', 'conversion gratuite', 'PDF vers Excel', 'PNG JPG', 'convertisseur gratuit',
    'fusionner PDF', 'diviser PDF', 'compresser PDF', 'protéger PDF', 'signer PDF',
    'outils SEO', 'générateur meta tag', 'open graph', 'robots.txt', 'sitemap.xml',
    'calcul TVA', 'calcul marge', 'simulateur crédit', 'générateur facture', 'générateur devis',
    'outils Madagascar', 'calcul IRSA', 'calcul CNAPS', 'calcul OSTIE', 'fiche de paie'
  ],
  openGraph: {
    title: 'ConviFree - Outils de conversion gratuits et simples',
    description: 'Suite complète d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code, outils SEO, calculatrices business.',
    url: 'https://convifree.com',
    siteName: 'ConviFree',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'ConviFree - Outils de conversion gratuits',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  alternates: {
    canonical: 'https://convifree.com',
  },
}

export default function Home() {
  const categoriesWithTools = menuCategories.filter(cat => cat.submenus.length > 0)

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <Image
              src="/images/logo.png"
              alt="ConviFree - Logo"
              width={120}
              height={120}
              className={styles.homeLogo}
              priority
            />
            <h1 className={styles.title}>
              Bienvenue sur <span className={styles.titleHighlight}>ConviFree</span>
            </h1>
            <p className={styles.subtitle}>
              Votre suite complète d&apos;outils de conversion 100% gratuits
            </p>
            <p className={styles.description}>
              Convertissez, transformez et manipulez vos fichiers en toute simplicité. 
              Aucune inscription requise, vos données restent privées et sécurisées.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="#outils" className={styles.ctaPrimary}>
                Découvrir les outils
              </Link>
              <Link href="/support" className={styles.ctaSecondary}>
                ☕ Offre nous un café
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🔒</div>
            <h3 className={styles.featureTitle}>100% Privé</h3>
            <p className={styles.featureText}>Vos fichiers sont traités localement, jamais stockés</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>⚡</div>
            <h3 className={styles.featureTitle}>Rapide & Efficace</h3>
            <p className={styles.featureText}>Conversions instantanées sans attente</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🆓</div>
            <h3 className={styles.featureTitle}>Totalement Gratuit</h3>
            <p className={styles.featureText}>Aucun abonnement, aucune limite</p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🚀</div>
            <h3 className={styles.featureTitle}>Sans Inscription</h3>
            <p className={styles.featureText}>Utilisez immédiatement, sans compte</p>
          </div>
        </section>

        {/* Tools by Category */}
        <section id="outils" className={styles.toolsSection}>
          <h2 className={styles.sectionTitle}>Explorez nos outils par catégorie</h2>
          <p className={styles.sectionDescription}>
            Organisez vos conversions selon vos besoins
          </p>

          {categoriesWithTools.map((category) => (
            <div key={category.id} className={styles.categorySection}>
              <div className={styles.categoryHeader}>
                <span className={styles.categoryIcon}>{category.icon}</span>
                <h3 className={styles.categoryTitle}>{category.name}</h3>
              </div>
              <div className={styles.toolsGrid}>
                {category.submenus.map((tool) => (
                  <article key={tool.id}>
                    <Link href={tool.path!} className={styles.toolCard}>
                      <div className={styles.toolCardHeader}>
                        <div className={styles.toolIcon} aria-hidden="true">{tool.icon}</div>
                        <h4 className={styles.toolName}>{tool.name}</h4>
                      </div>
                      <p className={styles.toolDescription}>{tool.description}</p>
                      <div className={styles.toolArrow} aria-hidden="true">→</div>
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Coming Soon Section */}
        <section className={styles.comingSoon}>
          <h2 className={styles.sectionTitle}>Bientôt disponible</h2>
          <p className={styles.sectionDescription}>
            De nouvelles catégories et outils arrivent prochainement
          </p>
          <div className={styles.comingSoonGrid}>
            {menuCategories
              .filter(cat => cat.submenus.length === 0 && cat.id !== 'accueil')
              .map((category) => (
                <div key={category.id} className={styles.comingSoonCard}>
                  <span className={styles.comingSoonIcon}>{category.icon}</span>
                  <h4 className={styles.comingSoonTitle}>{category.name}</h4>
                  <p className={styles.comingSoonText}>Bientôt disponible</p>
                </div>
              ))}
          </div>
        </section>

        {/* Info Box */}
        <aside className={styles.infoBox} role="note">
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> Utilisez le menu de navigation en haut pour accéder rapidement aux outils par catégorie.
          </p>
        </aside>
      </div>
    </main>
  )
}
