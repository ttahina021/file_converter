'use client'
import { useState } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import styles from './page.module.css'
type CalculationType = 'ht-to-ttc' | 'ttc-to-ht' | 'vat-amount'
export default function VatCalculatorPage() {
  const { formatAmount } = useCurrency()
  const [calculationType, setCalculationType] = useState<CalculationType>('ht-to-ttc')
  const [amount, setAmount] = useState('')
  const [vatRate, setVatRate] = useState(20)
  const [result, setResult] = useState<{ ht: number; tva: number; ttc: number } | null>(null)
  
  const calculate = () => {
    const amountNum = parseFloat(amount)
    if (isNaN(amountNum) || amountNum < 0) {
      setResult(null)
      return
    }
    
    let ht = 0, tva = 0, ttc = 0
    
    switch (calculationType) {
      case 'ht-to-ttc':
        ht = amountNum
        tva = ht * (vatRate / 100)
        ttc = ht + tva
        break
      case 'ttc-to-ht':
        ttc = amountNum
        ht = ttc / (1 + vatRate / 100)
        tva = ttc - ht
        break
      case 'vat-amount':
        tva = amountNum
        ht = tva / (vatRate / 100)
        ttc = ht + tva
        break
    }
    
    setResult({ ht, tva, ttc })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calcul TVA</h1>
        <p className={styles.description}>Calculez la TVA de vos montants</p>
        <div className={styles.typeSelector}>
          <button className={`${styles.typeButton} ${calculationType === 'ht-to-ttc' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('ht-to-ttc'); setResult(null) }}>
            HT → TTC
          </button>
          <button className={`${styles.typeButton} ${calculationType === 'ttc-to-ht' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('ttc-to-ht'); setResult(null) }}>
            TTC → HT
          </button>
          <button className={`${styles.typeButton} ${calculationType === 'vat-amount' ? styles.typeButtonActive : ''}`} onClick={() => { setCalculationType('vat-amount'); setResult(null) }}>
            Montant TVA
          </button>
        </div>
        <div className={styles.inputArea}>
          <label className={styles.label}>
            {calculationType === 'ht-to-ttc' ? 'Montant HT' : calculationType === 'ttc-to-ht' ? 'Montant TTC' : 'Montant TVA'} :
          </label>
          <input type="number" step="0.01" min="0" value={amount} onChange={(e) => { setAmount(e.target.value); setResult(null) }} className={styles.input} placeholder="0.00" />
        </div>
        <div className={styles.inputArea}>
          <label className={styles.label}>Taux de TVA (%) :</label>
          <div className={styles.vatButtons}>
            {[5.5, 10, 20].map(rate => (
              <button key={rate} className={`${styles.vatButton} ${vatRate === rate ? styles.vatButtonActive : ''}`} onClick={() => { setVatRate(rate); setResult(null) }}>
                {rate}%
              </button>
            ))}
            <input type="number" step="0.1" min="0" max="100" value={vatRate} onChange={(e) => { setVatRate(Number(e.target.value)); setResult(null) }} className={styles.vatInput} placeholder="Taux personnalisé" />
          </div>
        </div>
        <button onClick={calculate} disabled={!amount} className={styles.calculateButton}>
          Calculer
        </button>
        {result && (
          <div className={styles.resultsBox}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Montant HT :</span>
              <span className={styles.resultValue}>{formatAmount(result.ht)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>TVA ({vatRate}%) :</span>
              <span className={styles.resultValue}>{formatAmount(result.tva)}</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Montant TTC :</span>
              <span className={styles.resultValueHighlight}>{formatAmount(result.ttc)}</span>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Vous pouvez calculer dans les deux sens : HT vers TTC ou TTC vers HT.</p></div>
      </div>
    </main>
  )
}

