@echo off
chcp 65001 > nul
title FasoPressing Pro - Barouba Group

echo =========================================================================
echo  [🇧🇫] FASO PRESSING PRO - PAR BAROUBA GROUP (BURKINA FASO)
echo =========================================================================
echo.

cd /d "%~dp0"

:: 1. Priorité à la version Portable autonome dans le dossier courant
if exist "%~dp0FasoPressing-Pro-Portable.exe" (
    echo [*] Lancement de FasoPressing Pro Portable (.exe)...
    start "" "%~dp0FasoPressing-Pro-Portable.exe"
    exit
)

:: 2. Version décompressée haute performance
if exist "%~dp0..\dist-electron\win-unpacked\FasoPressing Pro.exe" (
    echo [*] Lancement de FasoPressing Pro Unpacked...
    start "" "%~dp0..\dist-electron\win-unpacked\FasoPressing Pro.exe"
    exit
)

:: 3. Moteur Electron local (Node)
cd /d "%~dp0\.."
if exist "node_modules\electron\dist\electron.exe" (
    echo [*] Lancement via le moteur Electron local...
    start "" "node_modules\electron\dist\electron.exe" "2 - APPLICATION WINDOWS (BUREAU)\main.js"
    exit
)

echo [!] Fichiers de lancement introuvables.
pause
