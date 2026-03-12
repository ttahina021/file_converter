'use client'
import { useState } from 'react'
import { useCurrency } from '../../contexts/CurrencyContext'
import styles from './page.module.css'
export default function CreditSimulatorPage() {
  const { formatAmount } = useCurrency()
  const [loanAmount, setLoanAmount] = useState('')
  const [interestRate, setInterestRate] = useState('')
  const [loanTerm, setLoanTerm] = useState('')
  const [result, setResult] = useState<{ monthlyPayment: number; totalPayment: number; totalInterest: number; schedule: Array<{ month: number; principal: number; interest: number; balance: number }> } | null>(null)
  
  const calculate = () => {
    const amount = parseFloat(loanAmount)
    const rate = parseFloat(interestRate) / 100 / 12 // Taux mensuel
    const term = parseFloat(loanTerm) * 12 // Durée en mois
    
    if (isNaN(amount) || isNaN(parseFloat(interestRate)) || isNaN(parseFloat(loanTerm)) || amount <= 0 || parseFloat(interestRate) < 0 || parseFloat(loanTerm) <= 0) {
      setResult(null)
      return
    }
    
    // Calcul de la mensualité (formule standard)
    const monthlyPayment = rate > 0 
      ? (amount * rate * Math.pow(1 + rate, term)) / (Math.pow(1 + rate, term) - 1)
      : amount / term
    
    const totalPayment = monthlyPayment * term
    const totalInterest = totalPayment - amount
    
    // Tableau d'amortissement (premiers mois)
    const schedule: Array<{ month: number; principal: number; interest: number; balance: number }> = []
    let balance = amount
    
    for (let month = 1; month <= Math.min(term, 12); month++) {
      const interestPayment = balance * rate
      const principalPayment = monthlyPayment - interestPayment
      balance -= principalPayment
      schedule.push({
        month,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      })
    }
    
    setResult({ monthlyPayment, totalPayment, totalInterest, schedule })
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Simulateur Crédit</h1>
        <p className={styles.description}>Simulez vos remboursements de crédit</p>
        <div className={styles.inputArea}>
          <div className={styles.formGroup}>
            <label>Montant du crédit :</label>
            <input type="number" step="100" min="0" value={loanAmount} onChange={(e) => { setLoanAmount(e.target.value); setResult(null) }} className={styles.input} placeholder="10000" />
          </div>
          <div className={styles.formGroup}>
            <label>Taux d&apos;intérêt annuel (%) :</label>
            <input type="number" step="0.1" min="0" value={interestRate} onChange={(e) => { setInterestRate(e.target.value); setResult(null) }} className={styles.input} placeholder="3.5" />
          </div>
          <div className={styles.formGroup}>
            <label>Durée (années) :</label>
            <input type="number" step="1" min="1" value={loanTerm} onChange={(e) => { setLoanTerm(e.target.value); setResult(null) }} className={styles.input} placeholder="5" />
          </div>
        </div>
        <button onClick={calculate} className={styles.calculateButton}>
          Calculer
        </button>
        {result && (
          <div className={styles.resultsBox}>
            <div className={styles.summaryBox}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Mensualité :</span>
                <span className={styles.summaryValue}>{formatAmount(result.monthlyPayment)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Total remboursé :</span>
              <span className={styles.summaryValue}>{formatAmount(result.totalPayment)}</span>
            </div>
            <div className={styles.summaryItem}>
              <span className={styles.summaryLabel}>Intérêts totaux :</span>
              <span className={styles.summaryValue}>{formatAmount(result.totalInterest)}</span>
              </div>
            </div>
            {result.schedule.length > 0 && (
              <div className={styles.scheduleBox}>
                <h4 className={styles.scheduleTitle}>Tableau d&apos;amortissement (12 premiers mois) :</h4>
                <div className={styles.scheduleTable}>
                  <div className={styles.scheduleHeader}>
                    <span>Mois</span>
                    <span>Capital</span>
                    <span>Intérêts</span>
                    <span>Reste dû</span>
                  </div>
                  {result.schedule.map((row) => (
                    <div key={row.month} className={styles.scheduleRow}>
                      <span>{row.month}</span>
                      <span>{formatAmount(row.principal)}</span>
                      <span>{formatAmount(row.interest)}</span>
                      <span>{formatAmount(row.balance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Le calcul utilise la formule standard d&apos;amortissement avec intérêts composés.</p></div>
      </div>
    </main>
  )
}

