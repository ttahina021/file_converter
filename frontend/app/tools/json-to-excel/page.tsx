'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import ExcelGrid from '../../components/ExcelGrid'
import styles from './page.module.css'

type InputMode = 'file' | 'editor'

export default function JsonToExcelPage() {
  const [inputMode, setInputMode] = useState<InputMode>('file')
  const [file, setFile] = useState<File | null>(null)
  const [jsonText, setJsonText] = useState<string>('')
  const [jsonData, setJsonData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showGrid, setShowGrid] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/json' || selectedFile.name.endsWith('.json')) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
        
        // Lire le fichier et afficher la grille
        try {
          const text = await selectedFile.text()
          setJsonText(text)
          const parsed = JSON.parse(text)
          setJsonData(parsed)
          setShowGrid(true)
        } catch (err) {
          setError('Impossible de lire le fichier JSON')
          setShowGrid(false)
        }
      } else {
        setError('Veuillez sélectionner un fichier JSON')
        setFile(null)
        setShowGrid(false)
      }
    }
  }

  const validateJson = (text: string): boolean => {
    try {
      JSON.parse(text)
      return true
    } catch {
      return false
    }
  }

  useEffect(() => {
    if (jsonText && validateJson(jsonText)) {
      try {
        const parsed = JSON.parse(jsonText)
        setJsonData(parsed)
        setShowGrid(true)
        setError(null)
      } catch {
        setShowGrid(false)
      }
    } else if (jsonText) {
      setShowGrid(false)
    }
  }, [jsonText])

  const handleConvert = async () => {
    setLoading(true)
    setError(null)
    setSuccess(false)

      try {
        let formData = new FormData()
        let fileName = 'converted.xlsx'
        let jsonToConvert = jsonText

        // Utiliser les données de la grille si elles ont été modifiées
        if (jsonData) {
          jsonToConvert = JSON.stringify(jsonData)
        }

        if (inputMode === 'file') {
          if (!file && !jsonToConvert) {
            setError('Veuillez sélectionner un fichier JSON')
            setLoading(false)
            return
          }

          if (jsonToConvert) {
            // Utiliser le JSON actuel (peut-être modifié dans la grille)
            const jsonBlob = new Blob([jsonToConvert], { type: 'application/json' })
            const jsonFile = new File([jsonBlob], file?.name || 'input.json', { type: 'application/json' })
            formData.append('file', jsonFile)
            fileName = (file?.name || 'converted').replace('.json', '.xlsx')
          } else if (file) {
            formData.append('file', file)
            fileName = file.name.replace('.json', '.xlsx')
          }
        } else {
          // Mode éditeur
          if (!jsonToConvert.trim()) {
            setError('Veuillez saisir du JSON dans l\'éditeur')
            setLoading(false)
            return
          }

          if (!validateJson(jsonToConvert)) {
            setError('Le JSON saisi est invalide. Veuillez vérifier la syntaxe.')
            setLoading(false)
            return
          }

          // Créer un fichier blob à partir du texte JSON
          const jsonBlob = new Blob([jsonToConvert], { type: 'application/json' })
          const jsonFile = new File([jsonBlob], 'input.json', { type: 'application/json' })
          formData.append('file', jsonFile)
          fileName = 'converted.xlsx'
        }

      const response = await axios.post('http://localhost:5000/api/convert/json-to-excel', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

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
      if (inputMode === 'file') {
        setFile(null)
        const fileInput = document.getElementById('file-input') as HTMLInputElement
        if (fileInput) {
          fileInput.value = ''
        }
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la conversion')
    } finally {
      setLoading(false)
    }
  }

  const canConvert = inputMode === 'file' ? file !== null : jsonText.trim() !== '' && validateJson(jsonText)

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Convertisseur JSON vers Excel</h1>
        <p className={styles.description}>
          Téléchargez votre fichier JSON ou saisissez-le directement dans l'éditeur
        </p>

        {/* Sélecteur de mode */}
        <div className={styles.modeSelector}>
          <button
            className={`${styles.modeButton} ${inputMode === 'file' ? styles.modeButtonActive : ''}`}
            onClick={() => {
              setInputMode('file')
              setError(null)
              setSuccess(false)
            }}
          >
            📁 Fichier
          </button>
          <button
            className={`${styles.modeButton} ${inputMode === 'editor' ? styles.modeButtonActive : ''}`}
            onClick={() => {
              setInputMode('editor')
              setError(null)
              setSuccess(false)
            }}
          >
            ✏️ Éditeur
          </button>
        </div>

        {/* Zone de saisie selon le mode */}
        {inputMode === 'file' ? (
          <div className={styles.uploadArea}>
            <input
              id="file-input"
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className={styles.fileInput}
            />
            <label htmlFor="file-input" className={styles.fileLabel}>
              {file ? file.name : 'Sélectionner un fichier JSON'}
            </label>
          </div>
        ) : (
          <div className={styles.editorArea}>
            <textarea
              className={styles.jsonEditor}
              value={jsonText}
              onChange={(e) => {
                setJsonText(e.target.value)
                setError(null)
                setSuccess(false)
              }}
              placeholder='Saisissez votre JSON ici...&#10;Exemple:&#10;{&#10;  "nom": "John",&#10;  "age": 30,&#10;  "ville": "Paris"&#10;}'
              spellCheck={false}
            />
            {jsonText && !validateJson(jsonText) && (
              <div className={styles.jsonError}>⚠️ JSON invalide - Vérifiez la syntaxe</div>
            )}
          </div>
        )}

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier Excel a été téléchargé.</div>}

        {/* Visualisation Excel */}
        {showGrid && jsonData && (
          <div className={styles.gridSection}>
            <h3 className={styles.gridTitle}>Aperçu Excel</h3>
            <p className={styles.gridDescription}>
              Visualisez et modifiez vos données avant la conversion
            </p>
            <ExcelGrid 
              data={jsonData} 
              onDataChange={(updatedData) => {
                setJsonData(updatedData)
                setJsonText(JSON.stringify(updatedData, null, 2))
              }}
            />
          </div>
        )}

        <button
          onClick={handleConvert}
          disabled={!canConvert || loading}
          className={styles.convertButton}
        >
          {loading ? 'Conversion en cours...' : 'Convertir en Excel'}
        </button>
      </div>
    </main>
  )
}

