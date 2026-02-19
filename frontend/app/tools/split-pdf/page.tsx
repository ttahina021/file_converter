'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

type SplitMode = 'all' | 'range' | 'custom'

export default function SplitPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [splitMode, setSplitMode] = useState<SplitMode>('all')
  const [pageRange, setPageRange] = useState('')
  const [customPages, setCustomPages] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [totalPages, setTotalPages] = useState<number | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
        setTotalPages(null)
        // En production, on pourrait lire le nombre de pages ici
      } else {
        setError('Veuillez sélectionner un fichier PDF')
        setFile(null)
      }
    }
  }

  const handleSplit = async () => {
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
      formData.append('splitMode', splitMode)
      
      if (splitMode === 'range') {
        formData.append('pageRange', pageRange)
      } else if (splitMode === 'custom') {
        formData.append('customPages', customPages)
      }

      const response = await axios.post('http://localhost:5000/api/convert/split-pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `fichier-divise-${Date.now()}.zip`)
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
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la division')
    } finally {
      setLoading(false)
    }
  }

  const validatePageInput = (value: string, mode: SplitMode) => {
    if (mode === 'range') {
      // Format: "1-5" ou "1,3,5"
      const rangePattern = /^\d+-\d+$/
      const commaPattern = /^(\d+,)*\d+$/
      return rangePattern.test(value) || commaPattern.test(value)
    } else if (mode === 'custom') {
      // Format: "1,3,5,7"
      const commaPattern = /^(\d+,)*\d+$/
      return commaPattern.test(value)
    }
    return true
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Diviser PDF</h1>
        <p className={styles.description}>
          Divisez votre fichier PDF en plusieurs fichiers par pages
        </p>

        {/* Sélection du mode de division */}
        <div className={styles.modeSelector}>
          <h3 className={styles.modeTitle}>Mode de division :</h3>
          <div className={styles.modeButtons}>
            <button
              className={`${styles.modeButton} ${splitMode === 'all' ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setSplitMode('all')
                setError(null)
                setSuccess(false)
              }}
            >
              <span className={styles.modeIcon}>📄</span>
              <span>Toutes les pages</span>
              <span className={styles.modeDescription}>Une page par fichier</span>
            </button>
            <button
              className={`${styles.modeButton} ${splitMode === 'range' ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setSplitMode('range')
                setError(null)
                setSuccess(false)
              }}
            >
              <span className={styles.modeIcon}>📑</span>
              <span>Par intervalle</span>
              <span className={styles.modeDescription}>Ex: 1-5, 6-10</span>
            </button>
            <button
              className={`${styles.modeButton} ${splitMode === 'custom' ? styles.modeButtonActive : ''}`}
              onClick={() => {
                setSplitMode('custom')
                setError(null)
                setSuccess(false)
              }}
            >
              <span className={styles.modeIcon}>🎯</span>
              <span>Pages spécifiques</span>
              <span className={styles.modeDescription}>Ex: 1,3,5,7</span>
            </button>
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

        {/* Options selon le mode */}
        {splitMode === 'range' && (
          <div className={styles.optionsArea}>
            <label className={styles.optionLabel}>
              Intervalle de pages (ex: 1-5 ou 1,3,5) :
              <input
                type="text"
                value={pageRange}
                onChange={(e) => setPageRange(e.target.value)}
                placeholder="1-5"
                className={styles.optionInput}
              />
            </label>
          </div>
        )}

        {splitMode === 'custom' && (
          <div className={styles.optionsArea}>
            <label className={styles.optionLabel}>
              Numéros de pages (ex: 1,3,5,7) :
              <input
                type="text"
                value={customPages}
                onChange={(e) => setCustomPages(e.target.value)}
                placeholder="1,3,5,7"
                className={styles.optionInput}
              />
            </label>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Division réussie ! Les fichiers ont été téléchargés dans un fichier ZIP.
          </div>
        )}

        <button
          onClick={handleSplit}
          disabled={!file || loading || (splitMode === 'range' && !pageRange) || (splitMode === 'custom' && !customPages)}
          className={styles.splitButton}
        >
          {loading ? 'Division en cours...' : 'Diviser le PDF'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> 
            {splitMode === 'all' && ' Toutes les pages seront extraites en fichiers séparés.'}
            {splitMode === 'range' && ' Utilisez le format "1-5" pour un intervalle ou "1,3,5" pour des pages spécifiques.'}
            {splitMode === 'custom' && ' Séparez les numéros de pages par des virgules (ex: 1,3,5,7).'}
          </p>
        </div>
      </div>
    </main>
  )
}

