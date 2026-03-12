'use client'

import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'

type CompressionLevel = 'low' | 'medium' | 'high'

export default function CompressPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [compressionLevel, setCompressionLevel] = useState<CompressionLevel>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [originalSize, setOriginalSize] = useState<number | null>(null)
  const [compressedSize, setCompressedSize] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        setOriginalSize(selectedFile.size)
        setCompressedSize(null)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier PDF')
        setFile(null)
      }
    }
  }

  const handleCompress = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('compressionLevel', compressionLevel)

      const response = await axios.post(`${API_BASE_URL}/api/convert/compress-pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Récupérer la taille du fichier compressé depuis les headers
      const contentLength = response.headers['content-length']
      if (contentLength) {
        setCompressedSize(parseInt(contentLength))
      }

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace('.pdf', '-compresse.pdf'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setFile(null)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la compression')
    } finally {
      setLoading(false)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
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

  const compressionLabels: Record<CompressionLevel, { label: string; description: string; icon: string }> = {
    low: { label: 'Faible', description: 'Qualité maximale, compression minimale', icon: '📄' },
    medium: { label: 'Moyenne', description: 'Équilibre qualité/taille', icon: '📊' },
    high: { label: 'Élevée', description: 'Taille minimale, qualité réduite', icon: '🗜️' }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Compresser PDF</h1>
        <p className={styles.description}>
          Réduisez la taille de vos fichiers PDF sans compromettre la qualité
        </p>

        {/* Sélection du niveau de compression */}
        <div className={styles.compressionSelector}>
          <h3 className={styles.compressionTitle}>Niveau de compression :</h3>
          <div className={styles.compressionButtons}>
            {(Object.keys(compressionLabels) as CompressionLevel[]).map((level) => (
              <button
                key={level}
                className={`${styles.compressionButton} ${compressionLevel === level ? styles.compressionButtonActive : ''}`}
                onClick={() => {
                  setCompressionLevel(level)
                  setError(null)
                  setSuccess(false)
                }}
              >
                <span className={styles.compressionIcon}>{compressionLabels[level].icon}</span>
                <span className={styles.compressionLabel}>{compressionLabels[level].label}</span>
                <span className={styles.compressionDescription}>{compressionLabels[level].description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zone de téléchargement */}
        <div className={styles.uploadArea}>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📄</span>
                <div className={styles.fileDetails}>
                  <span className={styles.fileName}>{file.name}</span>
                  {originalSize && (
                    <span className={styles.fileSize}>Taille originale : {formatFileSize(originalSize)}</span>
                  )}
                </div>
              </div>
            ) : (
              'Sélectionner un fichier PDF'
            )}
          </label>
        </div>

        {/* Statistiques de compression */}
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
              <span className={styles.statValueSuccess}>
                {calculateReduction()}% ({formatFileSize(originalSize - compressedSize)} économisés)
              </span>
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Compression réussie ! Le fichier a été téléchargé.
          </div>
        )}

        <button
          onClick={handleCompress}
          disabled={!file || loading}
          className={styles.compressButton}
        >
          {loading ? 'Compression en cours...' : 'Compresser le PDF'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> Le niveau de compression affecte la qualité du PDF. 
            Utilisez &quot;Faible&quot; pour préserver la qualité maximale, &quot;Élevée&quot; pour réduire au maximum la taille.
          </p>
        </div>
      </div>
    </main>
  )
}

