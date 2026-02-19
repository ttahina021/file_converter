'use client'
import { useState } from 'react'
import styles from './page.module.css'

export default function RobotsTxtGeneratorPage() {
  const [userAgents, setUserAgents] = useState(['*'])
  const [allowPaths, setAllowPaths] = useState<string[]>([''])
  const [disallowPaths, setDisallowPaths] = useState<string[]>(['/admin', '/private'])
  const [sitemap, setSitemap] = useState('')
  const [crawlDelay, setCrawlDelay] = useState('')
  const [generated, setGenerated] = useState('')

  const addUserAgent = () => {
    setUserAgents([...userAgents, '*'])
  }

  const removeUserAgent = (index: number) => {
    setUserAgents(userAgents.filter((_, i) => i !== index))
  }

  const updateUserAgent = (index: number, value: string) => {
    const newAgents = [...userAgents]
    newAgents[index] = value
    setUserAgents(newAgents)
  }

  const addAllowPath = () => {
    setAllowPaths([...allowPaths, ''])
  }

  const removeAllowPath = (index: number) => {
    setAllowPaths(allowPaths.filter((_, i) => i !== index))
  }

  const updateAllowPath = (index: number, value: string) => {
    const newPaths = [...allowPaths]
    newPaths[index] = value
    setAllowPaths(newPaths)
  }

  const addDisallowPath = () => {
    setDisallowPaths([...disallowPaths, ''])
  }

  const removeDisallowPath = (index: number) => {
    setDisallowPaths(disallowPaths.filter((_, i) => i !== index))
  }

  const updateDisallowPath = (index: number, value: string) => {
    const newPaths = [...disallowPaths]
    newPaths[index] = value
    setDisallowPaths(newPaths)
  }

  const generate = () => {
    let robots = ''
    
    userAgents.forEach((agent, index) => {
      if (index > 0) robots += '\n'
      robots += `User-agent: ${agent}\n`
      
      allowPaths.filter(p => p.trim()).forEach(path => {
        robots += `Allow: ${path}\n`
      })
      
      disallowPaths.filter(p => p.trim()).forEach(path => {
        robots += `Disallow: ${path}\n`
      })
      
      if (crawlDelay) {
        robots += `Crawl-delay: ${crawlDelay}\n`
      }
    })
    
    if (sitemap) {
      robots += `\nSitemap: ${sitemap}\n`
    }
    
    setGenerated(robots)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generated)
    alert('Code copié dans le presse-papiers !')
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur robots.txt</h1>
        <p className={styles.description}>Générez un fichier robots.txt personnalisé</p>
        
        <div className={styles.formSection}>
          <div className={styles.formGroup}>
            <label className={styles.label}>User-agent</label>
            {userAgents.map((agent, index) => (
              <div key={index} className={styles.inputRow}>
                <input type="text" value={agent} onChange={(e) => updateUserAgent(index, e.target.value)} className={styles.input} placeholder="*" />
                {userAgents.length > 1 && (
                  <button onClick={() => removeUserAgent(index)} className={styles.removeButton}>✕</button>
                )}
              </div>
            ))}
            <button onClick={addUserAgent} className={styles.addButton}>+ Ajouter User-agent</button>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Allow (chemins autorisés)</label>
            {allowPaths.map((path, index) => (
              <div key={index} className={styles.inputRow}>
                <input type="text" value={path} onChange={(e) => updateAllowPath(index, e.target.value)} className={styles.input} placeholder="/public" />
                <button onClick={() => removeAllowPath(index)} className={styles.removeButton}>✕</button>
              </div>
            ))}
            <button onClick={addAllowPath} className={styles.addButton}>+ Ajouter Allow</button>
          </div>
          
          <div className={styles.formGroup}>
            <label className={styles.label}>Disallow (chemins interdits)</label>
            {disallowPaths.map((path, index) => (
              <div key={index} className={styles.inputRow}>
                <input type="text" value={path} onChange={(e) => updateDisallowPath(index, e.target.value)} className={styles.input} placeholder="/admin" />
                <button onClick={() => removeDisallowPath(index)} className={styles.removeButton}>✕</button>
              </div>
            ))}
            <button onClick={addDisallowPath} className={styles.addButton}>+ Ajouter Disallow</button>
          </div>
          
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Crawl-delay (secondes)</label>
              <input type="number" value={crawlDelay} onChange={(e) => setCrawlDelay(e.target.value)} className={styles.input} placeholder="10" min="0" />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Sitemap (URL)</label>
              <input type="url" value={sitemap} onChange={(e) => setSitemap(e.target.value)} className={styles.input} placeholder="https://example.com/sitemap.xml" />
            </div>
          </div>
        </div>

        <button onClick={generate} className={styles.generateButton}>
          Générer robots.txt
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

