'use client'
import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'
export default function ApiKeyGeneratorPage() {
  const [length, setLength] = useState(32)
  const [prefix, setPrefix] = useState('')
  const [apiKeys, setApiKeys] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleGenerate = async () => {
    if (length < 8 || length > 128) { setError('La longueur doit être entre 8 et 128 caractères'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post('http://localhost:5000/api/convert/generate-api-key', 
        { length, prefix }, 
        { headers: { 'Content-Type': 'application/json' } })
      setApiKeys([response.data.apiKey])
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la génération')
      setApiKeys([])
    } finally { setLoading(false) }
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur API Key</h1>
        <p className={styles.description}>Générez des clés API sécurisées</p>
        <div className={styles.optionsArea}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Longueur :</label>
            <input type="number" min="8" max="128" value={length} onChange={(e) => setLength(Number(e.target.value))} className={styles.numberInput} />
          </div>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Préfixe (optionnel) :</label>
            <input type="text" value={prefix} onChange={(e) => setPrefix(e.target.value)} className={styles.textInput} placeholder='sk_live_' />
          </div>
        </div>
        <button onClick={handleGenerate} disabled={loading} className={styles.button}>
          {loading ? 'Génération...' : 'Générer la clé API'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {apiKeys.length > 0 && (
          <div className={styles.outputArea}>
            <label className={styles.label}>Clé API générée :</label>
            <div className={styles.apiKeyOutput}>
              <code className={styles.apiKeyCode}>{apiKeys[0]}</code>
              <button onClick={() => navigator.clipboard.writeText(apiKeys[0])} className={styles.copyButton}>📋 Copier</button>
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> Les clés API sont générées de manière sécurisée avec des caractères aléatoires.</p></div>
      </div>
    </main>
  )
}

