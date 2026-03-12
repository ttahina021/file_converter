'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
export default function XmlFormatterPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleFormat = async () => {
    if (!input.trim()) { setError('Veuillez entrer du XML'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert/format-xml', 
        { xml: input }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.formatted)
    } catch (err: any) {
      setError(err.response?.data?.message || 'XML invalide')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>XML Formatter</h1>
        <p className={styles.description}>Formatez et validez vos fichiers XML</p>
        <div className={styles.inputArea}>
          <label className={styles.label}>XML à formater :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder='<root><item>value</item></root>' />
        </div>
        <button onClick={handleFormat} disabled={!input.trim() || loading} className={styles.button}>
          {loading ? 'Formatage...' : 'Formatter'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Résultat :</label>
            <textarea value={output} readOnly className={styles.textarea} />
            <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Le XML sera formaté avec une indentation appropriée.</p></div>
      </div>
    </main>
  )
}

