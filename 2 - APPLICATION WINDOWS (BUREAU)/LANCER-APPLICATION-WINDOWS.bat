@echo off
chcp 65001 > nul
title FasoPressing Pro - Barouba Group

echo =========================================================================
echo  [🇧🇫] FASO PRESSING PRO - PAR BAROUBA GROUP (BURKINA FASO)
echo =========================================================================
echo.

cd /d "%~dp0"

:: 1. Priorité au binaire natif haute performance (Démarrage instantané < 1 sec)
if exist "..\dist-electron\win-unpacked\FasoPressing Pro.exe" (
    echo [*] Lancement ultra-rapide de FasoPressing Pro...
    start "" "..\dist-electron\win-unpacked\FasoPressing Pro.exe"
    exit
)

:: 2. Version Portable autonome
if exist "FasoPressing-Pro-Portable.exe" (
    echo [*] Lancement de FasoPressing Pro Portable (.exe)...
    start "" "FasoPressing-Pro-Portable.exe"
    exit
)

:: 3. Moteur Electron embarqué
cd /d "%~dp0\.."
if exist "node_modules\electron\dist\electron.exe" (
    echo [*] Lancement via le moteur Electron local...
    start "" "node_modules\electron\dist\electron.exe" "2 - APPLICATION WINDOWS (BUREAU)\main.js"
    exit
)

echo [!] Fichiers de lancement introuvables.
pause
