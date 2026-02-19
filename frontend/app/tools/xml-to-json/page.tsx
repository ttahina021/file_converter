'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function XmlToJsonPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.name.endsWith('.xml') || f.type === 'application/xml' || f.type === 'text/xml') {
        setFile(f); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner un fichier XML'); setFile(null) }
    }
  }
  const handleConvert = async () => {
    if (!file) { setError('Veuillez sélectionner un fichier XML'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file)
      const response = await axios.post('http://localhost:5000/api/convert/xml-to-json', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace('.xml', '.json'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>XML vers JSON</h1>
        <p className={styles.description}>Convertissez vos fichiers XML en JSON</p>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept=".xml,application/xml,text/xml" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>{file ? file.name : 'Sélectionner un fichier XML'}</label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier JSON a été téléchargé.</div>}
        <button onClick={handleConvert} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Conversion en cours...' : 'Convertir en JSON'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les attributs XML seront convertis en propriétés JSON.</p></div>
      </div>
    </main>
  )
}

