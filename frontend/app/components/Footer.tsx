import Link from 'next/link'
import styles from './Footer.module.css'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContainer}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>ConviFree</h3>
            <p className={styles.footerDescription}>
              Outils de conversion gratuits et simples pour tous vos besoins
            </p>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>Outils</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/tools/json-to-excel" className={styles.footerLink}>
                  JSON vers Excel
                </Link>
              </li>
              <li>
                <Link href="/tools/pdf-converter" className={styles.footerLink}>
                  PDF vers Office
                </Link>
              </li>
              <li>
                <Link href="/tools/image-converter" className={styles.footerLink}>
                  Convertisseur d'images
                </Link>
              </li>
              <li>
                <Link href="/tools/qr-generator" className={styles.footerLink}>
                  Générateur QR Code
                </Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>Support</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/support" className={styles.footerLink}>
                  Offre nous un café ☕
                </Link>
              </li>
              <li>
                <a
                  href="https://buymeacoffee.com/ttahina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.footerLink}
                >
                  Buy Me a Coffee
                </a>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h4 className={styles.footerSubtitle}>À propos</h4>
            <ul className={styles.footerLinks}>
              <li>
                <Link href="/" className={styles.footerLink}>
                  Accueil
                </Link>
              </li>
              <li>
                <span className={styles.footerText}>100% Gratuit</span>
              </li>
              <li>
                <span className={styles.footerText}>Sans publicité</span>
              </li>
              <li>
                <span className={styles.footerText}>Données privées</span>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>
            © {currentYear} ConviFree. Tous droits réservés.
          </p>
          <p className={styles.tagline}>
            Outils gratuits et simples pour convertir vos fichiers
          </p>
        </div>
      </div>
    </footer>
  )
}

