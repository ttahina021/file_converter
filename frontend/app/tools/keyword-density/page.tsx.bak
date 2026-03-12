'use client'
import { useState } from 'react'
import styles from './page.module.css'

interface KeywordData {
  word: string
  count: number
  density: number
}

export default function KeywordDensityPage() {
  const [text, setText] = useState('')
  const [minLength, setMinLength] = useState(3)
  const [results, setResults] = useState<KeywordData[]>([])

  const analyze = () => {
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length >= minLength)
    
    const wordCount: { [key: string]: number } = {}
    const totalWords = words.length
    
    words.forEach(word => {
      wordCount[word] = (wordCount[word] || 0) + 1
    })
    
    const keywordData: KeywordData[] = Object.entries(wordCount)
      .map(([word, count]) => ({
        word,
        count,
        density: (count / totalWords) * 100
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 50)
    
    setResults(keywordData)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Analyse densité mots-clés</h1>
        <p className={styles.description}>Analysez la densité des mots-clés dans votre texte</p>
        
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Texte à analyser</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className={styles.textarea}
              placeholder="Collez votre texte ici..."
              rows={10}
            />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Longueur minimale des mots</label>
            <input
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(parseInt(e.target.value) || 3)}
              className={styles.input}
              min="1"
              max="10"
            />
          </div>
          
          <button onClick={analyze} className={styles.analyzeButton} disabled={!text.trim()}>
            Analyser
          </button>
        </div>

        {results.length > 0 && (
          <div className={styles.resultsSection}>
            <h3 className={styles.resultsTitle}>Résultats (top 50)</h3>
            <div className={styles.resultsTable}>
              <div className={styles.tableHeader}>
                <span>Mot</span>
                <span>Occurrences</span>
                <span>Densité (%)</span>
              </div>
              {results.map((item, index) => (
                <div key={index} className={styles.tableRow}>
                  <span className={styles.wordCell}>{item.word}</span>
                  <span className={styles.countCell}>{item.count}</span>
                  <span className={styles.densityCell}>
                    {item.density.toFixed(2)}%
                    <div className={styles.barContainer}>
                      <div className={styles.bar} style={{ width: `${Math.min(item.density * 2, 100)}%` }}></div>
                    </div>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}

