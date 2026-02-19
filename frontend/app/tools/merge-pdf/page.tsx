'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function MergePdfPage() {
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files)
      const pdfFiles = selectedFiles.filter(file => 
        file.type === 'application/pdf' || file.name.endsWith('.pdf')
      )
      
      if (pdfFiles.length !== selectedFiles.length) {
        setError('Veuillez sélectionner uniquement des fichiers PDF')
        return
      }

      setFiles(prev => [...prev, ...pdfFiles])
      setError(null)
      setSuccess(false)
    }
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
    setError(null)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Veuillez sélectionner au moins 2 fichiers PDF')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      files.forEach((file, index) => {
        formData.append(`files`, file)
      })

      const response = await axios.post('http://localhost:5000/api/convert/merge-pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'fichier-fusionne.pdf')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setFiles([])
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la fusion')
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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Fusionner PDF</h1>
        <p className={styles.description}>
          Sélectionnez plusieurs fichiers PDF à fusionner en un seul document
        </p>

        {/* Zone de téléchargement */}
        <div className={styles.uploadArea}>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            <span className={styles.uploadIcon}>📎</span>
            <span>Ajouter des fichiers PDF</span>
          </label>
        </div>

        {/* Liste des fichiers */}
        {files.length > 0 && (
          <div className={styles.filesList}>
            <h3 className={styles.filesListTitle}>Fichiers sélectionnés ({files.length})</h3>
            <div className={styles.filesContainer}>
              {files.map((file, index) => (
                <div key={index} className={styles.fileItem}>
                  <span className={styles.fileIcon}>📄</span>
                  <div className={styles.fileInfo}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className={styles.removeButton}
                    aria-label="Supprimer le fichier"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Fusion réussie ! Le fichier a été téléchargé.
          </div>
        )}

        <button
          onClick={handleMerge}
          disabled={files.length < 2 || loading}
          className={styles.mergeButton}
        >
          {loading ? 'Fusion en cours...' : `Fusionner ${files.length} fichier${files.length > 1 ? 's' : ''}`}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> L&apos;ordre des fichiers dans la liste correspond à l&apos;ordre dans le PDF fusionné. 
            Vous pouvez réorganiser en supprimant et réajoutant les fichiers.
          </p>
        </div>
      </div>
    </main>
  )
}

