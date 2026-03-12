'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
export default function SqlToCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.name.endsWith('.sql') || f.type === 'application/sql' || f.type === 'text/sql') {
        setFile(f); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner un fichier SQL'); setFile(null) }
    }
  }
  const handleConvert = async () => {
    if (!file) { setError('Veuillez sélectionner un fichier SQL'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file)
      const response = await axios.post(`${API_BASE_URL}/api/convert/sql-to-csv', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace('.sql', '.csv'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>SQL vers CSV</h1>
        <p className={styles.description}>Convertissez vos fichiers SQL en CSV</p>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept=".sql,application/sql,text/sql" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>{file ? file.name : 'Sélectionner un fichier SQL'}</label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier CSV a été téléchargé.</div>}
        <button onClick={handleConvert} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Conversion en cours...' : 'Convertir en CSV'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les requêtes INSERT seront converties en lignes CSV.</p></div>
      </div>
    </main>
  )
}

