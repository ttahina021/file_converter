'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
type Direction = 'yaml-to-json' | 'json-to-yaml'
export default function YamlJsonPage() {
  const [file, setFile] = useState<File | null>(null)
  const [direction, setDirection] = useState<Direction>('yaml-to-json')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      const isYaml = f.name.endsWith('.yaml') || f.name.endsWith('.yml') || f.type === 'application/x-yaml' || f.type === 'text/yaml'
      const isJson = f.name.endsWith('.json') || f.type === 'application/json'
      if (direction === 'yaml-to-json' && isYaml || direction === 'json-to-yaml' && isJson) {
        setFile(f); setError(null); setSuccess(false)
      } else {
        setError(direction === 'yaml-to-json' ? 'Veuillez sélectionner un fichier YAML' : 'Veuillez sélectionner un fichier JSON')
        setFile(null)
      }
    }
  }
  const handleConvert = async () => {
    if (!file) { setError(`Veuillez sélectionner un fichier ${direction === 'yaml-to-json' ? 'YAML' : 'JSON'}`); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file); formData.append('direction', direction)
      const endpoint = direction === 'yaml-to-json' ? 'yaml-to-json' : 'json-to-yaml'
      const response = await axios.post(`http://localhost:5000/api/convert/${endpoint}`, formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace(direction === 'yaml-to-json' ? /\.(yaml|yml)$/i : '.json', direction === 'yaml-to-json' ? '.json' : '.yaml'))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>YAML ↔ JSON</h1>
        <p className={styles.description}>Convertissez entre YAML et JSON dans les deux sens</p>
        <div className={styles.directionSelector}>
          <button className={`${styles.directionButton} ${direction === 'yaml-to-json' ? styles.directionButtonActive : ''}`} onClick={() => { setDirection('yaml-to-json'); setFile(null); setError(null) }}>
            YAML → JSON
          </button>
          <button className={`${styles.directionButton} ${direction === 'json-to-yaml' ? styles.directionButtonActive : ''}`} onClick={() => { setDirection('json-to-yaml'); setFile(null); setError(null) }}>
            JSON → YAML
          </button>
        </div>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept={direction === 'yaml-to-json' ? '.yaml,.yml,application/x-yaml,text/yaml' : '.json,application/json'} onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : `Sélectionner un fichier ${direction === 'yaml-to-json' ? 'YAML' : 'JSON'}`}
          </label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Conversion réussie ! Le fichier a été téléchargé.</div>}
        <button onClick={handleConvert} disabled={!file || loading} className={styles.convertButton}>
          {loading ? 'Conversion en cours...' : `Convertir ${direction === 'yaml-to-json' ? 'YAML en JSON' : 'JSON en YAML'}`}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> La conversion préserve la structure des données.</p></div>
      </div>
    </main>
  )
}

