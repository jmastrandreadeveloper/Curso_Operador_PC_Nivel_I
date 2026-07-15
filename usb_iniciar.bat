@echo off
cd /d "%~dp0"

:: Buscar Node.js local en el pendrive primero
if exist "%~dp0node\node.exe" (
    set NODE="%~dp0node\node.exe"
    goto :run
)

:: Buscar Node.js instalado en el sistema
node --version >nul 2>&1
if %errorlevel% equ 0 (
    set NODE=node
    goto :run
)

:: No se encontro Node.js
echo.
echo  ERROR: Node.js no esta instalado ni se encuentra en el pendrive.
echo.
echo  Opciones:
echo   1. Instala Node.js desde https://nodejs.org (version LTS)
echo      luego vuelve a hacer doble clic en este archivo.
echo.
echo   2. O descarga Node.js portable y extraelo en la carpeta
echo      "node" dentro de este pendrive.
echo.
pause
exit /b 1

:run
echo  Iniciando Curso Operador de PC - Nivel I...
echo  Node: %NODE%
echo  Directorio: %~dp0
echo.
echo  (Si algo falla, revisar error.log en esta carpeta)
echo.
%NODE% server.js > "%~dp0error.log" 2>&1
if %errorlevel% neq 0 (
    echo.
    echo  ERROR: El servidor fallo. Revisa el archivo error.log
    echo.
    type "%~dp0error.log"
    echo.
    pause
)
