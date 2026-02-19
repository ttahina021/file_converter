'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function FileComparatorPage() {
  const [file1, setFile1] = useState<File | null>(null)
  const [file2, setFile2] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const handleFile1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setFile1(e.target.files[0]); setError(null); setResult(null) }
  }
  const handleFile2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) { setFile2(e.target.files[0]); setError(null); setResult(null) }
  }
  const handleCompare = async () => {
    if (!file1 || !file2) { setError('Veuillez sélectionner deux fichiers'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const formData = new FormData(); formData.append('file1', file1); formData.append('file2', file2)
      const response = await axios.post('http://localhost:5000/api/convert/compare-files', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setResult(response.data.message || 'Comparaison terminée')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Comparateur fichiers</h1>
        <p className={styles.description}>Comparez deux fichiers pour détecter les différences</p>
        <div className={styles.uploadArea}>
          <label className={styles.uploadLabel}>Fichier 1 :</label>
          <input id="file1-input" type="file" onChange={handleFile1Change} className={styles.fileInput} />
          <label htmlFor="file1-input" className={styles.fileLabel}>{file1 ? file1.name : 'Sélectionner le premier fichier'}</label>
        </div>
        <div className={styles.uploadArea}>
          <label className={styles.uploadLabel}>Fichier 2 :</label>
          <input id="file2-input" type="file" onChange={handleFile2Change} className={styles.fileInput} />
          <label htmlFor="file2-input" className={styles.fileLabel}>{file2 ? file2.name : 'Sélectionner le deuxième fichier'}</label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {result && <div className={styles.success}>{result}</div>}
        <button onClick={handleCompare} disabled={!file1 || !file2 || loading} className={styles.convertButton}>
          {loading ? 'Comparaison en cours...' : 'Comparer les fichiers'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les différences seront affichées après la comparaison.</p></div>
      </div>
    </main>
  )
}

