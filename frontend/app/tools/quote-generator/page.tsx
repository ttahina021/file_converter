'use client'
import { useState } from 'react'
import axios from 'axios'
import { useCurrency } from '../../contexts/CurrencyContext'
import styles from './page.module.css'

interface QuoteItem {
  description: string
  quantity: number
  unitPrice: number
  tva: number
}

export default function QuoteGeneratorPage() {
  const { formatAmount } = useCurrency()
  const [quoteNumber, setQuoteNumber] = useState('')
  const [quoteDate, setQuoteDate] = useState(new Date().toISOString().split('T')[0])
  const [validityDate, setValidityDate] = useState('')
  const [sellerName, setSellerName] = useState('')
  const [sellerAddress, setSellerAddress] = useState('')
  const [sellerEmail, setSellerEmail] = useState('')
  const [sellerPhone, setSellerPhone] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [buyerAddress, setBuyerAddress] = useState('')
  const [items, setItems] = useState<QuoteItem[]>([{ description: '', quantity: 1, unitPrice: 0, tva: 20 }])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unitPrice: 0, tva: 20 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const updateItem = (index: number, field: keyof QuoteItem, value: string | number) => {
    const newItems = [...items]
    newItems[index] = { ...newItems[index], [field]: value }
    setItems(newItems)
  }

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      const subtotal = item.quantity * item.unitPrice
      const tvaAmount = subtotal * (item.tva / 100)
      return sum + subtotal + tvaAmount
    }, 0)
  }

  const handleGenerate = async () => {
    if (!quoteNumber || !sellerName || !buyerName) {
      setError('Veuillez remplir les champs obligatoires (Numéro, Vendeur, Client)')
      return
    }
    if (items.some(item => !item.description || item.quantity <= 0 || item.unitPrice < 0)) {
      setError('Veuillez remplir correctement tous les articles')
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const quoteData = {
        quoteNumber,
        quoteDate,
        validityDate,
        seller: { name: sellerName, address: sellerAddress, email: sellerEmail, phone: sellerPhone },
        buyer: { name: buyerName, address: buyerAddress },
        items,
        notes,
        total: calculateTotal()
      }

      const response = await axios.post('http://localhost:5000/api/convert/generate-quote', quoteData, {
        responseType: 'blob',
        headers: { 'Content-Type': 'application/json' }
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `devis-${quoteNumber}.pdf`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>Générateur Devis</h1>
        <p className={styles.description}>Créez des devis PDF professionnels</p>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Informations devis</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Numéro de devis *</label>
              <input type="text" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Date devis</label>
              <input type="date" value={quoteDate} onChange={(e) => setQuoteDate(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Date de validité</label>
              <input type="date" value={validityDate} onChange={(e) => setValidityDate(e.target.value)} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Vendeur</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nom / Entreprise *</label>
              <input type="text" value={sellerName} onChange={(e) => setSellerName(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse</label>
              <textarea value={sellerAddress} onChange={(e) => setSellerAddress(e.target.value)} className={styles.textarea} rows={2} />
            </div>
            <div className={styles.formGroup}>
              <label>Email</label>
              <input type="email" value={sellerEmail} onChange={(e) => setSellerEmail(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Téléphone</label>
              <input type="tel" value={sellerPhone} onChange={(e) => setSellerPhone(e.target.value)} className={styles.input} />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Client</h3>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label>Nom / Entreprise *</label>
              <input type="text" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} className={styles.input} />
            </div>
            <div className={styles.formGroup}>
              <label>Adresse</label>
              <textarea value={buyerAddress} onChange={(e) => setBuyerAddress(e.target.value)} className={styles.textarea} rows={2} />
            </div>
          </div>
        </div>

        <div className={styles.formSection}>
          <div className={styles.itemsHeader}>
            <h3 className={styles.sectionTitle}>Articles</h3>
            <button onClick={addItem} className={styles.addButton}>+ Ajouter</button>
          </div>
          <div className={styles.itemsList}>
            {items.map((item, index) => (
              <div key={index} className={styles.itemRow}>
                <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(index, 'description', e.target.value)} className={styles.itemInput} />
                <input type="number" placeholder="Qté" min="1" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))} className={styles.itemInputSmall} />
                <input type="number" placeholder="Prix unit." step="0.01" min="0" value={item.unitPrice} onChange={(e) => updateItem(index, 'unitPrice', Number(e.target.value))} className={styles.itemInputSmall} />
                <input type="number" placeholder="TVA %" min="0" max="100" value={item.tva} onChange={(e) => updateItem(index, 'tva', Number(e.target.value))} className={styles.itemInputSmall} />
                <span className={styles.itemTotal}>
                  {formatAmount(item.quantity * item.unitPrice * (1 + item.tva / 100))}
                </span>
                <button onClick={() => removeItem(index)} className={styles.removeButton}>✕</button>
              </div>
            ))}
          </div>
          <div className={styles.totalSection}>
            <strong>Total TTC : {formatAmount(calculateTotal())}</strong>
          </div>
        </div>

        <div className={styles.formSection}>
          <h3 className={styles.sectionTitle}>Notes</h3>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} className={styles.textarea} rows={3} placeholder="Conditions, notes additionnelles..." />
        </div>

        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>Devis généré avec succès !</div>}

        <button onClick={handleGenerate} disabled={loading} className={styles.generateButton}>
          {loading ? 'Génération en cours...' : 'Générer le devis PDF'}
        </button>

        <div className={styles.infoBox}>
          <p className={styles.infoText}>💡 <strong>Note :</strong> Les devis sont générés en PDF et peuvent être téléchargés immédiatement.</p>
        </div>
      </div>
    </main>
  )
}

