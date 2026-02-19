'use client'
import { useState } from 'react'
import styles from './page.module.css'

export default function MetaTagGeneratorPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [keywords, setKeywords] = useState('')
  const [author, setAuthor] = useState('')
  const [viewport, setViewport] = useState('width=device-width, initial-scale=1.0')
  const [charset, setCharset] = useState('UTF-8')
  const [language, setLanguage] = useState('fr')
  const [robots, setRobots] = useState('index, follow')
  const [generated, setGenerated] = useState('')

  const generate = () => {
    let html = '<head>\n'
    
    if (charset) {
      html += `  <meta charset="${charset}">\n`
    }
    
    if (viewport) {
      html += `  <meta name="viewport" content="${viewport}">\n`
    }
    
    if (title) {
      html += `  <title>${title}</title>\n`
      html += `  <meta name="title" content="${title}">\n`
    }
    
    if (description) {
      html += `  <meta name="description" content="${description}">\n`
    }
    
    if (keywords) {
      html += `  <meta name="keywords" content="${keywords}">\n`
    }
    
    if (author) {
      html += `  <meta name="author" content="${author}">\n`
    }
    
    if (language) {
      html += `  <meta http-equiv="content-language" content="${language}">\n`
    }
    
    if (robots) {
      html += `  <meta name="robots" content="${robots}">\n`
    }
    
    html += '</head>'
    setGenerated(html)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    alert('Code copié dans le presse-papiers !')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur Meta Tag</h1>
        <p className={styles.description}>Générez des balises meta optimisées pour le SEO</p>
        
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Titre *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} placeholder="Mon Site Web" />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} rows={3} placeholder="Description de votre site web (150-160 caractères recommandés)" maxLength={160} />
            <span className={styles.charCount}>{description.length}/160</span>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Mots-clés</label>
            <input type="text" value={keywords} onChange={(e) => setKeywords(e.target.value)} className={styles.input} placeholder="mot-clé1, mot-clé2, mot-clé3" />
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Auteur</label>
              <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className={styles.input} placeholder="Votre nom" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Langue</label>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className={styles.input}>
                <option value="fr">Français</option>
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Viewport</label>
              <input type="text" value={viewport} onChange={(e) => setViewport(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Robots</label>
              <select value={robots} onChange={(e) => setRobots(e.target.value)} className={styles.input}>
                <option value="index, follow">Index, Follow</option>
                <option value="noindex, nofollow">Noindex, Nofollow</option>
                <option value="index, nofollow">Index, Nofollow</option>
                <option value="noindex, follow">Noindex, Follow</option>
              </select>
            </div>
          </div>
        </div>

        <button onClick={generate} className={styles.generateButton} disabled={!title || !description}>
          Générer les balises meta
        </button>

        {generated && (
          <div className={styles.resultSection}>
            <div className={styles.resultHeader}>
              <h3>Code généré :</h3>
              <button onClick={copyToClipboard} className={styles.copyButton}>📋 Copier</button>
            </div>
            <pre className={styles.codeBlock}>{generated}</pre>
          </div>
        )}
      </div>
    </main>
  )
}

