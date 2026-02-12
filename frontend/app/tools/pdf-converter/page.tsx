'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

type OutputFormat = 'word' | 'excel' | 'powerpoint'

export default function PdfConverterPage() {
  const [file, setFile] = useState<File | null>(null)
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('word')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier PDF')
        setFile(null)
      }
    }
  }

  const handleConvert = async () => {
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
      formData.append('outputFormat', outputFormat)

      const response = await axios.post('http://localhost:5000/api/convert/pdf-to-office', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Déterminer l'extension du fichier selon le format
      const extensions: Record<OutputFormat, string> = {
        word: '.docx',
        excel: '.xlsx',
        powerpoint: '.pptx'
      }
      const extension = extensions[outputFormat]

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace('.pdf', extension))
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
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  const formatLabels: Record<OutputFormat, { label: string; icon: string }> = {
    word: { label: 'Word (.docx)', icon: '📝' },
    excel: { label: 'Excel (.xlsx)', icon: '📊' },
    powerpoint: { label: 'PowerPoint (.pptx)', icon: '📽️' }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Convertisseur PDF vers Office</h1>
        <p className={styles.description}>
          Convertissez vos fichiers PDF en Word, Excel ou PowerPoint
        </p>

        {/* Sélection du format de sortie */}
        <div className={styles.formatSelector}>
          <h3 className={styles.formatTitle}>Format de sortie :</h3>
          <div className={styles.formatButtons}>
            {(Object.keys(formatLabels) as OutputFormat[]).map((format) => (
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
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner un fichier PDF'}
          </label>
        </div>

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
            ⚠️ <strong>Note :</strong> La conversion PDF extrait le texte et les données du document. 
            La mise en forme complexe peut ne pas être parfaitement préservée.
          </p>
        </div>
      </div>
    </main>
  )
}

