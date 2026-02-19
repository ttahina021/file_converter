'use client'

import { useState, useRef, useEffect } from 'react'
import { useCurrency, currencies } from '../contexts/CurrencyContext'
import { usePathname } from 'next/navigation'
import styles from './CurrencySelector.module.css'

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Vérifier si on est dans une page Madagascar
  const isMadagascarPage = pathname?.includes('/tools/irsa-calculator') ||
    pathname?.includes('/tools/cnaps-calculator') ||
    pathname?.includes('/tools/ostie-calculator') ||
    pathname?.includes('/tools/gross-salary-calculator') ||
    pathname?.includes('/tools/payslip-generator') ||
    pathname?.includes('/tools/employment-contract-generator')

  // S'assurer que le composant est monté côté client avant d'afficher le contenu
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (isMadagascarPage || !mounted) return
    
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMadagascarPage, mounted])

  // Ne pas afficher le sélecteur sur les pages Madagascar
  if (isMadagascarPage) {
    return null
  }

  // Afficher un placeholder pendant le montage pour éviter l'erreur d'hydratation
  if (!mounted) {
    return (
      <div className={styles.currencySelector} ref={dropdownRef}>
        <button
          className={styles.currencyButton}
          aria-label="Sélectionner la devise"
          disabled
        >
          <span className={styles.currencySymbol}>€</span>
          <span className={styles.currencyCode}>EUR</span>
          <span className={styles.dropdownIcon}>▼</span>
        </button>
      </div>
    )
  }

  return (
    <div className={styles.currencySelector} ref={dropdownRef}>
      <button
        className={styles.currencyButton}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Sélectionner la devise"
      >
        <span className={styles.currencySymbol}>{currency.symbol}</span>
        <span className={styles.currencyCode}>{currency.code}</span>
        <span className={styles.dropdownIcon}>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className={styles.dropdown}>
          {currencies.map((curr) => (
            <button
              key={curr.code}
              className={`${styles.currencyOption} ${currency.code === curr.code ? styles.currencyOptionActive : ''}`}
              onClick={() => {
                setCurrency(curr)
                setIsOpen(false)
              }}
            >
              <span className={styles.optionSymbol}>{curr.symbol}</span>
              <span className={styles.optionCode}>{curr.code}</span>
              <span className={styles.optionName}>{curr.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

