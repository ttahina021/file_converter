'use client'
import { useState } from 'react'
import styles from './page.module.css'

const CONTRIBUTION_CAP = 2101440 // Plafond de cotisation en MGA (non agricole)

export default function OstieCalculatorPage() {
  const [grossSalary, setGrossSalary] = useState('')
  const [result, setResult] = useState<{ employeeContribution: number; employerContribution: number; total: number; capped: boolean; capAmount: number } | null>(null)
  
  const calculate = () => {
    const salary = parseFloat(grossSalary)
    if (isNaN(salary) || salary < 0) {
      setResult(null)
      return
    }
    
    // OSTIE : 1% salarié + 1% employeur
    // Les cotisations sont plafonnées à 2 101 440 MGA
    const capped = salary > CONTRIBUTION_CAP
    const baseAmount = Math.min(salary, CONTRIBUTION_CAP)
    const employeeRate = 0.01
    const employerRate = 0.01
    const employeeContribution = baseAmount * employeeRate
    const employerContribution = baseAmount * employerRate
    const total = employeeContribution + employerContribution
    
    setResult({ employeeContribution, employerContribution, total, capped, capAmount: CONTRIBUTION_CAP })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Calcul OSTIE</h1>
        <p className={styles.description}>Calculez les cotisations OSTIE</p>
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
            {result.capped && (
              <div className={styles.warningItem}>
                <span className={styles.warningText}>⚠️ Plafond atteint : Les cotisations sont calculées sur {result.capAmount.toLocaleString('fr-FR')} Ar (plafond)</span>
              </div>
            )}
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Base de cotisation :</span>
              <span className={styles.resultValue}>{Math.min(parseFloat(grossSalary), result.capAmount).toLocaleString('fr-FR')} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Cotisation salarié (1%) :</span>
              <span className={styles.resultValue}>{result.employeeContribution.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Cotisation employeur (1%) :</span>
              <span className={styles.resultValue}>{result.employerContribution.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
            <div className={styles.resultItem}>
              <span className={styles.resultLabel}>Total OSTIE :</span>
              <span className={styles.resultValueHighlight}>{result.total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} Ar</span>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les cotisations sont plafonnées à {CONTRIBUTION_CAP.toLocaleString('fr-FR')} Ar (non agricole). Si le salaire brut dépasse ce plafond, les cotisations sont calculées sur la base du plafond.</p></div>
      </div>
    </main>
  )
}

