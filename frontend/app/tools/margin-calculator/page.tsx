'use client'
import { useState } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import styles from './page.module.css'
type CalculationType = 'from-cost-price' | 'from-sale-price' | 'from-margin'
export default function MarginCalculatorPage() {
  const { formatAmount } = useCurrency()
  const [calculationType, setCalculationType] = useState<CalculationType>('from-cost-price')
  const [costPrice, setCostPrice] = useState('')
  const [salePrice, setSalePrice] = useState('')
  const [marginPercent, setMarginPercent] = useState('')
  const [result, setResult] = useState<{ costPrice: number; salePrice: number; margin: number; marginPercent: number } | null>(null)
  
  const calculate = () => {
    let cost = 0, sale = 0, margin = 0, marginPct = 0
    
    switch (calculationType) {
      case 'from-cost-price':
        cost = parseFloat(costPrice)
        marginPct = parseFloat(marginPercent)
        if (isNaN(cost) || isNaN(marginPct) || cost < 0 || marginPct < 0 || marginPct > 100) {
          setResult(null)
          return
        }
        sale = cost / (1 - marginPct / 100)
        margin = sale - cost
        break
      case 'from-sale-price':
        sale = parseFloat(salePrice)
        marginPct = parseFloat(marginPercent)
        if (isNaN(sale) || isNaN(marginPct) || sale < 0 || marginPct < 0 || marginPct > 100) {
          setResult(null)
          return
        }
        cost = sale * (1 - marginPct / 100)
        margin = sale - cost
        break
      case 'from-margin':
        cost = parseFloat(costPrice)
        sale = parseFloat(salePrice)
        if (isNaN(cost) || isNaN(sale) || cost < 0 || sale < 0 || sale < cost) {
          setResult(null)
          return
        }
        margin = sale - cost
        marginPct = (margin / sale) * 100
        break
    }
    
    setResult({ costPrice: cost, salePrice: sale, margin, marginPercent: marginPct })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calcul Marge</h1>
        <p className={styles.description}>Calculez vos marges bénéficiaires</p>
        <div className={styles.typeSelector}>
          <button className={`${styles.typeButton} ${calculationType === 'from-cost-price' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('from-cost-price'); setResult(null) }}>
            Prix d&apos;achat + Marge %
          </button>
          <button className={`${styles.typeButton} ${calculationType === 'from-sale-price' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('from-sale-price'); setResult(null) }}>
            Prix de vente + Marge %
          </button>
          <button className={`${styles.typeButton} ${calculationType === 'from-margin' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('from-margin'); setResult(null) }}>
            Prix d&apos;achat + Prix de vente
          </button>
        </div>
        <div className={styles.inputArea}>
          {calculationType !== 'from-sale-price' && (
            <div className={styles.formGroup}>
              <label>Prix d&apos;achat (€) :</label>
              <input type="number" step="0.01" min="0" value={costPrice} onChange={(e) => { setCostPrice(e.target.value); setResult(null) }} className={styles.input} placeholder="0.00" />
            </div>
          )}
          {calculationType !== 'from-cost-price' && (
            <div className={styles.formGroup}>
              <label>Prix de vente :</label>
              <input type="number" step="0.01" min="0" value={salePrice} onChange={(e) => { setSalePrice(e.target.value); setResult(null) }} className={styles.input} placeholder="0.00" />
            </div>
          )}
          {calculationType !== 'from-margin' && (
            <div className={styles.formGroup}>
              <label>Marge (%) :</label>
              <input type="number" step="0.1" min="0" max="100" value={marginPercent} onChange={(e) => { setMarginPercent(e.target.value); setResult(null) }} className={styles.input} placeholder="0.0" />
            </div>
          )}
        </div>
        <button onClick={calculate} className={styles.calculateButton}>
          Calculer
        </button>
        {result && (
          <div className={styles.resultsBox}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Prix d&apos;achat :</span>
              <span className={styles.resultValue}>{formatAmount(result.costPrice)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Prix de vente :</span>
              <span className={styles.resultValue}>{formatAmount(result.salePrice)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Marge :</span>
              <span className={styles.resultValue}>{formatAmount(result.margin)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Marge (%) :</span>
              <span className={styles.resultValueHighlight}>{result.marginPercent.toFixed(2)}%</span>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> La marge peut être calculée à partir du prix d&apos;achat, du prix de vente ou directement.</p></div>
      </div>
    </main>
  )
}

