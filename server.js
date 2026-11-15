const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = process.env.PORT || 4000;
const DB_FILE = path.join(__dirname, 'data', 'db.json');

// Données initiales typiques du Burkina Faso
const initialData = {
  settings: {
    name: "Pressing Élite Faso",
    tagline: "L'art de l'élégance et de la propreté",
    city: "Ouagadougou",
    district: "Ouaga 2000 (Non loin du Monument des Héros)",
    phone1: "+226 70 00 11 22",
    phone2: "+226 76 33 44 55",
    currency: "FCFA",
    atelierPin: "2260", // Code PIN sécurisé par défaut pour l'atelier / mobile
    ticketFooter: "Les linges non réclamés après 60 jours seront donnés. Merci de vérifier vos articles avant de quitter le pressing.",
    whatsappWelcome: "Bonjour [NOM], bienvenue au Pressing Élite Faso. Votre ticket #[TICKET] de [NOMBRE] article(s) a bien été enregistré. Montant total: [TOTAL] FCFA. Reste à payer: [RESTE] FCFA. Date prévue: [DATE]. Merci pour votre confiance !"
  },
  articles: [
    // Traditionnel & Bazin
    { id: "art-1", name: "Bazin Riche Brodé (3 pièces)", category: "Traditionnel & Bazin", priceWashIron: 3500, priceIronOnly: 2000, icon: "sparkles" },
    { id: "art-2", name: "Bazin Simple (Lavage + Amidonnage)", category: "Traditionnel & Bazin", priceWashIron: 2000, priceIronOnly: 1200, icon: "shirt" },
    { id: "art-3", name: "Faso Dan Fani complet", category: "Traditionnel & Bazin", priceWashIron: 3000, priceIronOnly: 1800, icon: "gem" },
    { id: "art-4", name: "Boubou Traditionnel (Grand Boubou)", category: "Traditionnel & Bazin", priceWashIron: 2500, priceIronOnly: 1500, icon: "user" },
    { id: "art-5", name: "Pagne Wax (Complet 3 morceaux)", category: "Traditionnel & Bazin", priceWashIron: 1800, priceIronOnly: 1000, icon: "palette" },
    { id: "art-6", name: "Koko Dunda complet", category: "Traditionnel & Bazin", priceWashIron: 2000, priceIronOnly: 1200, icon: "tag" },
    
    // Ville & Quotidien
    { id: "art-7", name: "Costume 2 pièces (Veste + Pantalon)", category: "Ville & Quotidien", priceWashIron: 2500, priceIronOnly: 1500, icon: "briefcase" },
    { id: "art-8", name: "Costume 3 pièces", category: "Ville & Quotidien", priceWashIron: 3500, priceIronOnly: 2000, icon: "award" },
    { id: "art-9", name: "Chemise Ville (Manches longues/courtes)", category: "Ville & Quotidien", priceWashIron: 800, priceIronOnly: 500, icon: "shirt" },
    { id: "art-10", name: "Pantalon tissu / Jeans", category: "Ville & Quotidien", priceWashIron: 1000, priceIronOnly: 600, icon: "scissors" },
    { id: "art-11", name: "Robe de soirée / Cérémonie", category: "Ville & Quotidien", priceWashIron: 2500, priceIronOnly: 1500, icon: "heart" },
    { id: "art-12", name: "Jupe / Chemisier", category: "Ville & Quotidien", priceWashIron: 800, priceIronOnly: 500, icon: "feather" },
    { id: "art-13", name: "Veste seule", category: "Ville & Quotidien", priceWashIron: 1500, priceIronOnly: 1000, icon: "shield" },
    { id: "art-14", name: "T-shirt / Polo", category: "Ville & Quotidien", priceWashIron: 600, priceIronOnly: 400, icon: "smile" },

    // Maison & Literie
    { id: "art-15", name: "Couette 2 places / Épaisse", category: "Maison & Literie", priceWashIron: 4000, priceIronOnly: 2500, icon: "box" },
    { id: "art-16", name: "Drap 2 places + 2 taies", category: "Maison & Literie", priceWashIron: 2000, priceIronOnly: 1200, icon: "layers" },
    { id: "art-17", name: "Rideaux la paire (Grands)", category: "Maison & Literie", priceWashIron: 3000, priceIronOnly: 2000, icon: "columns" },
    { id: "art-18", name: "Tapis Salon (Moyen)", category: "Maison & Literie", priceWashIron: 5000, priceIronOnly: 3500, icon: "grid" }
  ],
  clients: [
    { id: "c-1", name: "M. Ouedraogo Moussa", phone: "+226 70 23 45 67", district: "Ouaga 2000", totalSpent: 28500, visitsCount: 6, createdAt: "2026-09-10" },
    { id: "c-2", name: "Mme Sawadogo Fatim", phone: "+226 76 88 99 00", district: "Kalgondin", totalSpent: 18000, visitsCount: 4, createdAt: "2026-10-02" },
    { id: "c-3", name: "M. Traore Ibrahim", phone: "+226 65 12 34 56", district: "Gounghin", totalSpent: 12500, visitsCount: 3, createdAt: "2026-10-15" }
  ],
  orders: [
    {
      id: "TK-1001",
      clientId: "c-1",
      clientName: "M. Ouedraogo Moussa",
      clientPhone: "+226 70 23 45 67",
      clientDistrict: "Ouaga 2000",
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      pickupDate: new Date(Date.now() + 3600000 * 24).toISOString().split('T')[0] + " 17:00",
      isExpress: false,
      items: [
        { articleId: "art-1", name: "Bazin Riche Brodé (3 pièces)", service: "Complet (Lavage + Repassage)", quantity: 1, unitPrice: 3500, subtotal: 3500, notes: "Brodé fil d'or, amidonnage moyen" },
        { articleId: "art-9", name: "Chemise Ville", service: "Complet (Lavage + Repassage)", quantity: 2, unitPrice: 800, subtotal: 1600, notes: "Bouton col légèrement lâche (signalé)" }
      ],
      totalAmount: 5100,
      discount: 0,
      paidAmount: 3000,
      balanceDue: 2100,
      paymentMethod: "Orange Money",
      paymentStatus: "Acompte payé",
      status: "repassage", // 'recu', 'lavage', 'repassage', 'pret', 'livre'
      timeline: [
        { time: new Date(Date.now() - 3600000 * 24).toISOString(), event: "Dépôt enregistré à la caisse (Acompte 3 000 FCFA reçu par Orange Money)" },
        { time: new Date(Date.now() - 3600000 * 18).toISOString(), event: "Lavage & détachage terminé" },
        { time: new Date(Date.now() - 3600000 * 4).toISOString(), event: "En cours de repassage & amidonnage" }
      ]
    },
    {
      id: "TK-1002",
      clientId: "c-2",
      clientName: "Mme Sawadogo Fatim",
      clientPhone: "+226 76 88 99 00",
      clientDistrict: "Kalgondin",
      createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
      pickupDate: new Date().toISOString().split('T')[0] + " 15:00",
      isExpress: true,
      items: [
        { articleId: "art-3", name: "Faso Dan Fani complet", service: "Complet (Lavage + Repassage)", quantity: 1, unitPrice: 3000, subtotal: 3000, notes: "Couleurs naturelles, lavage doux" },
        { articleId: "art-11", name: "Robe de soirée / Cérémonie", service: "Complet (Lavage + Repassage)", quantity: 1, unitPrice: 2500, subtotal: 2500, notes: "Perles au dos" }
      ],
      totalAmount: 5500,
      discount: 0,
      paidAmount: 5500,
      balanceDue: 0,
      paymentMethod: "Moov Money",
      paymentStatus: "Soldé",
      status: "pret",
      timeline: [
        { time: new Date(Date.now() - 3600000 * 40).toISOString(), event: "Dépôt enregistré (Payé intégralement 5 500 FCFA Moov Money)" },
        { time: new Date(Date.now() - 3600000 * 12).toISOString(), event: "Repassé et vérifié" },
        { time: new Date(Date.now() - 3600000 * 2).toISOString(), event: "Emballé et prêt en rayon A-12" }
      ]
    },
    {
      id: "TK-1000",
      clientId: "c-3",
      clientName: "M. Traore Ibrahim",
      clientPhone: "+226 65 12 34 56",
      clientDistrict: "Gounghin",
      createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
      pickupDate: new Date(Date.now() - 3600000 * 24).toISOString().split('T')[0] + " 18:00",
      isExpress: false,
      items: [
        { articleId: "art-7", name: "Costume 2 pièces (Veste + Pantalon)", service: "Complet (Lavage + Repassage)", quantity: 1, unitPrice: 2500, subtotal: 2500, notes: "Nettoyage soigné" }
      ],
      totalAmount: 2500,
      discount: 0,
      paidAmount: 2500,
      balanceDue: 0,
      paymentMethod: "Espèces",
      paymentStatus: "Soldé",
      status: "livre",
      deliveredAt: new Date(Date.now() - 3600000 * 20).toISOString(),
      timeline: [
        { time: new Date(Date.now() - 3600000 * 72).toISOString(), event: "Dépôt enregistré à la caisse" },
        { time: new Date(Date.now() - 3600000 * 48).toISOString(), event: "Lavage terminé" },
        { time: new Date(Date.now() - 3600000 * 28).toISOString(), event: "Repassage terminé" },
        { time: new Date(Date.now() - 3600000 * 24).toISOString(), event: "Prêt au retrait" },
        { time: new Date(Date.now() - 3600000 * 20).toISOString(), event: "Linge restitué au client - Décharge effectuée" }
      ]
    }
  ],
  transactions: [
    { id: "tx-1", orderId: "TK-1001", clientName: "M. Ouedraogo Moussa", date: new Date(Date.now() - 3600000 * 24).toISOString(), type: "Acompte", amount: 3000, method: "Orange Money", note: "Dépôt Bazin + Chemises" },
    { id: "tx-2", orderId: "TK-1002", clientName: "Mme Sawadogo Fatim", date: new Date(Date.now() - 3600000 * 40).toISOString(), type: "Paiement complet", amount: 5500, method: "Moov Money", note: "Règlement complet à la dépose" },
    { id: "tx-3", orderId: "TK-1000", clientName: "M. Traore Ibrahim", date: new Date(Date.now() - 3600000 * 72).toISOString(), type: "Paiement complet", amount: 2500, method: "Espèces", note: "Costume 2 pièces" }
  ]
};

