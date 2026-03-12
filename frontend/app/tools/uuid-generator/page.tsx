'use client'
import { useState } from 'react'
import axios from 'axios'
import { API_BASE_URL } from '@/lib/api'
import styles from './page.module.css'
export default function UuidGeneratorPage() {
  const [uuids, setUuids] = useState<string[]>([])
  const [count, setCount] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const handleGenerate = async () => {
    if (count < 1 || count > 100) { setError('Le nombre doit être entre 1 et 100'); return }
    setLoading(true); setError(null)
    try {
      const response = await axios.post(\${API_BASE_URL}/api/convert/generate-uuid', 
        { count }, 
        { headers: { 'Content-Type': 'application/json' } })
      setUuids(response.data.uuids)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la génération')
      setUuids([])
    } finally { setLoading(false) }
  }
  
  const copyAll = () => {
    navigator.clipboard.writeText(uuids.join('\n'))
  }
  
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur UUID</h1>
        <p className={styles.description}>Générez des identifiants UUID uniques</p>
        <div className={styles.optionsArea}>
          <label className={styles.optionLabel}>Nombre d&apos;UUID à générer :</label>
          <input type="number" min="1" max="100" value={count} onChange={(e) => setCount(Number(e.target.value))} className={styles.numberInput} />
        </div>
        <button onClick={handleGenerate} disabled={loading} className={styles.button}>
          {loading ? 'Génération...' : 'Générer'}
        </button>
        {error && <div className={styles.error}>{error}</div>}
        {uuids.length > 0 && (
          <div className={styles.outputArea}>
            <div className={styles.outputHeader}>
              <label className={styles.label}>UUID générés :</label>
              <button onClick={copyAll} className={styles.copyButton}>📋 Copier tout</button>
            </div>
            <div className={styles.uuidList}>
              {uuids.map((uuid, index) => (
                <div key={index} className={styles.uuidItem}>
                  <code className={styles.uuidCode}>{uuid}</code>
                  <button onClick={() => navigator.clipboard.writeText(uuid)} className={styles.copyItemButton}>📋</button>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className={styles.infoBox}><p className={styles.infoText}>💡 <strong>Note :</strong> UUID v4 générés de manière aléatoire et sécurisée.</p></div>
      </div>
    </main>
  )
}

