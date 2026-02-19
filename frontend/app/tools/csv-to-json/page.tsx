'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function CsvToJsonPage() {
  const [file, setFile] = useState<File | null>(null)
  const [delimiter, setDelimiter] = useState(',')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.name.endsWith('.csv') || selectedFile.type === 'text/csv') {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier CSV')
        setFile(null)
      }
    }
  }

  const handleConvert = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier CSV')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('delimiter', delimiter)

      const response = await axios.post('http://localhost:5000/api/convert/csv-to-json', formData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace('.csv', '.json'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setFile(null)
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>CSV vers JSON</h1>
        <p className={styles.description}>Convertissez vos fichiers CSV en JSON</p>

        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept=".csv,text/csv" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner un fichier CSV'}
          </label>
        </div>

        <div className={styles.optionsArea}>
          <label className={styles.optionLabel}>Délimiteur :</label>
          <select value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className={styles.selectInput}>
            <option value=",">Virgule (,)</option>
            <option value=";">Point-virgule (;)</option>
            <option value="\t">Tabulation</option>
            <option value="|">Pipe (|)</option>
          </select>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier JSON a été téléchargé.</div>}

        <button onClick={handleConvert} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Conversion en cours...' : 'Convertir en JSON'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>💡 <strong>Note :</strong> La première ligne sera utilisée comme en-têtes pour les clés JSON.</p>
        </div>
      </div>
    </main>
  )
}

