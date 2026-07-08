import { useState, useEffect } from 'react'
import NavTree from './components/NavTree.jsx'
import PdfViewer from './components/PdfViewer.jsx'
import './App.css'

const TOTAL_CLASSES = 40

export default function App() {
  const [availablePdfs, setAvailablePdfs] = useState({ 'Práctica': [], 'Teoría': [] })
  const [selected, setSelected] = useState(null) // { class: number, tipo: 'Práctica'|'Teoría' }

  useEffect(() => {
    fetch('/api/classes')
      .then(r => r.json())
      .then(data => setAvailablePdfs(data))
      .catch(() => {})
  }, [])

  const pdfUrl = selected
    ? `/pdfs/${encodeURIComponent(selected.tipo)}/${String(selected.clase).padStart(2, '0')}.pdf`
    : null

  const headerTitle = selected
    ? `Clase ${String(selected.clase).padStart(2, '0')} — ${selected.tipo}`
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
            selected={selected}
            onSelect={setSelected}
          />
        </aside>

        <main className="app-content">
          <PdfViewer url={pdfUrl} />
        </main>
      </div>
    </div>
  )
}
