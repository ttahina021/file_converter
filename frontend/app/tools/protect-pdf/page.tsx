'use client'

import { useState } from 'react'
import axios from 'axios'
import styles from './page.module.css'

export default function ProtectPdfPage() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        setFile(selectedFile)
        setError(null)
        setSuccess(false)
      } else {
        setError('Veuillez sélectionner un fichier PDF')
        setFile(null)
      }
    }
  }

  const validatePassword = () => {
    if (password.length < 4) {
      return 'Le mot de passe doit contenir au moins 4 caractères'
    }
    if (password !== confirmPassword) {
      return 'Les mots de passe ne correspondent pas'
    }
    return null
  }

  const handleProtect = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier PDF')
      return
    }

    const validationError = validatePassword()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)

      const response = await axios.post('http://localhost:5000/api/convert/protect-pdf', formData, {
        responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      // Créer un lien de téléchargement
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', file.name.replace('.pdf', '-protege.pdf'))
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
      setFile(null)
      setPassword('')
      setConfirmPassword('')
      const fileInput = document.getElementById('file-input') as HTMLInputElement
      if (fileInput) {
        fileInput.value = ''
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la protection')
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = () => {
    if (password.length === 0) return { strength: 0, label: '', color: '' }
    if (password.length < 4) return { strength: 1, label: 'Faible', color: '#ff4444' }
    if (password.length < 8) return { strength: 2, label: 'Moyen', color: '#ffa500' }
    if (password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password)) {
      return { strength: 3, label: 'Fort', color: '#3c3' }
    }
    return { strength: 2, label: 'Moyen', color: '#ffa500' }
  }

  const passwordStrength = getPasswordStrength()

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Protéger PDF</h1>
        <p className={styles.description}>
          Ajoutez un mot de passe à votre PDF pour le sécuriser
        </p>

        {/* Zone de téléchargement */}
        <div className={styles.uploadArea}>
          <input
            id="file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={handleFileChange}
            className={styles.fileInput}
          />
          <label htmlFor="file-input" className={styles.fileLabel}>
            {file ? (
              <div className={styles.fileInfo}>
                <span className={styles.fileIcon}>📄</span>
                <span className={styles.fileName}>{file.name}</span>
              </div>
            ) : (
              'Sélectionner un fichier PDF'
            )}
          </label>
        </div>

        {/* Champs de mot de passe */}
        <div className={styles.passwordSection}>
          <div className={styles.passwordField}>
            <label htmlFor="password" className={styles.passwordLabel}>
              Mot de passe :
            </label>
            <div className={styles.passwordInputContainer}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez un mot de passe"
                className={styles.passwordInput}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={styles.togglePassword}
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password.length > 0 && (
              <div className={styles.passwordStrength}>
                <div className={styles.strengthBar}>
                  <div
                    className={styles.strengthFill}
                    style={{
                      width: `${(passwordStrength.strength / 3) * 100}%`,
                      backgroundColor: passwordStrength.color
                    }}
                  />
                </div>
                <span className={styles.strengthLabel} style={{ color: passwordStrength.color }}>
                  {passwordStrength.label}
                </span>
              </div>
            )}
          </div>

          <div className={styles.passwordField}>
            <label htmlFor="confirmPassword" className={styles.passwordLabel}>
              Confirmer le mot de passe :
            </label>
            <input
              id="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirmez le mot de passe"
              className={`${styles.passwordInput} ${confirmPassword && password !== confirmPassword ? styles.passwordInputError : ''}`}
            />
            {confirmPassword && password !== confirmPassword && (
              <span className={styles.errorText}>Les mots de passe ne correspondent pas</span>
            )}
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && (
          <div className={styles.success}>
            Protection réussie ! Le fichier protégé a été téléchargé.
          </div>
        )}

        <button
          onClick={handleProtect}
          disabled={!file || !password || password !== confirmPassword || loading}
          className={styles.protectButton}
        >
          {loading ? 'Protection en cours...' : 'Protéger le PDF'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>
            🔒 <strong>Important :</strong> Notez bien votre mot de passe. Sans lui, vous ne pourrez plus ouvrir le PDF protégé.
            Utilisez un mot de passe fort avec au moins 8 caractères, incluant des majuscules, minuscules et chiffres.
          </p>
        </div>
      </div>
    </main>
  )
}

