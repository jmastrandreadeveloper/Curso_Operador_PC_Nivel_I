import { useState, useEffect } from 'react'
import NavTree from './components/NavTree.jsx'
import PdfViewer from './components/PdfViewer.jsx'
import './App.css'

const TOTAL_CLASSES = 40

export default function App() {
  const [availablePdfs, setAvailablePdfs] = useState({ 'Práctica': [], 'Diapositivas': [], 'Apuntes': [], 'Historia': [], 'Word_Videos': [], 'Excel_Videos': [], 'Excel': [] })
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
      : selected.tipo === 'Word_Videos'
      ? `/pdfs/Word_Videos/${encodeURIComponent(selected.filename)}`
      : selected.tipo === 'Excel_Videos'
      ? `/pdfs/Excel_Videos/${encodeURIComponent(selected.filename)}`
      : selected.tipo === 'Excel'
      ? `/pdfs/Excel/${encodeURIComponent(selected.filename)}`
      : `/pdfs/${encodeURIComponent(selected.tipo)}/${String(selected.clase).padStart(2, '0')}.pdf`
    : null

  const headerTitle = selected
    ? selected.tipo === 'Historia'
      ? `Historia — ${selected.filename.replace(/^\d+-/, '').replace(/\.(pdf|mp4)$/, '').replace(/_/g, ' ')}`
      : selected.tipo === 'Word_Videos'
      ? `Word Videos — ${selected.filename.replace(/^Clase \d+ - /, '').replace(/\.mp4$/, '').trim()}`
      : selected.tipo === 'Excel_Videos'
      ? `Excel Videos — ${selected.filename.replace(/^p\d+_/, '').replace(/\.mp4$/, '').replace(/_/g, ' ')}`
      : selected.tipo === 'Excel'
      ? `Excel — ${selected.filename.replace(/\.pdf$/, '')}`
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
            wordVideos={availablePdfs['Word_Videos'] || []}
            excelVideos={availablePdfs['Excel_Videos'] || []}
            excelPdfs={availablePdfs['Excel'] || []}
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
