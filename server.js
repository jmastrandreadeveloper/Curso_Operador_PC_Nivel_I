import { createServer } from 'http'
import { createReadStream, existsSync, readdirSync, statSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PORT = 5173
const DIST_DIR = path.join(__dirname, 'dist')
const PDFS_DIR = path.join(__dirname, 'PDFs')

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js':   'application/javascript',
  '.css':  'text/css',
  '.pdf':  'application/pdf',
  '.json': 'application/json',
  '.png':  'image/png',
  '.ico':  'image/x-icon',
  '.svg':  'image/svg+xml',
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`)
  const pathname = decodeURIComponent(url.pathname)

  // API: lista de PDFs disponibles
  if (pathname === '/api/classes') {
    const result = {}
    for (const tipo of ['Práctica', 'Diapositivas', 'Apuntes']) {
      const dir = path.join(PDFS_DIR, tipo)
      if (existsSync(dir)) {
        result[tipo] = readdirSync(dir)
          .filter(f => f.endsWith('.pdf'))
          .map(f => parseInt(f, 10))
          .filter(n => !isNaN(n))
      } else {
        result[tipo] = []
      }
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
    return
  }

  // Servir PDFs
  if (pathname.startsWith('/pdfs/')) {
    const rel = pathname.slice(6)
    const filePath = path.join(PDFS_DIR, rel)
    if (existsSync(filePath) && statSync(filePath).isFile()) {
      res.writeHead(200, { 'Content-Type': 'application/pdf' })
      createReadStream(filePath).pipe(res)
      return
    }
    res.writeHead(404)
    res.end('PDF no encontrado')
    return
  }

  // Servir archivos estaticos del build
  let filePath = path.join(DIST_DIR, pathname)
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    filePath = path.join(DIST_DIR, 'index.html')
  }

  if (existsSync(filePath)) {
    const ext = path.extname(filePath)
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' })
    createReadStream(filePath).pipe(res)
  } else {
    res.writeHead(404)
    res.end('No encontrado')
  }
})

server.listen(PORT, () => {
  console.log('')
  console.log('  Curso Operador de PC - Nivel I')
  console.log(`  http://localhost:${PORT}`)
  console.log('')
  console.log('  Presiona Ctrl+C para cerrar el servidor.')
  console.log('')
  exec(`start http://localhost:${PORT}`)
})
