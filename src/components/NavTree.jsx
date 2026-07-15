import { useState, useMemo } from 'react'
import './NavTree.css'

const TIPOS = ['Diapositivas', 'Práctica', 'Apuntes']

function historiaLabel(filename) {
  return filename.replace(/^\d+-/, '').replace(/\.(pdf|mp4)$/, '').replace(/_/g, ' ')
}

function wordVideoLabel(filename) {
  return filename.replace(/^Clase \d+ - /, '').replace(/\.mp4$/, '').trim()
}

function excelVideoLabel(filename) {
  return filename.replace(/^p\d+_/, '').replace(/\.mp4$/, '').replace(/_/g, ' ')
}

export default function NavTree({ totalClasses, availablePdfs, historiaFiles, wordVideos = [], excelVideos = [], excelPdfs = [], selected, onSelect }) {
  const [openClasses, setOpenClasses] = useState(new Set())
  const [openHistoria, setOpenHistoria] = useState(new Set())
  const [openWordVideos, setOpenWordVideos] = useState(false)
  const [openWordClasses, setOpenWordClasses] = useState(new Set())
  const [openExcelVideos, setOpenExcelVideos] = useState(false)
  const [openExcelClasses, setOpenExcelClasses] = useState(new Set())

  const historiaByClass = useMemo(() => {
    const map = {}
    for (const filename of historiaFiles) {
      const num = parseInt(filename.split('-')[0], 10)
      if (!isNaN(num)) {
        if (!map[num]) map[num] = []
        map[num].push(filename)
      }
    }
    return map
  }, [historiaFiles])

  const wordVideosByClass = useMemo(() => {
    const map = {}
    for (const filename of wordVideos) {
      const match = filename.match(/^Clase (\d+)/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!map[num]) map[num] = []
        map[num].push(filename)
      }
    }
    return map
  }, [wordVideos])

  const excelVideosByClass = useMemo(() => {
    const map = {}
    for (const filename of excelVideos) {
      const match = filename.match(/^p(\d+)_/)
      if (match) {
        const num = parseInt(match[1], 10)
        if (!map[num]) map[num] = []
        map[num].push(filename)
      }
    }
    return map
  }, [excelVideos])

  function toggleClass(num) {
    setOpenClasses(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  function toggleHistoria(num) {
    setOpenHistoria(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  function toggleWordClass(num) {
    setOpenWordClasses(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  function toggleExcelClass(num) {
    setOpenExcelClasses(prev => {
      const next = new Set(prev)
      if (next.has(num)) next.delete(num)
      else next.add(num)
      return next
    })
  }

  function isAvailable(tipo, num) {
    return availablePdfs[tipo]?.includes(num)
  }

  function isSelected(tipo, num) {
    return selected?.tipo === tipo && selected?.clase === num
  }

  function isHistoriaSelected(filename) {
    return selected?.tipo === 'Historia' && selected?.filename === filename
  }

  function isWordVideoSelected(filename) {
    return selected?.tipo === 'Word_Videos' && selected?.filename === filename
  }

  function isExcelVideoSelected(filename) {
    return selected?.tipo === 'Excel_Videos' && selected?.filename === filename
  }

  function isExcelPdfSelected(filename) {
    return selected?.tipo === 'Excel' && selected?.filename === filename
  }

  return (
    <nav className="nav-tree">
      <div className="nav-header">Clases del Curso</div>
      <ul className="nav-list">
        {Array.from({ length: totalClasses }, (_, i) => i + 1).map(num => {
          const isOpen = openClasses.has(num)
          const claseHistoria = historiaByClass[num] || []
          const hasAny = TIPOS.some(t => isAvailable(t, num)) || claseHistoria.length > 0
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
                  {claseHistoria.length > 0 && (
                    <li className="nav-subfolder">
                      <button
                        className="nav-tipo-btn nav-subfolder-btn"
                        onClick={() => toggleHistoria(num)}
                      >
                        <span className="nav-class-arrow">{openHistoria.has(num) ? '▾' : '▸'}</span>
                        <span className="nav-tipo-icon">🕰️</span>
                        Historia
                      </button>
                      {openHistoria.has(num) && (
                        <ul className="nav-sub-list nav-sub-list--nested">
                          {claseHistoria.map(filename => {
                            const isVideo = filename.endsWith('.mp4')
                            const sel = isHistoriaSelected(filename)
                            return (
                              <li key={filename}>
                                <button
                                  className={`nav-tipo-btn ${sel ? 'selected' : ''}`}
                                  onClick={() => onSelect({ tipo: 'Historia', filename })}
                                  title={historiaLabel(filename)}
                                >
                                  <span className="nav-tipo-icon">{isVideo ? '🎬' : '📄'}</span>
                                  {historiaLabel(filename)}
                                </button>
                              </li>
                            )
                          })}
                        </ul>
                      )}
                    </li>
                  )}
                </ul>
              )}
            </li>
          )
        })}
      </ul>

      {wordVideos.length > 0 && (
        <>
          <div className="nav-header nav-header--section">
            <button
              className="nav-class-btn has-content"
              onClick={() => setOpenWordVideos(v => !v)}
            >
              <span className="nav-class-arrow">{openWordVideos ? '▾' : '▸'}</span>
              <span className="nav-tipo-icon">🎬</span>
              <span className="nav-class-label">Word Videos</span>
              <span className="nav-dot" />
            </button>
          </div>
          {openWordVideos && (
            <ul className="nav-list">
              {Object.keys(wordVideosByClass).sort((a, b) => a - b).map(numStr => {
                const num = parseInt(numStr, 10)
                const videos = wordVideosByClass[num]
                const isOpen = openWordClasses.has(num)
                return (
                  <li key={num} className="nav-class-item">
                    <button
                      className="nav-class-btn has-content"
                      onClick={() => toggleWordClass(num)}
                    >
                      <span className="nav-class-arrow">{isOpen ? '▾' : '▸'}</span>
                      <span className="nav-class-label">
                        Clase {String(num).padStart(2, '0')}
                      </span>
                      <span className="nav-dot" />
                    </button>
                    {isOpen && (
                      <ul className="nav-sub-list">
                        {videos.map(filename => {
                          const sel = isWordVideoSelected(filename)
                          return (
                            <li key={filename}>
                              <button
                                className={`nav-tipo-btn ${sel ? 'selected' : ''}`}
                                onClick={() => onSelect({ tipo: 'Word_Videos', filename })}
                                title={wordVideoLabel(filename)}
                              >
                                <span className="nav-tipo-icon">▶</span>
                                {wordVideoLabel(filename)}
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
          )}
        </>
      )}

      {excelPdfs.length > 0 && (
        <>
          <div className="nav-header nav-header--section">
            <span className="nav-tipo-icon">📗</span>
            <span className="nav-class-label">Excel</span>
          </div>
          <ul className="nav-list">
            {excelPdfs.map(filename => {
              const sel = isExcelPdfSelected(filename)
              return (
                <li key={filename} className="nav-class-item">
                  <button
                    className={`nav-tipo-btn ${sel ? 'selected' : ''}`}
                    onClick={() => onSelect({ tipo: 'Excel', filename })}
                    title={filename.replace(/\.pdf$/, '')}
                  >
                    <span className="nav-tipo-icon">📄</span>
                    {filename.replace(/\.pdf$/, '')}
                  </button>
                </li>
              )
            })}
          </ul>
        </>
      )}

      {excelVideos.length > 0 && (
        <>
          <div className="nav-header nav-header--section">
            <button
              className="nav-class-btn has-content"
              onClick={() => setOpenExcelVideos(v => !v)}
            >
              <span className="nav-class-arrow">{openExcelVideos ? '▾' : '▸'}</span>
              <span className="nav-tipo-icon">🎬</span>
              <span className="nav-class-label">Excel Videos</span>
              <span className="nav-dot" />
            </button>
          </div>
          {openExcelVideos && (
            <ul className="nav-list">
              {Object.keys(excelVideosByClass).sort((a, b) => a - b).map(numStr => {
                const num = parseInt(numStr, 10)
                const videos = excelVideosByClass[num]
                const isOpen = openExcelClasses.has(num)
                return (
                  <li key={num} className="nav-class-item">
                    <button
                      className="nav-class-btn has-content"
                      onClick={() => toggleExcelClass(num)}
                    >
                      <span className="nav-class-arrow">{isOpen ? '▾' : '▸'}</span>
                      <span className="nav-class-label">
                        Parte {String(num).padStart(2, '0')}
                      </span>
                      <span className="nav-dot" />
                    </button>
                    {isOpen && (
                      <ul className="nav-sub-list">
                        {videos.map(filename => {
                          const sel = isExcelVideoSelected(filename)
                          return (
                            <li key={filename}>
                              <button
                                className={`nav-tipo-btn ${sel ? 'selected' : ''}`}
                                onClick={() => onSelect({ tipo: 'Excel_Videos', filename })}
                                title={excelVideoLabel(filename)}
                              >
                                <span className="nav-tipo-icon">▶</span>
                                {excelVideoLabel(filename)}
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
          )}
        </>
      )}
    </nav>
  )
}
