'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function PayslipGeneratorPage() {
  const [period, setPeriod] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [employeePosition, setEmployeePosition] = useState('')
  const [hireDate, setHireDate] = useState('')
  const [grossSalary, setGrossSalary] = useState('')
  const [irsa, setIrsa] = useState('')
  const [cnapsEmployee, setCnapsEmployee] = useState('')
  const [cnapsEmployer, setCnapsEmployer] = useState('')
  const [ostieEmployee, setOstieEmployee] = useState('')
  const [ostieEmployer, setOstieEmployer] = useState('')
  const [bonus, setBonus] = useState('')
  const [deductions, setDeductions] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyNif, setCompanyNif] = useState('')
  const [companyStat, setCompanyStat] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerate = async () => {
    if (!period || !employeeName || !grossSalary) {
      setError('Veuillez remplir les champs obligatoires (Période, Nom employé, Salaire brut)')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const payslipData = {
        period,
        employee: {
          name: employeeName,
          id: employeeId,
          position: employeePosition,
          hireDate
        },
        company: {
          name: companyName,
          address: companyAddress,
          nif: companyNif,
          stat: companyStat
        },
        salary: {
          gross: parseFloat(grossSalary) || 0,
          irsa: parseFloat(irsa) || 0,
          cnapsEmployee: parseFloat(cnapsEmployee) || 0,
          cnapsEmployer: parseFloat(cnapsEmployer) || 0,
          ostieEmployee: parseFloat(ostieEmployee) || 0,
          ostieEmployer: parseFloat(ostieEmployer) || 0,
          bonus: parseFloat(bonus) || 0,
          deductions: parseFloat(deductions) || 0
        }
      }

      const response = await axios.post('http://localhost:5000/api/convert/generate-payslip', payslipData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `fiche-paie-${period}-${employeeName.replace(/\s+/g, '-')}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur Fiche de Paie</h1>
        <p className={styles.description}>Générez des fiches de paie PDF professionnelles</p>
        
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Informations de la période</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Période (ex: Janvier 2024) *</label>
              <input type="text" value={period} onChange={(e) => setPeriod(e.target.value)} className={styles.input} placeholder="Janvier 2024" />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Informations employé</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nom complet *</label>
              <input type="text" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} className={styles.input} placeholder="Jean Dupont" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Matricule</label>
              <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={styles.input} placeholder="EMP001" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Poste</label>
              <input type="text" value={employeePosition} onChange={(e) => setEmployeePosition(e.target.value)} className={styles.input} placeholder="Développeur" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date d&apos;embauche</label>
              <input type="date" value={hireDate} onChange={(e) => setHireDate(e.target.value)} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Informations entreprise</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nom de l&apos;entreprise</label>
              <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className={styles.input} placeholder="Mon Entreprise SARL" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>NIF</label>
              <input type="text" value={companyNif} onChange={(e) => setCompanyNif(e.target.value)} className={styles.input} placeholder="1234567890" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Adresse</label>
              <input type="text" value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} className={styles.input} placeholder="Antananarivo, Madagascar" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>STAT</label>
              <input type="text" value={companyStat} onChange={(e) => setCompanyStat(e.target.value)} className={styles.input} placeholder="12345 11 20234 0 0 0" />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Salaire et cotisations</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Salaire brut (Ar) *</label>
              <input type="number" step="1000" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className={styles.input} placeholder="500000" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>IRSA (Ar)</label>
              <input type="number" step="1000" value={irsa} onChange={(e) => setIrsa(e.target.value)} className={styles.input} placeholder="0" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>CNAPS Salarié (Ar)</label>
              <input type="number" step="1000" value={cnapsEmployee} onChange={(e) => setCnapsEmployee(e.target.value)} className={styles.input} placeholder="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>CNAPS Employeur (Ar)</label>
              <input type="number" step="1000" value={cnapsEmployer} onChange={(e) => setCnapsEmployer(e.target.value)} className={styles.input} placeholder="0" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>OSTIE Salarié (Ar)</label>
              <input type="number" step="1000" value={ostieEmployee} onChange={(e) => setOstieEmployee(e.target.value)} className={styles.input} placeholder="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>OSTIE Employeur (Ar)</label>
              <input type="number" step="1000" value={ostieEmployer} onChange={(e) => setOstieEmployer(e.target.value)} className={styles.input} placeholder="0" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Prime/Bonus (Ar)</label>
              <input type="number" step="1000" value={bonus} onChange={(e) => setBonus(e.target.value)} className={styles.input} placeholder="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Autres déductions (Ar)</label>
              <input type="number" step="1000" value={deductions} onChange={(e) => setDeductions(e.target.value)} className={styles.input} placeholder="0" />
            </div>
          </div>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>Fiche de paie générée avec succès !</div>}

        <button onClick={handleGenerate} disabled={loading} className={styles.generateButton}>
          {loading ? 'Génération en cours...' : 'Générer la fiche de paie'}
        </button>
      </div>
    </main>
  )
}

