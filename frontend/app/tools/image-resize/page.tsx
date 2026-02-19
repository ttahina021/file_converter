'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
type ResizeMode = 'custom' | 'preset'
export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null)
  const [resizeMode, setResizeMode] = useState<ResizeMode>('custom')
  const [width, setWidth] = useState<number>(800)
  const [height, setHeight] = useState<number>(600)
  const [preset, setPreset] = useState('1920x1080')
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const f = e.target.files[0]
      if (f.type.startsWith('image/')) {
        setFile(f); setError(null); setSuccess(false)
      } else { setError('Veuillez sélectionner une image'); setFile(null) }
    }
  }
  
  const handleResize = async () => {
    if (!file) { setError('Veuillez sélectionner une image'); return }
    if (resizeMode === 'custom' && (width < 1 || height < 1)) { setError('Les dimensions doivent être supérieures à 0'); return }
    setLoading(true); setError(null); setSuccess(false)
    try {
      const formData = new FormData(); formData.append('file', file)
      if (resizeMode === 'custom') {
        formData.append('width', width.toString()); formData.append('height', height.toString())
      } else {
        const [w, h] = preset.split('x').map(Number)
        formData.append('width', w.toString()); formData.append('height', h.toString())
      }
      formData.append('maintainAspectRatio', maintainAspectRatio.toString())
      const response = await axios.post('http://localhost:5000/api/convert/resize-image', formData, { responseType: 'blob', headers: { 'Content-Type': 'multipart/form-data' } })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a'); link.href = url; link.setAttribute('download', file.name.replace(/\.[^.]+$/, '-redimensionnee' + file.name.match(/\.[^.]+$/)?.[0]))
      document.body.appendChild(link); link.click(); link.remove(); window.URL.revokeObjectURL(url)
      setSuccess(true); setFile(null); (document.getElementById('file-input') as HTMLInputElement)?.setAttribute('value', '')
    } catch (err: any) { setError(err.response?.data?.message || 'Une erreur est survenue') } finally { setLoading(false) }
  }
  
  const presets = [
    { value: '1920x1080', label: 'Full HD (1920x1080)' },
    { value: '1280x720', label: 'HD (1280x720)' },
    { value: '800x600', label: 'SVGA (800x600)' },
    { value: '640x480', label: 'VGA (640x480)' },
    { value: '256x256', label: 'Carré (256x256)' },
    { value: '512x512', label: 'Carré (512x512)' }
  ]
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Redimensionnement</h1>
        <p className={styles.description}>Redimensionnez vos images à la taille souhaitée</p>
        <div className={styles.modeSelector}>
          <button className={`${styles.modeButton} ${resizeMode === 'custom' ? styles.modeButtonActive : ''}`} onClick={() => setResizeMode('custom')}>
            Dimensions personnalisées
          </button>
          <button className={`${styles.modeButton} ${resizeMode === 'preset' ? styles.modeButtonActive : ''}`} onClick={() => setResizeMode('preset')}>
            Presets
          </button>
        </div>
        {resizeMode === 'custom' ? (
          <div className={styles.dimensionsArea}>
            <div className={styles.dimensionGroup}>
              <label className={styles.dimensionLabel}>Largeur :</label>
              <input type="number" min="1" value={width} onChange={(e) => setWidth(Number(e.target.value))} className={styles.dimensionInput} />
            </div>
            <div className={styles.dimensionGroup}>
              <label className={styles.dimensionLabel}>Hauteur :</label>
              <input type="number" min="1" value={height} onChange={(e) => setHeight(Number(e.target.value))} className={styles.dimensionInput} />
            </div>
          </div>
        ) : (
          <div className={styles.presetArea}>
            <label className={styles.presetLabel}>Preset :</label>
            <select value={preset} onChange={(e) => setPreset(e.target.value)} className={styles.presetSelect}>
              {presets.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
            </select>
          </div>
        )}
        <div className={styles.optionsArea}>
          <label className={styles.checkboxLabel}>
            <input type="checkbox" checked={maintainAspectRatio} onChange={(e) => setMaintainAspectRatio(e.target.checked)} />
            Conserver les proportions
          </label>
        </div>
        <div className={styles.uploadArea}>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? file.name : 'Sélectionner une image'}
          </label>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Redimensionnement réussi ! Le fichier a été téléchargé.</div>}
        <button onClick={handleResize} disabled={!file || loading} className={styles.button}>
          {loading ? 'Redimensionnement en cours...' : 'Redimensionner l&apos;image'}
        </button>
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Activez &quot;Conserver les proportions&quot; pour éviter la déformation de l&apos;image.</p></div>
      </div>
    </main>
  )
}

