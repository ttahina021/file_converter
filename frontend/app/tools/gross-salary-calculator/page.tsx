'use client'
import { useState } from 'react'
import styles from './page.module.css'

const CONTRIBUTION_CAP = 2101440 // Plafond de cotisation en MGA (non agricole)

export default function GrossSalaryCalculatorPage() {
  const [netSalary, setNetSalary] = useState('')
  const [result, setResult] = useState<{ grossSalary: number; irsa: number; cnaps: number; ostie: number; totalDeductions: number; capped: boolean } | null>(null)
  
  const calculate = () => {
    const net = parseFloat(netSalary)
    if (isNaN(net) || net < 0) {
      setResult(null)
      return
    }
    
    // Calcul itératif pour trouver le salaire brut (approximation)
    // On part du salaire net et on ajoute les cotisations
    let gross = net
    let iterations = 0
    const maxIterations = 20
    
    while (iterations < maxIterations) {
      // CNAPS et OSTIE : 1% chacun (salarié) - plafonnées
      const baseAmount = Math.min(gross, CONTRIBUTION_CAP)
      const cnaps = baseAmount * 0.01
      const ostie = baseAmount * 0.01
      
      // IRSA (barème simplifié)
      let irsa = 0
      if (gross > 350000) {
        const excess = gross - 350000
        if (excess <= 500000) {
          irsa = excess * 0.05
        } else if (excess <= 1500000) {
          irsa = 500000 * 0.05 + (excess - 500000) * 0.10
        } else {
          irsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20
        }
      }
      
      const totalDeductions = irsa + cnaps + ostie
      const calculatedNet = gross - totalDeductions
      
      if (Math.abs(calculatedNet - net) < 1) break
      
      gross = net + totalDeductions
      iterations++
    }
    
    // Recalcul final
    const baseAmount = Math.min(gross, CONTRIBUTION_CAP)
    const cnaps = baseAmount * 0.01
    const ostie = baseAmount * 0.01
    let irsa = 0
    if (gross > 350000) {
      const excess = gross - 350000
      if (excess <= 500000) {
        irsa = excess * 0.05
      } else if (excess <= 1500000) {
        irsa = 500000 * 0.05 + (excess - 500000) * 0.10
      } else {
        irsa = 500000 * 0.05 + 1000000 * 0.10 + (excess - 1500000) * 0.20
      }
    }
    
    const capped = gross > CONTRIBUTION_CAP
    setResult({ grossSalary: gross, irsa, cnaps, ostie, totalDeductions: irsa + cnaps + ostie, capped })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calcul Salaire brut</h1>
        <p className={styles.description}>Calculez le salaire brut à partir du salaire net</p>
        <div className={styles.inputArea}>
          <label className={styles.label}>Salaire net mensuel (Ar) :</label>
          <input type="number" step="1000" min="0" value={netSalary} onChange={(e) => { setNetSalary(e.target.value); setResult(null) }} className={styles.input} placeholder="450000" />
        </div>
        <button onClick={calculate} className={styles.calculateButton}>
          Calculer
        </button>
        {result && (
          <div className={styles.resultsBox}>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Salaire net :</span>
              <span className={styles.resultValue}>{parseFloat(netSalary).toLocaleString('fr-FR')} Ar</span>
            </div>
            {result.capped && (
              <div className={styles.warningItem}>
                <span className={styles.warningText}>⚠️ Plafond atteint : Les cotisations CNAPS et OSTIE sont calculées sur {CONTRIBUTION_CAP.toLocaleString('fr-FR')} Ar (plafond)</span>
              </div>
            )}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>IRSA :</span>
              <span className={styles.resultValue}>{result.irsa.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>CNAPS (1%) :</span>
              <span className={styles.resultValue}>{result.cnaps.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>OSTIE (1%) :</span>
              <span className={styles.resultValue}>{result.ostie.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total déductions :</span>
              <span className={styles.resultValue}>{result.totalDeductions.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Salaire brut :</span>
              <span className={styles.resultValueHighlight}>{result.grossSalary.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Le calcul inclut IRSA, CNAPS et OSTIE. Les cotisations CNAPS et OSTIE sont plafonnées à {CONTRIBUTION_CAP.toLocaleString('fr-FR')} Ar (non agricole).</p></div>
      </div>
    </main>
  )
}