// Lecture DB
function readDB() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error("Erreur lecture DB, réinitialisation:", err);
    return initialData;
  }
}

// Écriture DB
function writeDB(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error("Erreur écriture DB:", err);
    return false;
  }
}

// Obtenir adresses IP locales
function getLocalIPs() {
  const nets = os.networkInterfaces();
  const results = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }
  return results;
}

// Serveur HTTP
const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Atelier-PIN');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;

  // API Endpoints
  if (pathname.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    // GET /api/data
    if (pathname === '/api/data' && req.method === 'GET') {
      const db = readDB();
      res.writeHead(200);
      res.end(JSON.stringify(db));
      return;
    }

    // GET /api/network-info
    if (pathname === '/api/network-info' && req.method === 'GET') {
      const ips = getLocalIPs();
      const db = readDB();
      const pin = db.settings?.atelierPin || "2260";
      res.writeHead(200);
      res.end(JSON.stringify({ port: PORT, ips, atelierPin: pin }));
      return;
    }

    // Body parsing pour POST / PUT
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      let payload = {};
      try {
        if (body) payload = JSON.parse(body);
      } catch (e) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "Format JSON invalide" }));
        return;
      }

      const db = readDB();

      // POST /api/verify-pin (Sécurité atelier / mobile)
      if (pathname === '/api/verify-pin' && req.method === 'POST') {
        const expectedPin = db.settings?.atelierPin || "2260";
        if (String(payload.pin).trim() === String(expectedPin).trim()) {
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, token: "AUTH_" + Buffer.from(expectedPin + "_TOKEN").toString('base64') }));
        } else {
          res.writeHead(401);
          res.end(JSON.stringify({ success: false, error: "Code PIN incorrect" }));
        }
        return;
      }

      // POST /api/backup/import (Restauration hors-ligne)
      if (pathname === '/api/backup/import' && req.method === 'POST') {
        if (payload.settings && payload.orders && payload.articles) {
          writeDB(payload);
          res.writeHead(200);
          res.end(JSON.stringify({ success: true, message: "Sauvegarde restaurée avec succès" }));
        } else {
          res.writeHead(400);
          res.end(JSON.stringify({ error: "Fichier de sauvegarde non valide" }));
        }
        return;
      }

      // POST /api/orders (Nouveau dépôt ou mise à jour)
      if (pathname === '/api/orders' && req.method === 'POST') {
        const order = payload;
        if (!order.id) {
          const nextNum = (db.orders.length > 0)
            ? Math.max(...db.orders.map(o => parseInt(o.id.replace(/\D/g, '') || '1000'))) + 1
            : 1001;
          order.id = `TK-${nextNum}`;
        }
        order.createdAt = order.createdAt || new Date().toISOString();
        if (!order.timeline) {
          order.timeline = [{ time: new Date().toISOString(), event: "Dépôt enregistré à la caisse" }];
        }

        // Mettre à jour ou ajouter le client dans la base
        let client = db.clients.find(c => c.phone.replace(/\D/g, '') === order.clientPhone.replace(/\D/g, ''));
        if (client) {
          client.name = order.clientName;
          client.district = order.clientDistrict || client.district;
          client.totalSpent = (client.totalSpent || 0) + (order.paidAmount || 0);
          client.visitsCount = (client.visitsCount || 0) + 1;
          order.clientId = client.id;
        } else {
          const newClientId = `c-${db.clients.length + 1}`;
          client = {
            id: newClientId,
            name: order.clientName,
            phone: order.clientPhone,
            district: order.clientDistrict || "",
            totalSpent: order.paidAmount || 0,
            visitsCount: 1,
            createdAt: new Date().toISOString()
          };
          db.clients.push(client);
          order.clientId = newClientId;
        }

        // Transaction initiale si acompte > 0
        if (order.paidAmount > 0) {
          const itemDesc = order.items ? order.items.map(i => `${i.quantity}x ${i.name}`).join(', ') : '';
          db.transactions.push({
            id: `tx-${Date.now()}`,
            orderId: order.id,
            clientName: order.clientName,
            date: new Date().toISOString(),
            type: order.balanceDue === 0 ? "Paiement complet" : "Acompte",
            amount: order.paidAmount,
            method: order.paymentMethod || "Espèces",
            note: itemDesc
          });
        }

        // Insérer ou mettre à jour
        const existingIdx = db.orders.findIndex(o => o.id === order.id);
        if (existingIdx >= 0) {
          db.orders[existingIdx] = order;
        } else {
          db.orders.unshift(order);
        }

        writeDB(db);
        res.writeHead(201);
        res.end(JSON.stringify({ success: true, order }));
        return;
      }

      // PUT /api/orders/:id/status (Changer statut)
      if (pathname.match(/^\/api\/orders\/[^\/]+\/status$/) && req.method === 'PUT') {
        const orderId = pathname.split('/')[3];
        const { status, note } = payload;
        const order = db.orders.find(o => o.id === orderId);

        if (!order) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Commande non trouvée" }));
          return;
        }

        order.status = status;
        if (status === 'livre') {
          order.deliveredAt = new Date().toISOString();
        }
        if (!order.timeline) order.timeline = [];

        const statusLabels = {
          recu: "1. Reçu / En attente",
          lavage: "2. Au lavage & détachage",
          repassage: "3. Au repassage & amidonnage",
          pret: "4. Prêt au retrait (Emballé)",
          livre: "5. Livré au client (Déchargé)"
        };

        order.timeline.push({
          time: new Date().toISOString(),
          event: `Statut changé : ${statusLabels[status] || status}${note ? ' (' + note + ')' : ''}`
        });

        writeDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, order }));
        return;
      }

      // POST /api/orders/:id/payment (Encaisser le solde restant)
      if (pathname.match(/^\/api\/orders\/[^\/]+\/payment$/) && req.method === 'POST') {
        const orderId = pathname.split('/')[3];
        const { amount, method } = payload;
        const order = db.orders.find(o => o.id === orderId);

        if (!order) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: "Commande non trouvée" }));
          return;
        }

        const payVal = Number(amount) || 0;
        order.paidAmount = (order.paidAmount || 0) + payVal;
        order.balanceDue = Math.max(0, (order.totalAmount || 0) - order.paidAmount);
        order.paymentStatus = order.balanceDue === 0 ? "Soldé" : "Partiellement payé";

        db.transactions.push({
          id: `tx-${Date.now()}`,
          orderId: order.id,
          clientName: order.clientName,
          date: new Date().toISOString(),
          type: "Solde au retrait",
          amount: payVal,
          method: method || "Espèces",
          note: `Règlement final du ticket #${order.id}`
        });

        // Mettre à jour stats client
        const client = db.clients.find(c => c.id === order.clientId);
        if (client) {
          client.totalSpent = (client.totalSpent || 0) + payVal;
        }

        if (!order.timeline) order.timeline = [];
        order.timeline.push({
          time: new Date().toISOString(),
          event: `Règlement du solde de ${payVal.toLocaleString('fr-FR')} FCFA (${method || 'Espèces'})`
        });

        writeDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, order }));
        return;
      }

      // POST /api/articles (Ajout/modification article)
      if (pathname === '/api/articles' && req.method === 'POST') {
        const article = payload;
        if (!article.id) article.id = `art-${Date.now()}`;
        const existingIdx = db.articles.findIndex(a => a.id === article.id);
        if (existingIdx >= 0) {
          db.articles[existingIdx] = article;
        } else {
          db.articles.push(article);
        }
        writeDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, articles: db.articles }));
        return;
      }

      // POST /api/settings (Mise à jour paramètres)
      if (pathname === '/api/settings' && req.method === 'POST') {
        db.settings = { ...db.settings, ...payload };
        writeDB(db);
        res.writeHead(200);
        res.end(JSON.stringify({ success: true, settings: db.settings }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: "Route API introuvable" }));
    });
    return;
  }

  // Fichiers statiques
  let filePath = path.join(__dirname, 'public', pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(path.join(__dirname, 'public'))) {
    res.writeHead(403);
    res.end('Accès interdit');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), (err2, fallbackContent) => {
          if (err2) {
            res.writeHead(404);
            res.end("Page non trouvée");
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(fallbackContent);
          }
        });
      } else {
        res.writeHead(500);
        res.end(`Erreur serveur: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
      res.end(content);
    }
  });
});

if (!process.env.VERCEL) {
  server.listen(PORT, '0.0.0.0', () => {
  const ips = getLocalIPs();
  console.log(`\n======================================================`);
  console.log(`  🇧🇫 FASOPRESSING PRO - DÉMARRÉ AVEC SUCCÈS !`);
  console.log(`======================================================`);
  console.log(`- Accès Local (Caisse / PC) : http://localhost:${PORT}`);
  if (ips.length > 0) {
    console.log(`- Accès Réseau (Atelier / Téléphones / Tablettes) :`);
    ips.forEach(ip => console.log(`   👉 http://${ip}:${PORT}`));
  }
  console.log(`======================================================\n`);
  });
}

module.exports = server;

