const { app, BrowserWindow, Menu, globalShortcut, shell } = require('electron');
const path = require('path');
const http = require('http');
const { fork } = require('child_process');

let mainWindow = null;
let serverProcess = null;
const PORT = 4000;
const ROOT_DIR = path.resolve(__dirname, '..');

// Vérifie si le serveur tourne déjà sur le port 4000
function checkServerRunning(port, callback) {
  const req = http.get(`http://localhost:${port}/api/data`, (res) => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
}

// Démarre le serveur local de l'atelier
function startLocalServer(callback) {
  checkServerRunning(PORT, (running) => {
    if (running) {
      console.log(`[Windows] Serveur local déjà actif sur http://localhost:${PORT}`);
      callback();
    } else {
      console.log(`[Windows] Démarrage du serveur local embarqué...`);
      const serverScript = path.join(ROOT_DIR, 'server.js');
      serverProcess = fork(serverScript, [], {
        cwd: ROOT_DIR,
        env: { ...process.env, PORT: PORT }
      });
      // Attendre 1 seconde que le serveur démarre
      setTimeout(callback, 1200);
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: "FasoPressing Pro - Application Bureau Windows",
    backgroundColor: '#0F172A',
    autoHideMenuBar: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  // Injecter la détection de la plateforme Windows
  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      window.isElectron = true;
      if (typeof applyPlatformBranding === 'function') {
        applyPlatformBranding();
      }
    `);
  });

  // Menu natif de l'application Windows
  const template = [
    {
      label: 'FasoPressing',
      submenu: [
        { label: 'Nouvelle Vente / Dépôt (Ctrl+N)', accelerator: 'CmdOrCtrl+N', click: () => {
          mainWindow.webContents.executeJavaScript(`openNewDepositModal();`);
        }},
        { label: 'Rechercher Ticket / Client (Ctrl+K)', accelerator: 'CmdOrCtrl+K', click: () => {
          mainWindow.webContents.executeJavaScript(`openSpotlightSearch();`);
        }},
        { type: 'separator' },
        { label: 'Verrouiller Terminal (PIN)', click: () => {
          mainWindow.webContents.executeJavaScript(`lockScreen();`);
        }},
        { type: 'separator' },
        { label: 'Quitter', role: 'quit' }
      ]
    },
    {
      label: 'Affichage & Caisses',
      submenu: [
        { label: 'Plein Écran POS (Caisse)', accelerator: 'F11', click: () => {
          mainWindow.setFullScreen(!mainWindow.isFullScreen());
        }},
        { label: 'Actualiser les données', accelerator: 'CmdOrCtrl+R', role: 'reload' },
        { type: 'separator' },
        { label: 'Zoom Avant', role: 'zoomIn' },
        { label: 'Zoom Arrière', role: 'zoomOut' },
        { label: 'Taille Normale', role: 'resetZoom' }
      ]
    },
    {
      label: 'Impression',
      submenu: [
        { label: 'Imprimer Ticket Actif', accelerator: 'CmdOrCtrl+P', click: () => {
          mainWindow.webContents.print({ silent: false, printBackground: true });
        }}
      ]
    },
    {
      label: 'Aide & Cloud',
      submenu: [
        { label: 'Ouvrir la version Web Cloud (Vercel)', click: () => {
          shell.openExternal('https://faso-pressing-pro.vercel.app');
        }},
        { label: 'Dépôt GitHub', click: () => {
          shell.openExternal('https://github.com/baroubagroup/faso-pressing-pro');
        }}
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow.loadURL(`http://localhost:${PORT}`);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  startLocalServer(() => {
    createWindow();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (serverProcess) {
    try { serverProcess.kill(); } catch (e) {}
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
