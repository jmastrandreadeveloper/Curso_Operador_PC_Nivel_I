# Curso Operador de PC - Nivel I

App React para navegar y visualizar los PDFs del curso organizados por clase (Teoría / Práctica).

---

## Estructura de PDFs

Los PDFs van en la carpeta `PDFs/` nombrados con el número de clase en dos dígitos:

```
PDFs/
├── Teoría/
│   ├── 01.pdf
│   ├── 02.pdf
│   └── ...
└── Práctica/
    ├── 01.pdf
    └── ...
```

---

## Uso en desarrollo (esta PC)

Doble clic en `iniciar.bat`

O desde terminal:
```bash
npm install   # solo la primera vez
npm run dev
```

Abre el navegador en `http://localhost:5173`

---

## Generar pendrive (app portable)

### Paso 1 — Preparar
Doble clic en `preparar_pendrive.bat`

El script hace automáticamente:
1. Instala dependencias (si no están)
2. Compila la app (`npm run build`)
3. Crea la carpeta `pendrive/` con todo lo necesario

### Paso 2 — Copiar al pendrive
Copiar **todo el contenido** de la carpeta `pendrive/` al pendrive físico.

```
pendrive/
├── dist/        <- app compilada
├── PDFs/        <- PDFs del curso
├── server.js    <- servidor
└── iniciar.bat  <- lanzador
```

### Paso 3 — Usar en otra PC
1. **Una sola vez:** instalar Node.js LTS desde https://nodejs.org
2. **Cada vez:** conectar el pendrive y doble clic en `iniciar.bat`
   - Se abre el navegador automáticamente en `http://localhost:5173`

### Actualizar el pendrive
Cuando agregues nuevos PDFs, volvé a correr `preparar_pendrive.bat` para regenerar el pendrive con el contenido actualizado.

---

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo con hot-reload |
| `npm run build` | Compila la app para producción |
| `npm run serve` | Servidor de producción (requiere `npm run build` previo) |

---

## Requisitos

- Node.js LTS — https://nodejs.org
- Git (para clonar/actualizar el repo)
