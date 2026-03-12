'use client'
import { useState } from 'react'
import styles from './page.module.css'

interface UrlEntry {
  loc: string
  lastmod: string
  changefreq: string
  priority: string
}

export default function SitemapGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState('')
  const [urls, setUrls] = useState<UrlEntry[]>([{ loc: '', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' }])
  const [generated, setGenerated] = useState('')

  const addUrl = () => {
    setUrls([...urls, { loc: '', lastmod: new Date().toISOString().split('T')[0], changefreq: 'monthly', priority: '0.5' }])
  }

  const removeUrl = (index: number) => {
    setUrls(urls.filter((_, i) => i !== index))
  }

  const updateUrl = (index: number, field: keyof UrlEntry, value: string) => {
    const newUrls = [...urls]
    newUrls[index] = { ...newUrls[index], [field]: value }
    setUrls(newUrls)
  }

  const generate = () => {
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    urls.filter(url => url.loc.trim()).forEach(url => {
      xml += '  <url>\n'
      xml += `    <loc>${url.loc}</loc>\n`
      if (url.lastmod) {
        xml += `    <lastmod>${url.lastmod}</lastmod>\n`
      }
      if (url.changefreq) {
        xml += `    <changefreq>${url.changefreq}</changefreq>\n`
      }
      if (url.priority) {
        xml += `    <priority>${url.priority}</priority>\n`
      }
      xml += '  </url>\n'
    })
    
    xml += '</urlset>'
    setGenerated(xml)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    alert('Code copié dans le presse-papiers !')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur sitemap.xml</h1>
        <p className={styles.description}>Créez un sitemap.xml pour votre site web</p>
        
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>URL de base (optionnel)</label>
            <input type="url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} className={styles.input} placeholder="https://example.com" />
            <span className={styles.hint}>Si fourni, les URLs relatives seront complétées automatiquement</span>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>URLs</label>
            {urls.map((url, index) => (
              <div key={index} className={styles.urlEntry}>
                <div className={styles.urlRow}>
                  <input type="text" value={url.loc} onChange={(e) => updateUrl(index, 'loc', e.target.value)} className={styles.input} placeholder="/page" />
                  <button onClick={() => removeUrl(index)} className={styles.removeButton}>✕</button>
                </div>
                <div className={styles.urlMeta}>
                  <input type="date" value={url.lastmod} onChange={(e) => updateUrl(index, 'lastmod', e.target.value)} className={styles.inputSmall} />
                  <select value={url.changefreq} onChange={(e) => updateUrl(index, 'changefreq', e.target.value)} className={styles.inputSmall}>
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                  <select value={url.priority} onChange={(e) => updateUrl(index, 'priority', e.target.value)} className={styles.inputSmall}>
                    <option value="1.0">1.0</option>
                    <option value="0.9">0.9</option>
                    <option value="0.8">0.8</option>
                    <option value="0.7">0.7</option>
                    <option value="0.6">0.6</option>
                    <option value="0.5">0.5</option>
                    <option value="0.4">0.4</option>
                    <option value="0.3">0.3</option>
                    <option value="0.2">0.2</option>
                    <option value="0.1">0.1</option>
                  </select>
                </div>
              </div>
            ))}
            <button onClick={addUrl} className={styles.addButton}>+ Ajouter une URL</button>
          </div>
        </div>

        <button onClick={generate} className={styles.generateButton} disabled={urls.every(u => !u.loc.trim())}>
          Générer sitemap.xml
        </button>

        {generated && (
          <div className={styles.resultSection}>
            <div className={styles.resultHeader}>
              <h3>Fichier généré :</h3>
              <button onClick={copyToClipboard} className={styles.copyButton}>📋 Copier</button>
            </div>
            <pre className={styles.codeBlock}>{generated}</pre>
          </div>
        )}
      </div>
    </main>
  )
}

