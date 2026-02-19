'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

type SignaturePosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center'

export default function SignPdfPage() {
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [signatureFile, setSignatureFile] = useState<File | null>(null)
  const [signaturePreview, setSignaturePreview] = useState<string | null>(null)
  const [position, setPosition] = useState<SignaturePosition>('bottom-right')
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setPdfFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier PDF')
        setPdfFile(null)
      }
    }
  }

  const handleSignatureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
      
      if (validTypes.includes(selectedFile.type) || 
          /\.(png|jpg|jpeg|webp)$/i.test(selectedFile.name)) {
        setSignatureFile(selectedFile)
        setError(null)
        setSuccess(false)
        
        // Créer une prévisualisation
        const reader = new FileReader()
        reader.onloadend = () => {
          setSignaturePreview(reader.result as string)
        }
        reader.readAsDataURL(selectedFile)
      } else {
        setError('Veuillez sélectionner une image (PNG, JPG, WebP)')
        setSignatureFile(null)
        setSignaturePreview(null)
      }
    }
  }

  const handleSign = async () => {
    if (!pdfFile) {
      setError('Veuillez sélectionner un fichier PDF')
      return
    }

    if (!signatureFile) {
      setError('Veuillez sélectionner une image de signature')
      return
    }

    if (pageNumber < 1) {
      setError('Le numéro de page doit être supérieur à 0')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', pdfFile)
      formData.append('signature', signatureFile)
      formData.append('position', position)
      formData.append('pageNumber', pageNumber.toString())

      const response = await axios.post('http://localhost:5000/api/convert/sign-pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', pdfFile.name.replace('.pdf', '-signe.pdf'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setPdfFile(null)
      setSignatureFile(null)
      setSignaturePreview(null)
      setPageNumber(1)
      const pdfInput = document.getElementById('pdf-input') as HTMLInputElement
      const signatureInput = document.getElementById('signature-input') as HTMLInputElement
      if (pdfInput) pdfInput.value = ''
      if (signatureInput) signatureInput.value = ''
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la signature')
    } finally {
      setLoading(false)
    }
  }

  const positionOptions: { value: SignaturePosition; label: string; icon: string }[] = [
    { value: 'bottom-right', label: 'Bas droite', icon: '↘️' },
    { value: 'bottom-left', label: 'Bas gauche', icon: '↙️' },
    { value: 'top-right', label: 'Haut droite', icon: '↗️' },
    { value: 'top-left', label: 'Haut gauche', icon: '↖️' },
    { value: 'center', label: 'Centre', icon: '📍' }
  ]

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Signer PDF</h1>
        <p className={styles.description}>
          Ajoutez votre signature sur votre document PDF
        </p>

        {/* Zone de téléchargement PDF */}
        <div className={styles.uploadArea}>
          <label className={styles.uploadLabel}>Fichier PDF :</label>
          <input
            id="pdf-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handlePdfChange}
            className={styles.fileInput}
          />
          <label htmlFor="pdf-input" className={styles.fileLabel}>
            {pdfFile ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>{pdfFile.name}</span>
              </div>
            ) : (
              'Sélectionner un fichier PDF'
            )}
          </label>
        </div>

        {/* Zone de téléchargement signature */}
        <div className={styles.uploadArea}>
          <label className={styles.uploadLabel}>Image de signature :</label>
          <input
            id="signature-input"
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/webp"
            onChange={handleSignatureChange}
            className={styles.fileInput}
          />
          <label htmlFor="signature-input" className={styles.fileLabel}>
            {signatureFile ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>✍️</span>
                <span className={styles.fileName}>{signatureFile.name}</span>
              </div>
            ) : (
              'Sélectionner une image de signature (PNG, JPG, WebP)'
            )}
          </label>
        </div>

        {/* Prévisualisation de la signature */}
        {signaturePreview && (
          <div className={styles.previewArea}>
            <label className={styles.previewLabel}>Aperçu de la signature :</label>
            <div className={styles.previewContainer}>
              <img src={signaturePreview} alt="Aperçu signature" className={styles.previewImage} />
            </div>
          </div>
        )}

        {/* Options de position */}
        <div className={styles.optionsSection}>
          <div className={styles.optionGroup}>
            <label className={styles.optionLabel}>Position de la signature :</label>
            <div className={styles.positionButtons}>
              {positionOptions.map((option) => (
                <button
                  key={option.value}
                  className={`${styles.positionButton} ${position === option.value ? styles.positionButtonActive : ''}`}
                  onClick={() => setPosition(option.value)}
                >
                  <span className={styles.positionIcon}>{option.icon}</span>
                  <span className={styles.positionLabel}>{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.optionGroup}>
            <label htmlFor="pageNumber" className={styles.optionLabel}>
              Numéro de page :
            </label>
            <input
              id="pageNumber"
              type="number"
              min="1"
              value={pageNumber}
              onChange={(e) => setPageNumber(parseInt(e.target.value) || 1)}
              className={styles.pageInput}
            />
            <span className={styles.pageHint}>La signature sera ajoutée sur cette page</span>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Signature réussie ! Le PDF signé a été téléchargé.
          </div>
        )}

        <button
          onClick={handleSign}
          disabled={!pdfFile || !signatureFile || loading}
          className={styles.signButton}
        >
          {loading ? 'Signature en cours...' : 'Signer le PDF'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            💡 <strong>Astuce :</strong> Utilisez une image de signature avec un fond transparent (PNG) pour un meilleur résultat.
            La signature sera ajoutée sur la page spécifiée à la position choisie.
          </p>
        </div>
      </div>
    </main>
  )
}

