@echo off
chcp 65001 > nul
title FasoPressing Pro - Sélecteur de Plateforme
color 0B

:MENU
cls
echo ================================================================================
echo               🇧🇫  FASO PRESSING PRO - SÉLECTEUR DE PLATEFORME
echo ================================================================================
echo.
echo   [1] 💻 LANCER L'APPLICATION BUREAU WINDOWS (Mode Dédié / Plein Écran POS)
echo   [2] 🌐 OUVRIR LA VERSION WEB CLOUD (https://faso-pressing-pro.vercel.app)
echo   [3] 📱 GUIDE D'INSTALLATION SUR SMARTPHONE ANDROID
echo   [4] ⚙️  DÉMARRER LE MOTEUR LOCAL EN ARRIÈRE-PLAN (Port 4000)
echo   [5] 📂 OUVRIR LE DOSSIER DU PROJET
echo   [0] ❌ QUITTER
echo.
echo ================================================================================
set /p CHOIX="Entrez votre choix (1, 2, 3, 4, 5 ou 0) : "

if "%CHOIX%"=="1" goto WINDOWS
if "%CHOIX%"=="2" goto WEB
if "%CHOIX%"=="3" goto ANDROID
if "%CHOIX%"=="4" goto SERVEUR
if "%CHOIX%"=="5" goto DOSSIER
if "%CHOIX%"=="0" exit
goto MENU

:WINDOWS
cls
echo [*] Lancement de l'Application Bureau Windows...
call "2 - APPLICATION WINDOWS (BUREAU)\LANCER-APPLICATION-WINDOWS.bat"
goto MENU

:WEB
cls
echo [*] Ouverture de la version Web Cloud dans votre navigateur...
start https://faso-pressing-pro.vercel.app
timeout /t 2 > nul
goto MENU

:ANDROID
cls
notepad "3 - APPLICATION ANDROID (MOBILE)\GUIDE-INSTALLATION-ANDROID.txt"
goto MENU

:SERVEUR
cls
echo [*] Démarrage du serveur Node.js sur le port 4000...
start "FasoPressing-Serveur" node server.js
timeout /t 2 > nul
echo [OK] Serveur démarré sur http://localhost:4000 !
pause
goto MENU

:DOSSIER
explorer "%~dp0"
goto MENU
