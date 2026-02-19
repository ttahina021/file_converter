'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { menuCategories } from '../config/tools'
import CurrencySelector from './CurrencySelector'
import styles from './Navigation.module.css'

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  // Fermer le dropdown si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdown) {
        const dropdown = dropdownRefs.current[openDropdown]
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setOpenDropdown(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openDropdown])

  const handleCategoryClick = (categoryId: string, hasSubmenus: boolean, path?: string) => {
    if (hasSubmenus) {
      setOpenDropdown(openDropdown === categoryId ? null : categoryId)
    } else if (path) {
      setIsMenuOpen(false)
    }
  }

  const isCategoryActive = (category: typeof menuCategories[0]) => {
    if (category.path && pathname === category.path) return true
    return category.submenus.some(tool => tool.path && pathname === tool.path)
  }

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
            {menuCategories.map((category) => {
              const hasSubmenus = category.submenus.length > 0
              const isActive = isCategoryActive(category)
              
              return (
                <div key={category.id} className={styles.categoryContainer}>
                  {category.path && !hasSubmenus ? (
                    <Link
                      href={category.path}
                      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className={styles.navIcon}>{category.icon}</span>
                      <span className={styles.navText}>{category.name}</span>
                    </Link>
                  ) : (
                    <>
                      <button
                        className={`${styles.navLink} ${styles.navLinkDropdown} ${isActive ? styles.navLinkActive : ''}`}
                        onClick={() => handleCategoryClick(category.id, hasSubmenus, category.path)}
                        aria-expanded={openDropdown === category.id}
                        aria-haspopup="true"
                      >
                        <span className={styles.navIcon}>{category.icon}</span>
                        <span className={styles.navText}>{category.name}</span>
                        {hasSubmenus && (
                          <span className={styles.dropdownArrow}>
                            {openDropdown === category.id ? '▲' : '▼'}
                          </span>
                        )}
                      </button>
                      {hasSubmenus && (
                        <div
                          ref={(el) => { dropdownRefs.current[category.id] = el }}
                          className={`${styles.dropdown} ${openDropdown === category.id ? styles.dropdownOpen : ''}`}
                        >
                          {category.submenus.map((tool) => (
                            <Link
                              key={tool.id}
                              href={tool.path!}
                              className={`${styles.dropdownItem} ${pathname === tool.path ? styles.dropdownItemActive : ''}`}
                              onClick={() => {
                                setIsMenuOpen(false)
                                setOpenDropdown(null)
                              }}
                            >
                              <span className={styles.dropdownIcon}>{tool.icon}</span>
                              <div className={styles.dropdownContent}>
                                <span className={styles.dropdownTitle}>{tool.name}</span>
                                <span className={styles.dropdownDescription}>{tool.description}</span>
                              </div>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
          <div className={styles.navActions}>
            <CurrencySelector />
            <Link
              href="/a-propos"
              className={`${styles.navLink} ${pathname === '/a-propos' ? styles.navLinkActive : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className={styles.navText}>À propos</span>
            </Link>
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
      </div>
    </nav>
  )
}

