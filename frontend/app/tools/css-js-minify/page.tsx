'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
type FileType = 'css' | 'js'
export default function CssJsMinifyPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [fileType, setFileType] = useState<FileType>('css')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleMinify = async () => {
    if (!input.trim()) { setError(`Veuillez entrer du ${fileType.toUpperCase()}`); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert/minify', 
        { code: input, type: fileType }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.minified)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la minification')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>CSS / JS Minify</h1>
        <p className={styles.description}>Minifiez vos fichiers CSS et JavaScript</p>
        <div className={styles.typeSelector}>
          <button className={`${styles.typeButton} ${fileType === 'css' ? styles.typeButtonActive : ''}`} onClick={() => { setFileType('css'); setInput(''); setOutput('') }}>
            CSS
          </button>
          <button className={`${styles.typeButton} ${fileType === 'js' ? styles.typeButtonActive : ''}`} onClick={() => { setFileType('js'); setInput(''); setOutput('') }}>
            JavaScript
          </button>
        </div>
        <div className={styles.inputArea}>
          <label className={styles.label}>{fileType.toUpperCase()} à minifier :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder={fileType === 'css' ? '.class { color: red; }' : 'function test() { return true; }'} />
        </div>
        <button onClick={handleMinify} disabled={!input.trim() || loading} className={styles.button}>
          {loading ? 'Minification...' : 'Minifier'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Résultat :</label>
            <textarea value={output} readOnly className={styles.textarea} />
            <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> La minification réduit la taille du fichier en supprimant les espaces et commentaires.</p></div>
      </div>
    </main>
  )
}

