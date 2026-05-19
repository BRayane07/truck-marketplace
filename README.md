# 🚛 HONDATI — Marketplace Transport & Déménagement

Application web MVP pour mettre en relation camionneurs et clients au Maroc.

---

## 🗂️ Structure du projet

```
hondati/
├── src/
│   ├── components/
│   │   ├── ui/           → Composants réutilisables (Button, Input, Badge...)
│   │   ├── layout/       → Navbar, Footer
│   │   ├── trucks/       → TruckCard
│   │   └── reviews/      → ReviewCard, ReviewForm
│   ├── pages/
│   │   ├── Home.jsx      → Page d'accueil
│   │   ├── Trucks.jsx    → Liste des camionneurs
│   │   ├── Auth.jsx      → Login + Inscription
│   │   ├── Book.jsx      → Formulaire de réservation
│   │   ├── Dashboard.jsx → Tableau de bord (client + prestataire)
│   │   └── AddTruck.jsx  → Ajouter un camion (prestataire)
│   ├── context/
│   │   ├── AuthContext.jsx     → Gestion de session utilisateur
│   │   └── LanguageContext.jsx → FR/AR traductions
│   ├── hooks/
│   │   └── index.js      → useTrucks, useBookings
│   ├── i18n/
│   │   └── translations.js → Textes FR + AR
│   ├── lib/
│   │   ├── supabase.js   → Connexion Supabase
│   │   └── schema.sql    → Structure de la base de données
│   ├── App.jsx           → Routes principales
│   └── main.jsx          → Point d'entrée
├── .env.example          → Variables d'environnement (modèle)
├── vercel.json           → Config déploiement Vercel
└── tailwind.config.js    → Couleurs HONDATI
```

---

## 🚀 Installation et démarrage

### 1. Cloner et installer les dépendances
```bash
git clone <your-repo-url>
cd hondati
npm install
```

### 2. Configurer Supabase
1. Créez un compte gratuit sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Allez dans **SQL Editor** → collez le contenu de `src/lib/schema.sql` → exécutez
4. Allez dans **Settings → API** → copiez l'URL et la clé anon

### 3. Configurer les variables d'environnement
```bash
cp .env.example .env
# Éditez .env et remplissez vos clés Supabase
```

### 4. Storage (photos de camions)
Dans **SQL Editor**, exécutez aussi `src/lib/storage-policies.sql` (bucket + politiques RLS).

### 5. Lancer en développement
```bash
npm install
npm run dev
# → http://localhost:5173
```

### Tests
```bash
npm run test:run
```

---

## 🌐 Déploiement sur Vercel

1. Créez un compte sur [vercel.com](https://vercel.com)
2. Connectez votre repo GitHub
3. Dans les paramètres du projet Vercel, ajoutez les variables d'environnement :
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Déployez → votre app est en ligne !

---

## ✨ Fonctionnalités MVP

| Fonctionnalité | Status |
|---|---|
| Inscription / Connexion (email + mot de passe) | ✅ |
| Profils clients et prestataires | ✅ |
| Liste des camionneurs avec filtres | ✅ |
| Formulaire de demande de déménagement | ✅ |
| Système de réservation (accepter/refuser) | ✅ |
| Bouton WhatsApp pour contact direct | ✅ |
| Avis et notes clients | ✅ |
| Interface mobile responsive | ✅ |
| Support Français + Arabe (RTL) | ✅ |
| Tableau de bord client + prestataire | ✅ |
| Ajout de camion par le prestataire | ✅ |
| Paiement espèces + wallet (statut, sans passerelle) | ✅ |
| Upload photos camions (Storage) | ✅ |
| Toasts + Error boundary | ✅ |

---

## 🎨 Charte graphique HONDATI

| Couleur | Hex | Usage |
|---|---|---|
| Orange primaire | `#E85D04` | Boutons CTA, accents |
| Charcoal | `#1C1C1E` | Fond sombre, titres |
| Blanc | `#FFFFFF` | Fond principal |
| Gris muted | `#8A8A8E` | Textes secondaires |

---

## 📱 Pages de l'application

| URL | Page |
|---|---|
| `/` | Accueil |
| `/trucks` | Liste des camionneurs |
| `/book/:id` | Formulaire de réservation |
| `/login` | Connexion |
| `/signup` | Inscription |
| `/dashboard` | Tableau de bord |
| `/trucks/new` | Ajouter un camion |

---

## 🔐 Sécurité

- Row Level Security (RLS) Supabase activé sur toutes les tables
- Chaque utilisateur ne voit que ses propres données
- Variables d'environnement pour les clés API (jamais dans le code)

---

## 🛣️ Prochaines étapes (V2)

- [ ] Paiement en ligne via CMI (Maroc)
- [ ] Upload de photos de camions (Supabase Storage)
- [ ] Notifications push
- [ ] Géolocalisation et carte
- [ ] Vérification des documents (CIN, permis, carte grise)
- [ ] App mobile React Native (Expo)
- [ ] Panel admin

---

Built with ❤️ for Morocco 🇲🇦
