'use client'
import { useState } from 'react'
import styles from './page.module.css'

export default function WordCounterPage() {
  const [text, setText] = useState('')

  const countWords = () => {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/\s+/).filter(word => word.length > 0).length
  }

  const countCharacters = () => {
    return text.length
  }

  const countCharactersNoSpaces = () => {
    return text.replace(/\s/g, '').length
  }

  const countParagraphs = () => {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
  }

  const countSentences = () => {
    const trimmed = text.trim()
    if (!trimmed) return 0
    return trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0).length
  }

  const estimateReadingTime = () => {
    const words = countWords()
    const wordsPerMinute = 200
    return Math.ceil(words / wordsPerMinute)
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Compteur mots</h1>
        <p className={styles.description}>Comptez les mots, caractères et paragraphes de votre texte</p>
        
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{countWords()}</div>
            <div className={styles.statLabel}>Mots</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{countCharacters()}</div>
            <div className={styles.statLabel}>Caractères</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{countCharactersNoSpaces()}</div>
            <div className={styles.statLabel}>Caractères (sans espaces)</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{countParagraphs()}</div>
            <div className={styles.statLabel}>Paragraphes</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{countSentences()}</div>
            <div className={styles.statLabel}>Phrases</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>{estimateReadingTime()}</div>
            <div className={styles.statLabel}>Min de lecture</div>
          </div>
        </div>

        <div className={styles.textAreaContainer}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.textarea}
            placeholder="Tapez ou collez votre texte ici..."
            rows={15}
          />
        </div>
      </div>
    </main>
  )
}

