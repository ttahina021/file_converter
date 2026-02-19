'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
type Operation = 'encode' | 'decode'
export default function Base64Page() {
  const [input, setInput] = useState('')
  const [output, setOutput] = useState('')
  const [operation, setOperation] = useState<Operation>('encode')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleProcess = async () => {
    if (!input.trim()) { setError(`Veuillez entrer du texte à ${operation === 'encode' ? 'encoder' : 'décoder'}`); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/convert/base64', 
        { text: input, operation }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.result)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors du traitement')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Base64 Encode / Decode</h1>
        <p className={styles.description}>Encodez et décodez en Base64</p>
        <div className={styles.operationSelector}>
          <button className={`${styles.operationButton} ${operation === 'encode' ? styles.operationButtonActive : ''}`} onClick={() => { setOperation('encode'); setInput(''); setOutput('') }}>
            Encoder
          </button>
          <button className={`${styles.operationButton} ${operation === 'decode' ? styles.operationButtonActive : ''}`} onClick={() => { setOperation('decode'); setInput(''); setOutput('') }}>
            Décoder
          </button>
        </div>
        <div className={styles.inputArea}>
          <label className={styles.label}>Texte à {operation === 'encode' ? 'encoder' : 'décoder'} :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder={operation === 'encode' ? 'Entrez le texte à encoder' : 'Entrez le Base64 à décoder'} />
        </div>
        <button onClick={handleProcess} disabled={!input.trim() || loading} className={styles.button}>
          {loading ? 'Traitement...' : operation === 'encode' ? 'Encoder' : 'Décoder'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Résultat :</label>
            <textarea value={output} readOnly className={styles.textarea} />
            <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Base64 est utilisé pour encoder des données binaires en texte ASCII.</p></div>
      </div>
    </main>
  )
}

