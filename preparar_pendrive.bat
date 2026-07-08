@echo off
cd /d "%~dp0"
echo.
echo  =============================================
echo   Preparando version para pendrive...
echo  =============================================
echo.

:: Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no esta instalado.
    pause
    exit /b 1
)

:: Instalar dependencias si faltan
if not exist "node_modules" (
    echo [1/3] Instalando dependencias...
    call npm install
    echo.
)

:: Compilar la app
echo [2/3] Compilando la aplicacion React...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ERROR al compilar. Revisa los mensajes de arriba.
    pause
    exit /b 1
)
echo.

:: Crear carpeta pendrive
echo [3/3] Armando carpeta pendrive...
if exist "pendrive" rmdir /s /q "pendrive"
mkdir "pendrive"

:: Copiar archivos necesarios
robocopy "dist"  "pendrive\dist"  /e /nfl /ndl /njh /njs >nul
robocopy "PDFs"  "pendrive\PDFs"  /e /nfl /ndl /njh /njs >nul
copy "server.js"     "pendrive\server.js"     >nul
copy "usb_iniciar.bat" "pendrive\iniciar.bat" >nul

echo.
echo  =============================================
echo   Listo!
echo.
echo   Carpeta "pendrive" creada en este proyecto.
echo   Copia TODO su contenido al pendrive.
echo.
echo   En la otra PC solo hace doble clic en:
echo     iniciar.bat
echo.
echo   REQUISITO: Node.js debe estar instalado
echo   en la PC destino (una sola vez).
echo   Descarga: https://nodejs.org (version LTS)
echo  =============================================
echo.
pause
