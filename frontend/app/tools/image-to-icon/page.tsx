'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function ImageToIconPage() {
  const [file, setFile] = useState<File | null>(null)
  const [size, setSize] = useState(256)
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
  
  const handleConvert = async () => {
    if (!file) { setError('Veuillez sélectionner une image'); return }
    if (size < 16 || size > 256) { setError('La taille doit être entre 16 et 256 pixels'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('size', size.toString())
      const response = await axios.post('http://localhost:5000/api/convert/image-to-icon', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace(/\.[^.]+$/, '.ico'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Convertisseur image en icone</h1>
        <p className={styles.description}>Convertissez vos images en fichiers .ico</p>
        <div className={styles.optionsArea}>
          <label className={styles.optionLabel}>Taille de l&apos;icône : {size}x{size} pixels</label>
          <input type="range" min="16" max="256" step="16" value={size} onChange={(e) => setSize(Number(e.target.value))} className={styles.slider} />
          <div className={styles.sizePresets}>
            <button onClick={() => setSize(16)} className={size === 16 ? styles.presetActive : styles.presetButton}>16x16</button>
            <button onClick={() => setSize(32)} className={size === 32 ? styles.presetActive : styles.presetButton}>32x32</button>
            <button onClick={() => setSize(48)} className={size === 48 ? styles.presetActive : styles.presetButton}>48x48</button>
            <button onClick={() => setSize(64)} className={size === 64 ? styles.presetActive : styles.presetButton}>64x64</button>
            <button onClick={() => setSize(128)} className={size === 128 ? styles.presetActive : styles.presetButton}>128x128</button>
            <button onClick={() => setSize(256)} className={size === 256 ? styles.presetActive : styles.presetButton}>256x256</button>
          </div>
        </div>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner une image'}
          </label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier .ico a été téléchargé.</div>}
        <button onClick={handleConvert} disabled={!file || loading} className={styles.button}>
          {loading ? 'Conversion en cours...' : 'Convertir en .ico'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les fichiers .ico sont utilisés comme icônes d&apos;applications Windows.</p></div>
      </div>
    </main>
  )
}

