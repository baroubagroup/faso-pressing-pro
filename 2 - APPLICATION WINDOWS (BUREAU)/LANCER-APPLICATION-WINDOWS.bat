@echo off
chcp 65001 > nul
title FasoPressing Pro - Application Bureau Windows

echo =========================================================================
echo  [💻] LANCEMENT DE FASO PRESSING PRO - APPLICATION BUREAU WINDOWS
echo =========================================================================
echo.

cd /d "%~dp0\.."

:: 1. Vérifier si le serveur local tourne déjà
netstat -ano | findstr :4000 > nul
if %errorlevel% neq 0 (
    echo [*] Démarrage du moteur local FasoPressing sur le port 4000...
    start "FasoPressing-Serveur" /min node server.js
    timeout /t 2 /nobreak > nul
) else (
    echo [OK] Moteur local déjà actif sur le port 4000.
)

:: 2. Vérifier si Electron est installé localement
if exist "node_modules\electron\dist\electron.exe" (
    echo [*] Lancement via le moteur Electron Natif...
    start "" "node_modules\electron\dist\electron.exe" "2 - APPLICATION WINDOWS (BUREAU)\main.js"
    exit
)

:: 3. Sinon, lancer en Mode Application Native Windows Standalone (Microsoft Edge App Mode)
echo [*] Lancement de la fenêtre native Windows Standalone...
start msedge.exe --app=http://localhost:4000 --window-size=1400,900 --start-maximized

echo [OK] Application lancée avec succès !
exit
