'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

type ImageFormat = 'png' | 'jpg' | 'webp' | 'svg'

const formatLabels: Record<ImageFormat, { label: string; icon: string; mime: string }> = {
  png: { label: 'PNG', icon: '🖼️', mime: 'image/png' },
  jpg: { label: 'JPG', icon: '📷', mime: 'image/jpeg' },
  webp: { label: 'WebP', icon: '🌐', mime: 'image/webp' },
  svg: { label: 'SVG', icon: '📐', mime: 'image/svg+xml' }
}

export default function ImageConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('png')
  const [preview, setPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml']
      
      if (validTypes.includes(selectedFile.type) || 
          /\.(png|jpg|jpeg|webp|svg)$/i.test(selectedFile.name)) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)

        // Créer une prévisualisation
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setError('Veuillez sélectionner un fichier image (PNG, JPG, WebP ou SVG)')
        setFile(null)
        setPreview(null)
      }
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier image')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('outputFormat', outputFormat)

      const response = await axios.post('http://localhost:5000/api/convert/image', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Déterminer l'extension du fichier selon le format
      const extension = outputFormat === 'jpg' ? '.jpg' : `.${outputFormat}`
      const fileName = file.name.replace(/\.[^/.]+$/, '') + extension

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Convertisseur d'images</h1>
        <p className={styles.description}>
          Convertissez vos images entre PNG, JPG, WebP et SVG
        </p>

        {/* Sélection du format de sortie */}
        <div className={styles.formatSelector}>
          <h3 className={styles.formatTitle}>Format de sortie :</h3>
          <div className={styles.formatButtons}>
            {(Object.keys(formatLabels) as ImageFormat[]).map((format) => (
              <button
                key={format}
                className={`${styles.formatButton} ${outputFormat === format ? styles.formatButtonActive : ''}`}
                onClick={() => {
                  setOutputFormat(format)
                  setError(null)
                  setSuccess(false)
                }}
              >
                <span className={styles.formatIcon}>{formatLabels[format].icon}</span>
                <span className={styles.formatLabel}>{formatLabels[format].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Zone de téléchargement */}
        <div className={styles.uploadArea}>
          <input
            id="file-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp,image/svg+xml"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner un fichier image'}
          </label>
        </div>

        {/* Prévisualisation */}
        {preview && (
          <div className={styles.previewArea}>
            <h3 className={styles.previewTitle}>Aperçu :</h3>
            <div className={styles.previewContainer}>
              <img src={preview} alt="Preview" className={styles.previewImage} />
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Conversion réussie ! Le fichier {formatLabels[outputFormat].label} a été téléchargé.
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className={styles.convertButton}
        >
          {loading ? 'Conversion en cours...' : `Convertir en ${formatLabels[outputFormat].label}`}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            ⚠️ <strong>Note :</strong> La conversion SVG vers les formats raster (PNG, JPG, WebP) 
            peut prendre plus de temps. La conversion vers SVG n'est pas supportée depuis les formats raster.
          </p>
        </div>
      </div>
    </main>
  )
}

