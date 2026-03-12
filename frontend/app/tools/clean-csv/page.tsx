'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
export default function CleanCsvPage() {
  const [file, setFile] = useState<File | null>(null)
  const [options, setOptions] = useState({ removeEmptyRows: true, trimWhitespace: true, removeQuotes: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.name.endsWith('.csv') || f.type === 'text/csv') {
        setFile(f); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner un fichier CSV'); setFile(null) }
    }
  }
  const handleClean = async () => {
    if (!file) { setError('Veuillez sélectionner un fichier CSV'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('options', JSON.stringify(options))
      const response = await axios.post(`${API_BASE_URL}/api/convert/clean-csv', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace('.csv', '-nettoye.csv'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Nettoyage CSV</h1>
        <p className={styles.description}>Nettoyez et formatez vos fichiers CSV</p>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept=".csv,text/csv" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>{file ? file.name : 'Sélectionner un fichier CSV'}</label>
        </div>
        <div className={styles.optionsArea}>
          <label><input type="checkbox" checked={options.removeEmptyRows} onChange={(e) => setOptions({...options, removeEmptyRows: e.target.checked})} /> Supprimer les lignes vides</label>
          <label><input type="checkbox" checked={options.trimWhitespace} onChange={(e) => setOptions({...options, trimWhitespace: e.target.checked})} /> Supprimer les espaces</label>
          <label><input type="checkbox" checked={options.removeQuotes} onChange={(e) => setOptions({...options, removeQuotes: e.target.checked})} /> Supprimer les guillemets</label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Nettoyage réussi ! Le fichier a été téléchargé.</div>}
        <button onClick={handleClean} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Nettoyage en cours...' : 'Nettoyer le CSV'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Le fichier sera nettoyé selon les options sélectionnées.</p></div>
      </div>
    </main>
  )
}

