'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function FaviconGeneratorPage() {
  const [file, setFile] = useState<File | null>(null)
  const [sizes, setSizes] = useState<string[]>(['16x16', '32x32', '48x48'])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.type.startsWith('image/')) {
        setFile(f); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner une image'); setFile(null) }
    }
  }
  
  const toggleSize = (size: string) => {
    setSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])
  }
  
  const handleGenerate = async () => {
    if (!file) { setError('Veuillez sélectionner une image'); return }
    if (sizes.length === 0) { setError('Sélectionnez au moins une taille'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('sizes', JSON.stringify(sizes))
      const response = await axios.post('http://localhost:5000/api/convert/generate-favicon', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', 'favicons.zip')
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  
  const availableSizes = ['16x16', '32x32', '48x48', '64x64', '128x128', '256x256']
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur favicon</h1>
        <p className={styles.description}>Générez des favicons à partir de vos images</p>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner une image'}
          </label>
        </div>
        <div className={styles.sizesArea}>
          <label className={styles.sizesLabel}>Tailles à générer :</label>
          <div className={styles.sizesGrid}>
            {availableSizes.map(size => (
              <label key={size} className={styles.sizeCheckbox}>
                <input type="checkbox" checked={sizes.includes(size)} onChange={() => toggleSize(size)} />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Favicons générés ! Le fichier ZIP a été téléchargé.</div>}
        <button onClick={handleGenerate} disabled={!file || sizes.length === 0 || loading} className={styles.button}>
          {loading ? 'Génération en cours...' : 'Générer les favicons'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les favicons seront générés dans différentes tailles et téléchargés dans un fichier ZIP.</p></div>
      </div>
    </main>
  )
}

