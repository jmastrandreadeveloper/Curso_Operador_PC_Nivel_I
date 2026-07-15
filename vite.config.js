import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { createReadStream, existsSync, readdirSync, statSync } from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PDFS_DIR = path.join(__dirname, 'PDFs')

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'pdf-server',
      configureServer(server) {
        // Serve PDF and media files at /pdfs/*
        server.middlewares.use('/pdfs', (req, res, next) => {
          try {
            const decodedPath = decodeURIComponent(req.url)
            const filePath = path.join(PDFS_DIR, decodedPath)
            if (existsSync(filePath) && statSync(filePath).isFile()) {
              const ext = path.extname(filePath).toLowerCase()
              const contentType = ext === '.mp4' ? 'video/mp4' : 'application/pdf'
              res.setHeader('Content-Type', contentType)
              res.setHeader('Cache-Control', 'no-cache')
              createReadStream(filePath).pipe(res)
            } else {
              next()
            }
          } catch {
            next()
          }
        })

        // API endpoint: returns list of available PDFs per class and type
        server.middlewares.use('/api/classes', (req, res) => {
          const result = {}
          const types = ['Práctica', 'Diapositivas', 'Apuntes']
          for (const tipo of types) {
            const dir = path.join(PDFS_DIR, tipo)
            if (existsSync(dir)) {
              const files = readdirSync(dir)
                .filter(f => f.endsWith('.pdf'))
                .map(f => parseInt(f.replace('.pdf', ''), 10))
                .filter(n => !isNaN(n))
              result[tipo] = files
            } else {
              result[tipo] = []
            }
          }
          const historiaDir = path.join(PDFS_DIR, 'Historia')
          result['Historia'] = existsSync(historiaDir)
            ? readdirSync(historiaDir).filter(f => f.endsWith('.pdf') || f.endsWith('.mp4'))
            : []
          const wordVideosDir = path.join(PDFS_DIR, 'Word_Videos')
          result['Word_Videos'] = existsSync(wordVideosDir)
            ? readdirSync(wordVideosDir).filter(f => f.endsWith('.mp4')).sort()
            : []
          const excelVideosDir = path.join(PDFS_DIR, 'Excel_Videos')
          result['Excel_Videos'] = existsSync(excelVideosDir)
            ? readdirSync(excelVideosDir).filter(f => /^p\d+_/.test(f) && f.endsWith('.mp4')).sort()
            : []
          const excelDir = path.join(PDFS_DIR, 'Excel')
          result['Excel'] = existsSync(excelDir)
            ? readdirSync(excelDir).filter(f => f.endsWith('.pdf')).sort()
            : []
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        })
      }
    }
  ]
})
