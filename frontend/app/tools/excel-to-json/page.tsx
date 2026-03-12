'use client'

import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'

export default function ExcelToJsonPage() {
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validExtensions = ['.xlsx', '.xls']
      const isValid = validExtensions.some(ext => 
        selectedFile.name.toLowerCase().endsWith(ext)
      ) || selectedFile.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        selectedFile.type === 'application/vnd.ms-excel'
      
      if (isValid) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier Excel (.xlsx ou .xls)')
        setFile(null)
      }
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier Excel')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post(`${API_BASE_URL}/api/convert/excel-to-json`, formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace(/\.(xlsx|xls)$/i, '.json'))
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

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Excel vers JSON</h1>
        <p className={styles.description}>
          Convertissez vos fichiers Excel en JSON
        </p>

        <div className={styles.uploadArea}>
          <input
            id="file-input"
            type="file"
            accept=".xlsx,.xls,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner un fichier Excel (.xlsx ou .xls)'}
          </label>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Conversion réussie ! Le fichier JSON a été téléchargé.
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!file || loading}
          className={styles.convertButton}
        >
          {loading ? 'Conversion en cours...' : 'Convertir en JSON'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Note :</strong> Les fichiers Excel avec plusieurs feuilles seront convertis en un objet JSON avec une clé pour chaque feuille.
          </p>
        </div>
      </div>
    </main>
  )
}

