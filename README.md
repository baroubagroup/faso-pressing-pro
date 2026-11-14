# 🇧🇫 FasoPressing Pro (Version 2.0 - Sécurisée & Offline-First)

**Application de gestion digitale spécialement conçue pour les pressings et blanchisseries au Burkina Faso.**

---

## 🌟 Nouveautés & Fonctionnalités Majeures

### 1. 🔒 Sécurité & Connexion Atelier par Code PIN
- L'accès depuis les smartphones ou tablettes de l'atelier sur le Wi-Fi local est désormais **sécurisé par un code PIN** (par défaut : **`2260`**, modifiable dans les paramètres).
- Verrouillage automatique de la session pour empêcher toute manipulation non autorisée.

### 2. 📴 Conception 100% Hors-Ligne (First Offline) & Sauvegardes
- Fonctionne intégralement **sans aucune connexion internet**.
- Stockage local instantané et sécurisé.
- Bouton **"Télécharger Sauvegarde (.json)"** pour enregistrer une copie de sécurité sur clé USB, disque externe ou WhatsApp.
- Bouton **"Restaurer Sauvegarde"** pour recharger toutes les données sur n'importe quel ordinateur ou smartphone en 1 clic.

### 3. 📸 Export des Tickets en Image PNG & Impression / PDF
- **Téléchargement du Ticket en Image PNG** : Idéal pour l'envoyer au client sur WhatsApp ou l'archiver dans les images du téléphone.
- **Impression thermique (58mm / 80mm)** : Ticket physique optimisé avec mentions des constats de défauts (*boutons manquants, taches antérieures*) pour prévenir les litiges.
- **Recherche instantanée au retrait** : Dès que le client se présente, tapez son nom, son numéro de téléphone ou son numéro de ticket dans la barre de recherche rapide pour retrouver immédiatement ses habits.

### 4. 🧺 Suivi d'Atelier en 5 Étapes (avec Décharge de Responsabilité)
Le cycle complet de vie du vêtement est désormais tracé :
1. **Reçu / En attente**
2. **Lavage & Détachage**
3. **Repassage & Amidonnage**
4. **Prêt au Retrait (Emballé)** &rarr; avec alerte WhatsApp 1-clic au client
5. **Livré & Déchargé (Clôturé)** &rarr; enregistre la remise en main propre, le règlement du solde éventuel et la décharge de responsabilité.

### 5. 📅 Planning & Calendrier des Retraits / Livraisons
- Calendrier interactif avec vue mensuelle.
- **Bulles de comptage au jour le jour** (ex: *3 retraits prévus aujourd'hui*, *5 demain*).
- Cliquer sur n'importe quel jour affiche instantanément la liste détaillée des clients attendus, leurs numéros de téléphone et les vêtements à leur restituer.

### 6. 💰 Caisse & Finances avec Filtres Temporels Avancés
- Filtres rapides : **Aujourd'hui**, **Hier**, **Cette Semaine**, **Ce Mois**, ou **Plage de dates personnalisée (Du ... Au ...)**.
- Recalcul en direct des recettes globales, des espèces, des paiements Mobile Money (*Orange Money, Moov Money, Wave*) et des créances.
- **Fiche Détail de Transaction** : Cliquez sur n'importe quel mouvement de caisse pour afficher tous les détails (client, ticket lié, vêtements payés, date et heure exacte).

### 7. 👤 Fiche Client Complète & Fidélité
- Cliquez sur n'importe quel client pour ouvrir sa **Fiche Dédiée** :
  - Coordonnées (Nom, Téléphone WhatsApp, Quartier).
  - Badge de fidélité (Nouveau, Client Fidèle, Client VIP Gold).
  - **Historique chronologique de toutes ses visites avec dates précises**.
  - Liste de tous ses tickets et créances actives.
  - Bouton direct **"Nouveau dépôt pour ce client"** et **"WhatsApp Direct"**.

---

## 🚀 Démarrage

### Lancer le serveur (PC de caisse)
```powershell
cd "C:\Users\DELL\.gemini\antigravity\scratch\faso-pressing"
node server.js
```

- **Accès sur le PC** : **`http://localhost:4000`**
- **Accès sur les téléphones de l'atelier (Wi-Fi)** : **`http://192.168.11.110:4000`** (avec le code PIN **`2260`**).
