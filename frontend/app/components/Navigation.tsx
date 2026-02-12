'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { tools } from '../config/tools'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>🛠️</span>
          <span className={styles.logoText}>Boîte à outils</span>
        </Link>
        <div className={styles.navLinks}>
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.path}
              className={`${styles.navLink} ${pathname === tool.path ? styles.navLinkActive : ''}`}
            >
              <span className={styles.navIcon}>{tool.icon}</span>
              <span className={styles.navText}>{tool.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

