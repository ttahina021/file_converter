'use client'
import { useState } from 'react'
import styles from './page.module.css'

export default function OpenGraphGeneratorPage() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [type, setType] = useState('website')
  const [siteName, setSiteName] = useState('')
  const [locale, setLocale] = useState('fr_FR')
  const [generated, setGenerated] = useState('')

  const generate = () => {
    let html = '<!-- Open Graph / Facebook -->\n'
    html += '<meta property="og:type" content="' + type + '">\n'
    
    if (url) {
      html += '<meta property="og:url" content="' + url + '">\n'
    }
    
    if (title) {
      html += '<meta property="og:title" content="' + title + '">\n'
    }
    
    if (description) {
      html += '<meta property="og:description" content="' + description + '">\n'
    }
    
    if (image) {
      html += '<meta property="og:image" content="' + image + '">\n'
    }
    
    if (siteName) {
      html += '<meta property="og:site_name" content="' + siteName + '">\n'
    }
    
    if (locale) {
      html += '<meta property="og:locale" content="' + locale + '">\n'
    }
    
    html += '\n<!-- Twitter -->\n'
    html += '<meta property="twitter:card" content="summary_large_image">\n'
    
    if (url) {
      html += '<meta property="twitter:url" content="' + url + '">\n'
    }
    
    if (title) {
      html += '<meta property="twitter:title" content="' + title + '">\n'
    }
    
    if (description) {
      html += '<meta property="twitter:description" content="' + description + '">\n'
    }
    
    if (image) {
      html += '<meta property="twitter:image" content="' + image + '">\n'
    }
    
    setGenerated(html)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    alert('Code copié dans le presse-papiers !')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur Open Graph</h1>
        <p className={styles.description}>Créez des balises Open Graph pour les réseaux sociaux</p>
        
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Titre *</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className={styles.input} placeholder="Mon Article" />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Description *</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className={styles.textarea} rows={3} placeholder="Description de votre contenu" maxLength={200} />
            <span className={styles.charCount}>{description.length}/200</span>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>URL *</label>
            <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} className={styles.input} placeholder="https://example.com/page" />
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Image (URL) *</label>
            <input type="url" value={image} onChange={(e) => setImage(e.target.value)} className={styles.input} placeholder="https://example.com/image.jpg" />
            <span className={styles.hint}>Recommandé : 1200x630px</span>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className={styles.input}>
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="video">Video</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Locale</label>
              <select value={locale} onChange={(e) => setLocale(e.target.value)} className={styles.input}>
                <option value="fr_FR">Français (FR)</option>
                <option value="en_US">English (US)</option>
                <option value="es_ES">Español (ES)</option>
                <option value="de_DE">Deutsch (DE)</option>
              </select>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Nom du site</label>
            <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className={styles.input} placeholder="Mon Site Web" />
          </div>
        </div>

        <button onClick={generate} className={styles.generateButton} disabled={!title || !description || !url || !image}>
          Générer les balises Open Graph
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

