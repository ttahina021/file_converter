'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
export default function HtmlBeautifierPage() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleBeautify = async () => {
    if (!input.trim()) { setError('Veuillez entrer du HTML'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert/beautify-html', 
        { html: input }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.beautified)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du formatage')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>HTML Beautifier</h1>
        <p className={styles.description}>Formatez et beautifiez votre code HTML</p>
        <div className={styles.inputArea}>
          <label className={styles.label}>HTML à formater :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder='<div><p>Hello</p></div>' />
        </div>
        <button onClick={handleBeautify} disabled={!input.trim() || loading} className={styles.button}>
          {loading ? 'Formatage...' : 'Beautifier'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Résultat :</label>
            <textarea value={output} readOnly className={styles.textarea} />
            <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Astuce :</strong> Le HTML sera formaté avec une indentation appropriée.</p></div>
      </div>
    </main>
  )
}

