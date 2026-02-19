import Link from 'next/link'
import styles from './page.module.css'

export default function SupportPage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>☕ Soutenez ConviFree</h1>
          <p className={styles.subtitle}>
            Une suite d&apos;outils de conversion 100% gratuits et sans publicité intrusive
          </p>
        </div>

        <div className={styles.content}>
          {/* Section principale */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>🎯 Ce que nous proposons</h2>
            <ul className={styles.featuresList}>
              <li>✅ Conversion JSON → Excel, PDF → Office, Images, QR Codes</li>
              <li>✅ Outils sans limite d&apos;utilisation</li>
              <li>✅ Aucune inscription requise</li>
              <li>✅ Vos fichiers restent privés (traitement local)</li>
            </ul>
          </section>

          {/* Pourquoi soutenir */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>💡 Pourquoi me soutenir ?</h2>
            <p className={styles.text}>
              Maintenir ces outils demande du temps et des ressources :
            </p>
            <ul className={styles.reasonsList}>
              <li>Hébergement des serveurs</li>
              <li>Développement de nouvelles fonctionnalités</li>
              <li>Maintenance et corrections de bugs</li>
              <li>Support utilisateurs</li>
            </ul>
          </section>

          {/* Ce que votre café aide */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>☕ Votre café nous aide à :</h2>
            <ul className={styles.helpList}>
              <li>Garder tous les outils 100% gratuits</li>
              <li>Ajouter de nouveaux convertisseurs</li>
              <li>Améliorer les performances</li>
              <li>Rester indépendant (pas de pub envahissante)</li>
            </ul>
            <p className={styles.highlight}>
              Chaque contribution, même petite, fait une énorme différence !<br />
              Merci de faire partie de cette aventure ! 🚀
            </p>
          </section>

          {/* Objectifs */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Objectifs / Milestones</h2>
            <div className={styles.milestones}>
              <div className={styles.milestone}>
                <span className={styles.milestoneTarget}>🎯 10 cafés/mois</span>
                <span className={styles.milestoneGoal}>→ Nouveau convertisseur vidéo</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneTarget}>🎯 25 cafés/mois</span>
                <span className={styles.milestoneGoal}>→ API publique gratuite</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneTarget}>🎯 50 cafés/mois</span>
                <span className={styles.milestoneGoal}>→ Application mobile iOS/Android</span>
              </div>
              <div className={styles.milestone}>
                <span className={styles.milestoneTarget}>🎯 100 cafés/mois</span>
                <span className={styles.milestoneGoal}>→ Traitement batch illimité</span>
              </div>
            </div>
          </section>

          {/* FAQ */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>❓ Questions fréquentes</h2>
            <div className={styles.faq}>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Pourquoi pas de la publicité ?</h3>
                <p className={styles.faqAnswer}>
                  → Je préfère garder une expérience utilisateur propre et rapide.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Les outils resteront gratuits ?</h3>
                <p className={styles.faqAnswer}>
                  → Toujours ! Votre soutien permet justement de les garder gratuits.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Mes données sont-elles sécurisées ?</h3>
                <p className={styles.faqAnswer}>
                  → 100% ! La plupart des conversions se font dans votre navigateur.
                </p>
              </div>
              <div className={styles.faqItem}>
                <h3 className={styles.faqQuestion}>Puis-je suggérer un nouvel outil ?</h3>
                <p className={styles.faqAnswer}>
                  → Absolument ! Envoyez vos idées, je les priorise pour les contributeurs.
                </p>
              </div>
            </div>
          </section>

          {/* Bouton Buy Me a Coffee */}
          <div className={styles.ctaSection}>
            <a
              href="https://buymeacoffee.com/convifree"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.coffeeButton}
            >
              <span className={styles.coffeeIcon}>☕</span>
              <span className={styles.coffeeText}>Offrir un café</span>
            </a>
            <p className={styles.ctaNote}>
              Redirection vers Buy Me a Coffee pour soutenir le projet
            </p>
          </div>

          {/* Retour */}
          <div className={styles.backSection}>
            <Link href="/" className={styles.backLink}>
              ← Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}

