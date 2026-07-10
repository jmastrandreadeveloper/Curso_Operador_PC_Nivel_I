import { useState } from 'react'
import './NavTree.css'

const TIPOS = ['Diapositivas', 'Práctica', 'Apuntes']

export default function NavTree({ totalClasses, availablePdfs, selected, onSelect }) {
  const [openClasses, setOpenClasses] = useState(new Set())

  function toggleClass(num) {
    setOpenClasses(prev => {
      const next = new Set(prev)
      if (next.has(num)) {
        next.delete(num)
      } else {
        next.add(num)
      }
      return next
    })
  }

  function isAvailable(tipo, num) {
    return availablePdfs[tipo]?.includes(num)
  }

  function isSelected(tipo, num) {
    return selected?.tipo === tipo && selected?.clase === num
  }

  return (
    <nav className="nav-tree">
      <div className="nav-header">Clases del Curso</div>
      <ul className="nav-list">
        {Array.from({ length: totalClasses }, (_, i) => i + 1).map(num => {
          const isOpen = openClasses.has(num)
          const hasAny = TIPOS.some(t => isAvailable(t, num))
          return (
            <li key={num} className="nav-class-item">
              <button
                className={`nav-class-btn ${hasAny ? 'has-content' : 'no-content'}`}
                onClick={() => toggleClass(num)}
              >
                <span className="nav-class-arrow">{isOpen ? '▾' : '▸'}</span>
                <span className="nav-class-label">
                  Clase {String(num).padStart(2, '0')}
                </span>
                {hasAny && <span className="nav-dot" />}
              </button>

              {isOpen && (
                <ul className="nav-sub-list">
                  {TIPOS.map(tipo => {
                    const available = isAvailable(tipo, num)
                    const sel = isSelected(tipo, num)
                    return (
                      <li key={tipo}>
                        <button
                          className={`nav-tipo-btn ${sel ? 'selected' : ''} ${!available ? 'unavailable' : ''}`}
                          onClick={() => available && onSelect({ clase: num, tipo })}
                          disabled={!available}
                          title={!available ? 'PDF no disponible' : `Ver ${tipo}`}
                        >
                          <span className="nav-tipo-icon">
                            {tipo === 'Diapositivas' ? '📖' : tipo === 'Práctica' ? '🔧' : '📝'}
                          </span>
                          {tipo}
                          {!available && <span className="nav-unavailable-badge">—</span>}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
