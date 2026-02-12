'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { tools } from '../config/tools'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoContainer}>
            <Image
              src="/images/logo.png"
              alt="ConviFree - Logo"
              width={40}
              height={40}
              className={styles.logoImage}
              priority
            />
            <span className={styles.logoText}>ConviFree</span>
          </div>
        </Link>
        
        {/* Bouton hamburger pour mobile */}
        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={styles.hamburger}>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
            <span className={`${styles.hamburgerLine} ${isMenuOpen ? styles.hamburgerLineOpen : ''}`}></span>
          </span>
        </button>

        <div className={`${styles.navContent} ${isMenuOpen ? styles.navContentOpen : ''}`}>
          <div className={styles.navLinks}>
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.path}
                className={`${styles.navLink} ${pathname === tool.path ? styles.navLinkActive : ''}`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span className={styles.navIcon}>{tool.icon}</span>
                <span className={styles.navText}>{tool.name}</span>
              </Link>
            ))}
          </div>
          <Link
            href="/support"
            className={`${styles.supportLink} ${pathname === '/support' ? styles.supportLinkActive : ''}`}
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.supportIcon}>☕</span>
            <span className={styles.supportText}>Offre nous un café</span>
          </Link>
        </div>
      </div>
    </nav>
  )
}

