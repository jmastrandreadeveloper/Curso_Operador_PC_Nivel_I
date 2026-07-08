@echo off
echo Iniciando Curso Operador de PC - Nivel I...
echo.

:: Verificar que Node.js esta instalado
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    echo Descargalo desde https://nodejs.org e instala la version LTS.
    pause
    exit /b 1
)

:: Instalar dependencias si no existen
if not exist "node_modules" (
    echo Instalando dependencias por primera vez...
    npm install
    echo.
)

:: Abrir el navegador automaticamente
start "" "http://localhost:5173"

:: Iniciar el servidor
npm run dev
