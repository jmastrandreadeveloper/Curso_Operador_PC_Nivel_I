import { useState, useEffect } from 'react'
import NavTree from './components/NavTree.jsx'
import PdfViewer from './components/PdfViewer.jsx'
import './App.css'

const TOTAL_CLASSES = 40

export default function App() {
  const [availablePdfs, setAvailablePdfs] = useState({ 'Práctica': [], 'Diapositivas': [], 'Apuntes': [], 'Historia': [] })
  const [selected, setSelected] = useState(null) // { clase, tipo } | { tipo: 'Historia', filename }

  useEffect(() => {
    fetch('/api/classes')
      .then(r => r.json())
      .then(data => setAvailablePdfs(data))
      .catch(() => {})
  }, [])

  const resourceUrl = selected
    ? selected.tipo === 'Historia'
      ? `/pdfs/Historia/${encodeURIComponent(selected.filename)}`
      : `/pdfs/${encodeURIComponent(selected.tipo)}/${String(selected.clase).padStart(2, '0')}.pdf`
    : null

  const headerTitle = selected
    ? selected.tipo === 'Historia'
      ? `Historia — ${selected.filename.replace(/^\d+-/, '').replace(/\.(pdf|mp4)$/, '').replace(/_/g, ' ')}`
      : `Clase ${String(selected.clase).padStart(2, '0')} — ${selected.tipo}`
    : 'Selecciona una clase'

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-course-title">Curso Operador de PC - Nivel I</div>
        <div className="header-class-info">{headerTitle}</div>
      </header>

      <div className="app-body">
        <aside className="app-sidebar">
          <NavTree
            totalClasses={TOTAL_CLASSES}
            availablePdfs={availablePdfs}
            historiaFiles={availablePdfs['Historia'] || []}
            selected={selected}
            onSelect={setSelected}
          />
        </aside>

        <main className="app-content">
          <PdfViewer url={resourceUrl} />
        </main>
      </div>
    </div>
  )
}
