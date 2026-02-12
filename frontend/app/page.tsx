import Link from 'next/link'
import Image from 'next/image'
import { tools } from './config/tools'
import styles from './home.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.logoSection}>
          <Image
            src="/images/logo.png"
              alt="ConviFree"
            width={120}
            height={120}
            className={styles.homeLogo}
            priority
          />
        </div>
        <h1 className={styles.title}>Bienvenue dans la Boîte à outils</h1>
        <p className={styles.description}>
          Collection d'outils pratiques pour convertir et manipuler vos fichiers
        </p>

        <div className={styles.toolsGrid}>
          {tools.map((tool) => (
            <Link key={tool.id} href={tool.path} className={styles.toolCard}>
              <div className={styles.toolIcon}>{tool.icon}</div>
              <h2 className={styles.toolName}>{tool.name}</h2>
              <p className={styles.toolDescription}>{tool.description}</p>
              <div className={styles.toolArrow}>→</div>
            </Link>
          ))}
        </div>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> Utilisez le menu de navigation en haut pour accéder rapidement aux outils.
          </p>
        </div>
      </div>
    </main>
  )
}
