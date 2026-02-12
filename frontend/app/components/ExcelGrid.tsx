'use client'

import { useState, useEffect, useRef } from 'react'
import styles from './ExcelGrid.module.css'

interface ExcelGridProps {
  data: any
  onDataChange?: (data: any) => void
}

export default function ExcelGrid({ data, onDataChange }: ExcelGridProps) {
  const [gridData, setGridData] = useState<string[][]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null)
  const [editValue, setEditValue] = useState<string>('')
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const processed = processJsonToGrid(data)
    setGridData(processed.rows)
    setHeaders(processed.headers)
  }, [data])

  const processJsonToGrid = (jsonData: any): { headers: string[]; rows: string[][] } => {
    if (!jsonData) return { headers: [], rows: [] }

    if (Array.isArray(jsonData)) {
      if (jsonData.length === 0) return { headers: [], rows: [] }

      // Si c'est un tableau d'objets
      if (typeof jsonData[0] === 'object' && jsonData[0] !== null) {
        const allKeys = new Set<string>()
        jsonData.forEach((item) => {
          if (item && typeof item === 'object') {
            Object.keys(item).forEach((key) => allKeys.add(key))
          }
        })

        const headers = Array.from(allKeys)
        const rows = jsonData.map((item) => {
          return headers.map((header) => {
            const value = item?.[header]
            if (value === null || value === undefined) return ''
            if (typeof value === 'object') return JSON.stringify(value)
            return String(value)
          })
        })

        return { headers, rows }
      } else {
        // Si c'est un tableau de valeurs simples
        return {
          headers: ['Valeur'],
          rows: jsonData.map((item) => [String(item ?? '')])
        }
      }
    } else if (typeof jsonData === 'object' && jsonData !== null) {
      // Si c'est un objet
      const keys = Object.keys(jsonData)
      const values = keys.map((key) => {
        const value = jsonData[key]
        if (value === null || value === undefined) return ''
        if (typeof value === 'object') return JSON.stringify(value)
        return String(value)
      })

      return {
        headers: ['Propriété', 'Valeur'],
        rows: keys.map((key, i) => [key, values[i]])
      }
    }

    return { headers: ['Valeur'], rows: [[String(jsonData)]] }
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
    setEditingCell({ row, col })
    setEditValue(gridData[row]?.[col] ?? '')
  }

  const handleCellChange = (newValue: string) => {
    if (editingCell) {
      const newGridData = [...gridData]
      if (!newGridData[editingCell.row]) {
        newGridData[editingCell.row] = []
      }
      newGridData[editingCell.row][editingCell.col] = newValue
      setGridData(newGridData)
      setEditValue(newValue)

      // Convertir la grille en JSON et notifier le changement
      if (onDataChange) {
        const jsonData = gridToJson(newGridData, headers)
        onDataChange(jsonData)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setEditingCell(null)
      if (row < gridData.length - 1) {
        handleCellClick(row + 1, col)
      }
    } else if (e.key === 'Escape') {
      setEditingCell(null)
      setEditValue('')
    } else if (e.key === 'Tab') {
      e.preventDefault()
      setEditingCell(null)
      if (col < headers.length - 1) {
        handleCellClick(row, col + 1)
      } else if (row < gridData.length - 1) {
        handleCellClick(row + 1, 0)
      }
    }
  }

  const gridToJson = (grid: string[][], headers: string[]): any => {
    if (headers.length === 0) return null

    if (headers.length === 1 && headers[0] === 'Valeur') {
      return grid.map((row) => row[0])
    }

    if (headers.length === 2 && headers[0] === 'Propriété') {
      const obj: any = {}
      grid.forEach((row) => {
        if (row[0] && row[1] !== undefined) {
          obj[row[0]] = row[1]
        }
      })
      return obj
    }

    // Tableau d'objets
    return grid.map((row) => {
      const obj: any = {}
      headers.forEach((header, index) => {
        const value = row[index] ?? ''
        // Essayer de parser comme JSON si possible
        try {
          obj[header] = JSON.parse(value)
        } catch {
          obj[header] = value
        }
      })
      return obj
    })
  }

  const getColumnLabel = (index: number): string => {
    let label = ''
    let num = index
    while (num >= 0) {
      label = String.fromCharCode(65 + (num % 26)) + label
      num = Math.floor(num / 26) - 1
    }
    return label
  }

  const handleTranspose = () => {
    if (gridData.length === 0 || headers.length === 0) return

    const newRows: string[][] = []
    const newHeaders: string[] = []

    // Détecter si on a déjà transposé (si les en-têtes suivent le pattern "Ligne X")
    // On vérifie si le premier en-tête est "Ligne" et si les suivants sont "Ligne 1", "Ligne 2", etc.
    const isAlreadyTransposed = headers.length > 1 && 
      headers[0] === 'Ligne' && 
      headers.slice(1).every((h, i) => {
        const expected = `Ligne ${i + 1}`
        return h === expected
      })

    if (isAlreadyTransposed) {
      // Si déjà transposé : utiliser la première colonne comme nouveaux en-têtes
      // La première colonne contient les anciens en-têtes (la première cellule de chaque ligne)
      const firstColValues = gridData.map(row => row[0] ?? '')
      
      // Utiliser toutes les valeurs de la première colonne comme nouveaux en-têtes
      newHeaders.push(...firstColValues)
      
      // Transposer le reste des colonnes (en commençant à la colonne 1, car la colonne 0 était les en-têtes)
      const maxCols = Math.max(...gridData.map(row => row.length))
      
      for (let col = 1; col < maxCols; col++) {
        const newRow: string[] = []
        // Récupérer la valeur de chaque ligne pour cette colonne
        gridData.forEach((row) => {
          newRow.push(row[col] ?? '')
        })
        newRows.push(newRow)
      }
    } else {
      // Première transposition : les lignes deviennent des colonnes
      // Créer les nouveaux en-têtes à partir des numéros de ligne
      newHeaders.push('Ligne')
      for (let i = 0; i < gridData.length; i++) {
        newHeaders.push(`Ligne ${i + 1}`)
      }

      // Transposer : chaque ancienne colonne devient une nouvelle ligne
      const maxCols = Math.max(...gridData.map(row => row.length), headers.length)
      
      for (let col = 0; col < maxCols; col++) {
        const newRow: string[] = []
        // Première cellule : l'ancien en-tête de colonne
        if (col < headers.length) {
          newRow.push(headers[col])
        } else {
          newRow.push(`Col ${getColumnLabel(col)}`)
        }
        
        // Récupérer la valeur de chaque ligne pour cette colonne
        gridData.forEach((row) => {
          newRow.push(row[col] ?? '')
        })
        newRows.push(newRow)
      }
    }

    setGridData(newRows)
    setHeaders(newHeaders)
    setSelectedCell(null)
    setEditingCell(null)

    // Notifier le changement
    if (onDataChange) {
      const jsonData = gridToJson(newRows, newHeaders)
      onDataChange(jsonData)
    }
  }

  const handleRemoveEmpty = () => {
    if (gridData.length === 0) return

    // Supprimer les lignes où toutes les cellules sont vides
    const newRows = gridData.filter((row) => {
      return row.some((cell) => cell.trim() !== '')
    })

    if (newRows.length !== gridData.length) {
      setGridData(newRows)
      setSelectedCell(null)
      setEditingCell(null)

      // Notifier le changement
      if (onDataChange) {
        const jsonData = gridToJson(newRows, headers)
        onDataChange(jsonData)
      }
    }
  }

  const handleRemoveDuplicates = () => {
    if (gridData.length === 0) return

    // Supprimer les lignes en double
    const seen = new Set<string>()
    const newRows: string[][] = []

    gridData.forEach((row) => {
      // Créer une clé unique pour la ligne
      const rowKey = row.join('|')
      if (!seen.has(rowKey)) {
        seen.add(rowKey)
        newRows.push(row)
      }
    })

    if (newRows.length !== gridData.length) {
      setGridData(newRows)
      setSelectedCell(null)
      setEditingCell(null)

      // Notifier le changement
      if (onDataChange) {
        const jsonData = gridToJson(newRows, headers)
        onDataChange(jsonData)
      }
    }
  }

  return (
    <div className={styles.gridContainer} ref={gridRef}>
      <div className={styles.gridHeader}>
        <div className={styles.gridInfo}>
          {gridData.length} x {headers.length}
        </div>
        <div className={styles.toolbar}>
          <button
            className={styles.toolbarButton}
            onClick={handleTranspose}
            title="Transposer (échanger lignes et colonnes)"
          >
            <span className={styles.buttonIcon}>↔️</span>
            <span className={styles.buttonText}>Transposer</span>
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleRemoveEmpty}
            title="Supprimer les lignes vides"
          >
            <span className={styles.buttonIcon}>🗑️</span>
            <span className={styles.buttonText}>Supprimer les Vides</span>
          </button>
          <button
            className={styles.toolbarButton}
            onClick={handleRemoveDuplicates}
            title="Supprimer les lignes en double"
          >
            <span className={styles.buttonIcon}>✂️</span>
            <span className={styles.buttonText}>Supprimer les Doublons</span>
          </button>
        </div>
      </div>
      <div className={styles.gridWrapper}>
        <div className={styles.grid}>
          {/* En-têtes de colonnes */}
          <div className={styles.row}>
            <div className={styles.cornerCell}></div>
            {headers.map((header, colIndex) => (
              <div key={colIndex} className={styles.headerCell}>
                <div className={styles.columnLabel}>{getColumnLabel(colIndex)}</div>
                <div className={styles.headerText}>{header}</div>
              </div>
            ))}
          </div>

          {/* Lignes de données */}
          {gridData.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              <div className={styles.rowNumber}>{rowIndex + 1}</div>
              {headers.map((_, colIndex) => {
                const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                const isEditing = editingCell?.row === rowIndex && editingCell?.col === colIndex
                const cellValue = row[colIndex] ?? ''

                return (
                  <div
                    key={colIndex}
                    className={`${styles.cell} ${isSelected ? styles.cellSelected : ''}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {isEditing ? (
                      <input
                        type="text"
                        className={styles.cellInput}
                        value={editValue}
                        onChange={(e) => {
                          setEditValue(e.target.value)
                          handleCellChange(e.target.value)
                        }}
                        onBlur={() => setEditingCell(null)}
                        onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                        autoFocus
                      />
                    ) : (
                      <div className={styles.cellContent}>{cellValue}</div>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

