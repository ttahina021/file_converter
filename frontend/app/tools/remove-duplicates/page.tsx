'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function RemoveDuplicatesPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]); setError(null); setSuccess(false)
    }
  }
  const handleRemove = async () => {
    if (!file) { setError('Veuillez sélectionner un fichier'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file)
      const response = await axios.post('http://localhost:5000/api/convert/remove-duplicates', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace(/(\.[^.]+)$/, '-sans-doublons$1'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Supprimer doublons</h1>
        <p className={styles.description}>Supprimez les lignes en double de vos fichiers</p>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>{file ? file.name : 'Sélectionner un fichier'}</label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Doublons supprimés ! Le fichier a été téléchargé.</div>}
        <button onClick={handleRemove} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Traitement en cours...' : 'Supprimer les doublons'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les lignes identiques seront supprimées, seule la première occurrence sera conservée.</p></div>
      </div>
    </main>
  )
}

