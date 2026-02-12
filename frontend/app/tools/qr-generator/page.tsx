'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function QrGeneratorPage() {
  const [text, setText] = useState<string>('')
  const [logo, setLogo] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [foregroundColor, setForegroundColor] = useState<string>('#000000')
  const [backgroundColor, setBackgroundColor] = useState<string>('#FFFFFF')
  const [size, setSize] = useState<number>(300)
  const [qrPreview, setQrPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type.startsWith('image/')) {
        setLogo(selectedFile)
        const reader = new FileReader()
        reader.onloadend = () => {
          setLogoPreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setError('Veuillez sélectionner un fichier image')
        setLogo(null)
        setLogoPreview(null)
      }
    }
  }

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Veuillez saisir un texte ou une URL')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('text', text)
      formData.append('foregroundColor', foregroundColor)
      formData.append('backgroundColor', backgroundColor)
      formData.append('size', size.toString())
      
      if (logo) {
        formData.append('logo', logo)
      }

      const response = await axios.post('http://localhost:5000/api/convert/qr-code', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer une prévisualisation
      const url = window.URL.createObjectURL(new Blob([response.data]))
      setQrPreview(url)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la génération')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = () => {
    if (qrPreview) {
      const link = document.createElement('a')
      link.href = qrPreview
      link.setAttribute('download', 'qrcode.png')
      document.body.appendChild(link)
      link.click()
      link.remove()
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur de QR Code</h1>
        <p className={styles.description}>
          Générez des QR codes personnalisés avec votre logo et vos couleurs
        </p>

        {/* Champ de texte */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Texte ou URL :</label>
          <textarea
            className={styles.textInput}
            value={text}
            onChange={(e) => {
              setText(e.target.value)
              setError(null)
            }}
            placeholder="Entrez le texte ou l'URL à encoder dans le QR code..."
            rows={3}
          />
        </div>

        {/* Options de personnalisation */}
        <div className={styles.optionsGrid}>
          {/* Couleur de premier plan */}
          <div className={styles.optionGroup}>
            <label className={styles.label}>Couleur du QR code :</label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={foregroundColor}
                onChange={(e) => setForegroundColor(e.target.value)}
                className={styles.colorTextInput}
              />
            </div>
          </div>

          {/* Couleur de fond */}
          <div className={styles.optionGroup}>
            <label className={styles.label}>Couleur de fond :</label>
            <div className={styles.colorInputWrapper}>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className={styles.colorInput}
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className={styles.colorTextInput}
              />
            </div>
          </div>

          {/* Taille */}
          <div className={styles.optionGroup}>
            <label className={styles.label}>Taille (px) :</label>
            <input
              type="number"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              min={100}
              max={1000}
              className={styles.sizeInput}
            />
          </div>
        </div>

        {/* Logo */}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Logo (optionnel) :</label>
          <div className={styles.logoUpload}>
            <input
              id="logo-input"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className={styles.fileInput}
            />
            <label htmlFor="logo-input" className={styles.fileLabel}>
              {logo ? logo.name : 'Sélectionner un logo'}
            </label>
            {logoPreview && (
              <div className={styles.logoPreview}>
                <img src={logoPreview} alt="Logo preview" className={styles.logoImage} />
                <button
                  onClick={() => {
                    setLogo(null)
                    setLogoPreview(null)
                    const fileInput = document.getElementById('logo-input') as HTMLInputElement
                    if (fileInput) fileInput.value = ''
                  }}
                  className={styles.removeLogo}
                >
                  ✕
                </button>
              </div>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button
          onClick={handleGenerate}
          disabled={!text.trim() || loading}
          className={styles.generateButton}
        >
          {loading ? 'Génération en cours...' : 'Générer le QR Code'}
        </button>

        {/* Prévisualisation */}
        {qrPreview && (
          <div className={styles.previewSection}>
            <h3 className={styles.previewTitle}>Aperçu :</h3>
            <div className={styles.previewContainer}>
              <img src={qrPreview} alt="QR Code" className={styles.qrImage} />
            </div>
            <button onClick={handleDownload} className={styles.downloadButton}>
              Télécharger le QR Code
            </button>
          </div>
        )}
      </div>
    </main>
  )
}

