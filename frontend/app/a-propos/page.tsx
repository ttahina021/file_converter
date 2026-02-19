import type { Metadata } from 'next'
import Image from 'next/image'
import styles from './page.module.css'

export const metadata: Metadata = {
  title: 'À propos - ConviFree',
  description: 'Découvrez l\'histoire et la mission de ConviFree, votre suite d\'outils de conversion gratuits et simples.',
  openGraph: {
    title: 'À propos - ConviFree',
    description: 'Découvrez l\'histoire et la mission de ConviFree',
    url: 'https://convifree.com/a-propos',
  },
}

export default function AboutPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <div className={styles.logoContainer}>
              <Image
                src="/images/logo.png"
                alt="ConviFree Logo"
                width={120}
                height={120}
                className={styles.logo}
                priority
              />
            </div>
            <h1 className={styles.title}>À propos de ConviFree</h1>
            <p className={styles.subtitle}>
              Votre suite complète d&apos;outils de conversion 100% gratuits
            </p>
          </div>
        </section>

        <section className={styles.content}>
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notre Mission</h2>
            <div className={styles.textContent}>
              <p>
                ConviFree est né d&apos;une simple idée : rendre les outils de conversion 
                accessibles à tous, sans barrières. Nous croyons que la technologie devrait 
                être simple, gratuite et respectueuse de votre vie privée.
              </p>
              <p>
                Notre mission est de fournir une suite complète d&apos;outils de conversion 
                qui vous permettent de transformer, manipuler et optimiser vos fichiers 
                en toute simplicité, sans avoir besoin de créer un compte ou de payer 
                des frais cachés.
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Vos Données, Notre Priorité</h2>
            <div className={styles.textContent}>
              <p>
                Chez ConviFree, votre vie privée est au cœur de tout ce que nous faisons. 
                Tous vos fichiers sont traités localement sur nos serveurs et sont 
                automatiquement supprimés après le traitement. Nous ne stockons jamais 
                vos données, ne les partageons pas avec des tiers, et ne vous suivons pas.
              </p>
              <p>
                <strong>100% gratuit, 100% privé, 100% transparent.</strong>
              </p>
            </div>
          </div>

          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Notre Histoire</h2>
            <div className={styles.textContent}>
              {/* Votre description personnelle ici */}
              <p>
                [Votre description personnelle sera ajoutée ici]
              </p>
            </div>
          </div>

          <div className={styles.features}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🔒</div>
              <h3 className={styles.featureTitle}>100% Privé</h3>
              <p className={styles.featureText}>
                Vos fichiers ne sont jamais stockés ni partagés
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3 className={styles.featureTitle}>Rapide</h3>
              <p className={styles.featureText}>
                Conversions instantanées sans attente
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🆓</div>
              <h3 className={styles.featureTitle}>Gratuit</h3>
              <p className={styles.featureText}>
                Aucun abonnement, aucune limite
              </p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🚀</div>
              <h3 className={styles.featureTitle}>Sans Inscription</h3>
              <p className={styles.featureText}>
                Utilisez immédiatement, sans compte
              </p>
            </div>
          </div>

          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Prêt à commencer ?</h2>
            <p className={styles.ctaText}>
              Explorez nos outils et découvrez comment ConviFree peut vous aider
            </p>
            <a href="/#outils" className={styles.ctaButton}>
              Découvrir les outils
            </a>
          </div>
        </section>
      </div>
    </main>
  )
}

