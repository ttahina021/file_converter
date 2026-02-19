'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null)
  const [quality, setQuality] = useState(80)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.type.startsWith('image/')) {
        setFile(f); setOriginalSize(f.size); setCompressedSize(null); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner une image'); setFile(null) }
    }
  }
  
  const handleCompress = async () => {
    if (!file) { setError('Veuillez sélectionner une image'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('quality', quality.toString())
      const response = await axios.post('http://localhost:5000/api/convert/compress-image', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const contentLength = response.headers['content-length']
      if (contentLength) setCompressedSize(parseInt(contentLength))
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace(/\.[^.]+$/, '-compresse' + file.name.match(/\.[^.]+$/)?.[0]))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024; const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }
  
  const calculateReduction = () => {
    if (originalSize && compressedSize) {
      const reduction = ((originalSize - compressedSize) / originalSize) * 100
      return Math.round(reduction * 100) / 100
    }
    return null
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Compression Image</h1>
        <p className={styles.description}>Compressez vos images pour réduire leur taille</p>
        <div className={styles.optionsArea}>
          <label className={styles.optionLabel}>Qualité de compression : {quality}%</label>
          <input type="range" min="10" max="100" value={quality} onChange={(e) => setQuality(Number(e.target.value))} className={styles.slider} />
          <div className={styles.sliderLabels}>
            <span>Faible (petite taille)</span>
            <span>Élevée (meilleure qualité)</span>
          </div>
        </div>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>🖼️</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{file.name}</span>
                  {originalSize && <span className={styles.fileSize}>Taille originale : {formatFileSize(originalSize)}</span>}
                </div>
              </div>
            ) : 'Sélectionner une image'}
          </label>
        </div>
        {success && originalSize && compressedSize && (
          <div className={styles.statsBox}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Taille originale :</span>
              <span className={styles.statValue}>{formatFileSize(originalSize)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Taille compressée :</span>
              <span className={styles.statValue}>{formatFileSize(compressedSize)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Réduction :</span>
              <span className={styles.statValueSuccess}>{calculateReduction()}% ({formatFileSize(originalSize - compressedSize)} économisés)</span>
            </div>
          </div>
        )}
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Compression réussie ! Le fichier a été téléchargé.</div>}
        <button onClick={handleCompress} disabled={!file || loading} className={styles.button}>
          {loading ? 'Compression en cours...' : 'Compresser l\'image'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Une qualité plus faible réduit davantage la taille mais peut affecter la qualité visuelle.</p></div>
      </div>
    </main>
  )
}

