'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function EmploymentContractGeneratorPage() {
  const [contractDate, setContractDate] = useState(new Date().toISOString().split('T')[0])
  const [contractType, setContractType] = useState('cdi')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [trialPeriod, setTrialPeriod] = useState('')
  const [employeeName, setEmployeeName] = useState('')
  const [employeeId, setEmployeeId] = useState('')
  const [employeeAddress, setEmployeeAddress] = useState('')
  const [employeeBirthDate, setEmployeeBirthDate] = useState('')
  const [employeeBirthPlace, setEmployeeBirthPlace] = useState('')
  const [employeePosition, setEmployeePosition] = useState('')
  const [grossSalary, setGrossSalary] = useState('')
  const [workSchedule, setWorkSchedule] = useState('')
  const [workLocation, setWorkLocation] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyAddress, setCompanyAddress] = useState('')
  const [companyNif, setCompanyNif] = useState('')
  const [companyStat, setCompanyStat] = useState('')
  const [companyRepresentative, setCompanyRepresentative] = useState('')
  const [companyRepresentativePosition, setCompanyRepresentativePosition] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleGenerate = async () => {
    if (!employeeName || !companyName || !startDate || !grossSalary) {
      setError('Veuillez remplir les champs obligatoires (Nom employé, Entreprise, Date début, Salaire)')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const contractData = {
        contractDate,
        contractType,
        startDate,
        endDate: contractType === 'cdi' ? null : endDate,
        trialPeriod,
        employee: {
          name: employeeName,
          id: employeeId,
          address: employeeAddress,
          birthDate: employeeBirthDate,
          birthPlace: employeeBirthPlace,
          position: employeePosition
        },
        company: {
          name: companyName,
          address: companyAddress,
          nif: companyNif,
          stat: companyStat,
          representative: companyRepresentative,
          representativePosition: companyRepresentativePosition
        },
        terms: {
          grossSalary: parseFloat(grossSalary) || 0,
          workSchedule,
          workLocation
        },
        notes
      }

      const response = await axios.post('http://localhost:5000/api/convert/generate-employment-contract', contractData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `contrat-travail-${employeeName.replace(/\s+/g, '-')}.pdf`)
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
        <h1 className={styles.title}>Générateur Contrat de Travail</h1>
        <p className={styles.description}>Générez des contrats de travail PDF professionnels</p>
        
        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Informations du contrat</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date du contrat *</label>
              <input type="date" value={contractDate} onChange={(e) => setContractDate(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Type de contrat *</label>
              <select value={contractType} onChange={(e) => setContractType(e.target.value)} className={styles.input}>
                <option value="cdi">CDI (Contrat à Durée Indéterminée)</option>
                <option value="cdd">CDD (Contrat à Durée Déterminée)</option>
                <option value="stage">Stage</option>
                <option value="interim">Intérim</option>
              </select>
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date de début *</label>
              <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className={styles.input} />
            </div>
            {contractType === 'cdd' && (
              <div className={styles.formGroup}>
                <label className={styles.label}>Date de fin *</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.input} />
              </div>
            )}
            <div className={styles.formGroup}>
              <label className={styles.label}>Période d&apos;essai (jours)</label>
              <input type="number" value={trialPeriod} onChange={(e) => setTrialPeriod(e.target.value)} className={styles.input} placeholder="30" />
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
              <label className={styles.label}>Numéro CIN</label>
              <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} className={styles.input} placeholder="123456789012" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Adresse</label>
              <input type="text" value={employeeAddress} onChange={(e) => setEmployeeAddress(e.target.value)} className={styles.input} placeholder="Antananarivo, Madagascar" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date de naissance</label>
              <input type="date" value={employeeBirthDate} onChange={(e) => setEmployeeBirthDate(e.target.value)} className={styles.input} />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lieu de naissance</label>
              <input type="text" value={employeeBirthPlace} onChange={(e) => setEmployeeBirthPlace(e.target.value)} className={styles.input} placeholder="Antananarivo" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Poste *</label>
              <input type="text" value={employeePosition} onChange={(e) => setEmployeePosition(e.target.value)} className={styles.input} placeholder="Développeur" />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Informations entreprise</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nom de l&apos;entreprise *</label>
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
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Représentant légal</label>
              <input type="text" value={companyRepresentative} onChange={(e) => setCompanyRepresentative(e.target.value)} className={styles.input} placeholder="Pierre Martin" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Fonction du représentant</label>
              <input type="text" value={companyRepresentativePosition} onChange={(e) => setCompanyRepresentativePosition(e.target.value)} className={styles.input} placeholder="Directeur Général" />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h2 className={styles.sectionTitle}>Conditions de travail</h2>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Salaire brut mensuel (Ar) *</label>
              <input type="number" step="1000" value={grossSalary} onChange={(e) => setGrossSalary(e.target.value)} className={styles.input} placeholder="500000" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Horaires de travail</label>
              <input type="text" value={workSchedule} onChange={(e) => setWorkSchedule(e.target.value)} className={styles.input} placeholder="Lundi-Vendredi, 8h-17h" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Lieu de travail</label>
              <input type="text" value={workLocation} onChange={(e) => setWorkLocation(e.target.value)} className={styles.input} placeholder="Antananarivo" />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Notes / Clauses particulières</label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.textarea} rows={4} placeholder="Clauses particulières, avantages, etc." />
            </div>
          </div>
        </div>

        {error && <div className={styles.errorBox}>{error}</div>}
        {success && <div className={styles.successBox}>Contrat généré avec succès !</div>}

        <button onClick={handleGenerate} disabled={loading} className={styles.generateButton}>
          {loading ? 'Génération en cours...' : 'Générer le contrat'}
        </button>
      </div>
    </main>
  )
}

