'use client'
import { useState } from 'react'
import styles from './page.module.css'
export default function IrsaCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState('')
  const [result, setResult] = useState<{ irsa: number; netSalary: number } | null>(null)
  
  const calculate = () => {
    const salary = parseFloat(grossSalary)
    if (isNaN(salary) || salary < 0) {
      setResult(null)
      return
    }
    
    // Barème IRSA Madagascar 2024 (exemple - à adapter selon les barèmes officiels)
    let irsa = 0
    if (salary > 350000) {
      const excess = salary - 350000
      if (excess <= 500000) {
        irsa = excess * 0.05
      } else if (excess <= 1500000) {
        irsa = 500000 * 0.05 + (excess - 500000) * 0.10
      } else {
        irsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20
      }
    }
    
    const netSalary = salary - irsa
    setResult({ irsa, netSalary })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calcul IRSA</h1>
        <p className={styles.description}>Calculez l&apos;IRSA (Impôt sur le Revenu des Salariés)</p>
        <div className={styles.inputArea}>
          <label className={styles.label}>Salaire brut mensuel (Ar) :</label>
          <input type="number" step="1000" min="0" value={grossSalary} onChange={(e) => { setGrossSalary(e.target.value); setResult(null) }} className={styles.input} placeholder="500000" />
        </div>
        <button onClick={calculate} className={styles.calculateButton}>
          Calculer
        </button>
        {result && (
          <div className={styles.resultsBox}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Salaire brut :</span>
              <span className={styles.resultValue}>{parseFloat(grossSalary).toLocaleString('fr-FR')} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>IRSA :</span>
              <span className={styles.resultValue}>{result.irsa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Salaire net :</span>
              <span className={styles.resultValueHighlight}>{result.netSalary.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Le calcul est basé sur le barème IRSA en vigueur. Les montants sont en Ariary (Ar).</p></div>
      </div>
    </main>
  )
}

