'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type Currency = {
  code: string
  symbol: string
  name: string
}

export const currencies: Currency[] = [
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
  { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  { code: 'JPY', symbol: '¥', name: 'Yen Japonais' },
  { code: 'CHF', symbol: 'CHF', name: 'Franc Suisse' },
  { code: 'CAD', symbol: 'C$', name: 'Dollar Canadien' },
  { code: 'AUD', symbol: 'A$', name: 'Dollar Australien' },
  { code: 'CNY', symbol: '¥', name: 'Yuan Chinois' },
  { code: 'MAD', symbol: 'MAD', name: 'Dirham Marocain' },
  { code: 'XOF', symbol: 'FCFA', name: 'Franc CFA' },
]

type CurrencyContextType = {
  currency: Currency
  setCurrency: (currency: Currency) => void
  formatAmount: (amount: number, decimals?: number) => string
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined)

export function CurrencyProvider({ children }: { children: ReactNode }) {
  // Toujours utiliser la devise par défaut au rendu initial pour éviter l'erreur d'hydratation
  const [currency, setCurrencyState] = useState<Currency>(currencies[0])
  const [mounted, setMounted] = useState(false)

  // Charger la devise depuis localStorage uniquement après le montage côté client
  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('currency')
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          const found = currencies.find(c => c.code === parsed.code)
          if (found) {
            setCurrencyState(found)
          }
        } catch (e) {
          // Si erreur de parsing, utiliser la devise par défaut
          console.error('Error parsing saved currency:', e)
        }
      }
    }
  }, [])

  // Sauvegarder la devise dans localStorage après le montage
  useEffect(() => {
    if (mounted && typeof window !== 'undefined') {
      localStorage.setItem('currency', JSON.stringify(currency))
    }
  }, [currency, mounted])

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency)
  }

  const formatAmount = (amount: number, decimals: number = 2): string => {
    const formatted = new Intl.NumberFormat('fr-FR', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(amount)
    
    // Position du symbole selon la devise
    if (currency.symbol === '€' || currency.symbol === '£' || currency.symbol === '¥') {
      return `${formatted} ${currency.symbol}`
    } else {
      return `${currency.symbol} ${formatted}`
    }
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatAmount }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider')
  }
  return context
}

