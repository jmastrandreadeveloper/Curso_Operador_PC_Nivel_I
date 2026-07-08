import './PdfViewer.css'

export default function PdfViewer({ url }) {
  if (!url) {
    return (
      <div className="pdf-placeholder">
        <div className="pdf-placeholder-icon">📄</div>
        <p className="pdf-placeholder-text">Selecciona una clase del panel izquierdo para ver el PDF</p>
      </div>
    )
  }

  return (
    <iframe
      key={url}
      className="pdf-iframe"
      src={url}
      title="Visor de PDF"
    />
  )
}
