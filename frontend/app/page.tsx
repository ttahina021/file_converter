import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { tools } from './config/tools'
import styles from './home.module.css'

export const metadata: Metadata = {
  title: 'Accueil',
  description: 'ConviFree - Suite d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, conversion d\'images, générateur QR Code. Aucune inscription requise, vos données restent privées.',
  keywords: ['conversion fichiers', 'JSON Excel', 'PDF Word', 'convertisseur image', 'QR code', 'outils gratuits', 'conversion gratuite'],
  openGraph: {
    title: 'ConviFree - Outils de conversion gratuits',
    description: 'Suite d\'outils de conversion 100% gratuits : JSON vers Excel, PDF vers Office, images, QR Code.',
    url: 'https://convifree.com',
  },
}

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <header className={styles.logoSection}>
          <Image
            src="/images/logo.png"
            alt="ConviFree - Logo"
            width={120}
            height={120}
            className={styles.homeLogo}
            priority
          />
        </header>
        <h1 className={styles.title}>Bienvenue dans la Boîte à outils</h1>
        <p className={styles.description}>
          Collection d'outils pratiques pour convertir et manipuler vos fichiers
        </p>

        <section className={styles.toolsGrid} aria-label="Outils disponibles">
          {tools.map((tool) => (
            <article key={tool.id}>
              <Link href={tool.path} className={styles.toolCard}>
                <div className={styles.toolIcon} aria-hidden="true">{tool.icon}</div>
                <h2 className={styles.toolName}>{tool.name}</h2>
                <p className={styles.toolDescription}>{tool.description}</p>
                <div className={styles.toolArrow} aria-hidden="true">→</div>
              </Link>
            </article>
          ))}
        </section>

        <aside className={styles.infoBox} role="note">
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> Utilisez le menu de navigation en haut pour accéder rapidement aux outils.
          </p>
        </aside>
      </div>
    </main>
  )
}
