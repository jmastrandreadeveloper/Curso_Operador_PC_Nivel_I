@echo off
cd /d "%~dp0"
echo.
echo  =============================================
echo   Preparando version para Google Drive...
echo  =============================================
echo.

:: --------------------------------------------
:: Verificar que node.exe portable este listo
:: --------------------------------------------
if not exist "node_portable\node.exe" (
    echo  ATENCION: Falta node.exe portable.
    echo.
    echo  Hay que hacerlo UNA SOLA VEZ:
    echo.
    echo    1. Ir a:  https://nodejs.org/en/download
    echo    2. Descargar "Windows Binary (.zip)" de 64-bit
    echo    3. Abrir el ZIP descargado
    echo    4. Copiar el archivo  node.exe  a esta carpeta:
    echo.
    echo       %~dp0node_portable\
    echo.
    echo    5. Volver a ejecutar este script
    echo.
    pause
    exit /b 1
)

:: --------------------------------------------
:: Verificar Node.js local para compilar
:: --------------------------------------------
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo  ERROR: Esta PC necesita Node.js instalado para compilar.
    echo  Descarga: https://nodejs.org
    pause
    exit /b 1
)

:: Instalar dependencias si faltan
if not exist "node_modules" (
    echo [1/4] Instalando dependencias...
    call npm install
    echo.
)

:: Compilar la app
echo [2/4] Compilando la aplicacion React...
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo  ERROR al compilar. Revisa los mensajes de arriba.
    pause
    exit /b 1
)
echo.

:: Armar carpeta con todo incluido
echo [3/4] Armando paquete...
if exist "CursoOperadorPC" rmdir /s /q "CursoOperadorPC"
mkdir "CursoOperadorPC"
mkdir "CursoOperadorPC\node"

robocopy "dist"          "CursoOperadorPC\dist"  /e /nfl /ndl /njh /njs >nul
robocopy "PDFs"          "CursoOperadorPC\PDFs"  /e /nfl /ndl /njh /njs >nul
copy "server.js"          "CursoOperadorPC\server.js"  >nul
copy "usb_iniciar.bat"    "CursoOperadorPC\iniciar.bat" >nul
copy "node_portable\node.exe" "CursoOperadorPC\node\node.exe" >nul

:: Crear ZIP
echo [4/4] Creando CursoOperadorPC.zip...
if exist "CursoOperadorPC.zip" del "CursoOperadorPC.zip"
powershell -NoProfile -Command "Compress-Archive -Path 'CursoOperadorPC\*' -DestinationPath 'CursoOperadorPC.zip' -Force"
if %errorlevel% neq 0 (
    echo.
    echo  ERROR al crear el ZIP.
    pause
    exit /b 1
)

rmdir /s /q "CursoOperadorPC"

echo.
echo  =============================================
echo   Listo! Archivo generado:
echo.
echo     CursoOperadorPC.zip
echo.
echo   SUBIR A GOOGLE DRIVE y compartir con alumnos.
echo.
echo   EL ALUMNO SOLO DEBE:
echo     1. Descargar CursoOperadorPC.zip
echo     2. Clic derecho > Extraer todo...
echo     3. Entrar a la carpeta extraida
echo     4. Doble clic en  iniciar.bat
echo     5. El curso se abre en el navegador
echo.
echo   NO SE NECESITA INSTALAR NADA EN LA PC.
echo  =============================================
echo.
pause
