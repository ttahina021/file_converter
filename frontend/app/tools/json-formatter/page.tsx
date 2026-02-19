'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function JsonFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [indent, setIndent] = useState(2)
  
  const handleFormat = async () => {
    if (!input.trim()) { setError('Veuillez entrer du JSON'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/convert/format-json', 
        { json: input, indent }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.formatted)
    } catch (err: any) {
      setError(err.response?.data?.message || 'JSON invalide')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  const handleMinify = async () => {
    if (!input.trim()) { setError('Veuillez entrer du JSON'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/convert/minify-json', 
        { json: input }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.minified)
    } catch (err: any) {
      setError(err.response?.data?.message || 'JSON invalide')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>JSON Formatter</h1>
        <p className={styles.description}>Formatez et validez vos fichiers JSON</p>
        <div className={styles.inputArea}>
          <label className={styles.label}>JSON à formater :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder='{"key":"value"}' />
        </div>
        <div className={styles.optionsArea}>
          <label className={styles.optionLabel}>Indentation :</label>
          <select value={indent} onChange={(e) => setIndent(Number(e.target.value))} className={styles.selectInput}>
            <option value={2}>2 espaces</option>
            <option value={4}>4 espaces</option>
            <option value={0}>Tabulation</option>
          </select>
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleFormat} disabled={!input.trim() || loading} className={styles.button}>
            {loading ? 'Formatage...' : 'Formatter'}
          </button>
          <button onClick={handleMinify} disabled={!input.trim() || loading} className={styles.button}>
            Minifier
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Résultat :</label>
            <textarea value={output} readOnly className={styles.textarea} />
            <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Vous pouvez coller du JSON brut et le formater automatiquement.</p></div>
      </div>
    </main>
  )
}

