'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
type HashType = 'md5' | 'sha256' | 'sha1' | 'sha512'
export default function HashGeneratorPage() {
  const [input, setInput] = useState('')
  const [hashType, setHashType] = useState<HashType>('md5')
  const [output, setOutput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleGenerate = async () => {
    if (!input.trim()) { setError('Veuillez entrer du texte'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post(`${API_BASE_URL}/api/convert/generate-hash`, 
        { text: input, type: hashType }, 
        { headers: { 'Content-Type': 'application/json' } })
      setOutput(response.data.hash)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la génération')
      setOutput('')
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Hash Generator</h1>
        <p className={styles.description}>Générez des hash MD5, SHA256 et plus</p>
        <div className={styles.typeSelector}>
          <button className={`${styles.typeButton} ${hashType === 'md5' ? styles.typeButtonActive : ''}`} onClick={() => setHashType('md5')}>MD5</button>
          <button className={`${styles.typeButton} ${hashType === 'sha256' ? styles.typeButtonActive : ''}`} onClick={() => setHashType('sha256')}>SHA256</button>
          <button className={`${styles.typeButton} ${hashType === 'sha1' ? styles.typeButtonActive : ''}`} onClick={() => setHashType('sha1')}>SHA1</button>
          <button className={`${styles.typeButton} ${hashType === 'sha512' ? styles.typeButtonActive : ''}`} onClick={() => setHashType('sha512')}>SHA512</button>
        </div>
        <div className={styles.inputArea}>
          <label className={styles.label}>Texte à hasher :</label>
          <textarea value={input} onChange={(e) => setInput(e.target.value)} className={styles.textarea} placeholder='Entrez le texte à hasher' />
        </div>
        <button onClick={handleGenerate} disabled={!input.trim() || loading} className={styles.button}>
          {loading ? 'Génération...' : 'Générer le hash'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {output && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Hash {hashType.toUpperCase()} :</label>
            <div className={styles.hashOutput}>
              <code className={styles.hashCode}>{output}</code>
              <button onClick={() => navigator.clipboard.writeText(output)} className={styles.copyButton}>📋 Copier</button>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les hash sont générés de manière sécurisée et irréversible.</p></div>
      </div>
    </main>
  )
}

