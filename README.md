# 📱 Melio Mobile - Application Élèves

Application mobile sécurisée pour les élèves permettant de tenir un journal intime, dialoguer avec un chatbot empathique et effectuer des signalements.

## 🎯 Fonctionnalités

### ✍️ Journal Intime
- Interface intuitive et sécurisée pour exprimer ses émotions
- Sélection de l'humeur du jour
- Analyse IA en temps réel pour détecter les situations à risque
- Messages empathiques automatiques en fonction du niveau de risque

### 💬 Chatbot Empathique
- Accompagnement bienveillant et personnalisé
- Conseils adaptés à la situation de l'élève
- Ressources pédagogiques partagées selon les besoins

### 🚨 Signalements
- Système de signalement simple et rapide
- Option de signalement anonyme
- Niveaux d'urgence (Faible, Moyen, Élevé, Critique)
- Suivi du statut des signalements

### 👥 Interface Agents (Vue limitée)
- Consultation des alertes
- Gestion des signalements
- Statistiques de l'établissement

## 🛠️ Stack Technique

- **Frontend** : React 18 + TypeScript
- **Build** : Vite
- **Mobile** : Capacitor 7 (iOS + Android)
- **Styling** : Tailwind CSS
- **HTTP** : Axios
- **State Management** : React Context API
- **Icons** : Lucide React

## 📋 Prérequis

### Pour le développement

- **Node.js** (v18+)
- **npm** ou **yarn**
- **Xcode** (pour iOS) - macOS uniquement
- **Android Studio** (pour Android)
- **Backend Melio** en cours d'exécution

### Pour le build

- **iOS** : Xcode 15+, macOS 13+
- **Android** : Android Studio, JDK 17+

## 🚀 Installation

### 1. Cloner le repository

```bash
git clone https://github.com/ShalomAngoDev/melio-mobile.git
cd melio-mobile
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configuration

Créer un fichier `.env` à la racine :

```env
# URL de l'API Backend
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Pour la production
# VITE_API_BASE_URL=https://votre-backend.railway.app/api/v1
```

## 💻 Développement

### Mode Web (Développement rapide)

```bash
npm run dev
```

Accès : http://localhost:5173

### Mode iOS

```bash
# 1. Build du projet
npm run build

# 2. Synchroniser avec Capacitor
npx cap sync ios

# 3. Ouvrir dans Xcode
npx cap open ios
```

Puis lancer depuis Xcode (⌘ + R)

### Mode Android

```bash
# 1. Build du projet
npm run build

# 2. Synchroniser avec Capacitor
npx cap sync android

# 3. Ouvrir dans Android Studio
npx cap open android
```

Puis lancer depuis Android Studio

## 📱 Structure du Projet

```
mobile/
├── src/
│   ├── components/
│   │   ├── auth/          # Écran de connexion
│   │   ├── student/       # Composants élèves
│   │   │   ├── DiarySection.tsx
│   │   │   ├── ChatbotSection.tsx
│   │   │   └── ReportSection.tsx
│   │   ├── staff/         # Composants agents
│   │   └── common/        # Composants réutilisables
│   ├── contexts/          # Context API (Auth, Diary, Chat, etc.)
│   ├── services/          # Services API
│   ├── config/            # Configuration
│   └── styles/            # Styles globaux
├── ios/                   # Projet iOS natif
├── android/               # Projet Android natif
├── public/                # Assets publics
└── capacitor.config.ts    # Configuration Capacitor
```

## 🔐 Authentification

### Connexion Élève

Les élèves se connectent avec :
- **Code établissement** : fourni par l'école
- **Identifiant unique** : 6 caractères générés automatiquement

### Connexion Agent

Les agents se connectent avec :
- **Code établissement**
- **Email**
- **Mot de passe**

## 📊 API Backend

L'application mobile communique avec le backend Melio via l'API REST :

- Base URL : configurée dans `.env`
- Authentification : JWT tokens
- Format : JSON

### Endpoints principaux

```
POST   /api/v1/auth/student/login     # Connexion élève
POST   /api/v1/journal                 # Créer une entrée de journal
GET    /api/v1/journal                 # Récupérer les entrées
POST   /api/v1/reports                 # Créer un signalement
GET    /api/v1/chat/:studentId         # Récupérer l'historique chat
POST   /api/v1/chat/:studentId         # Envoyer un message
```

## 🎨 Design & UX

- **Interface** : Conçue pour les élèves (primaire à lycée)
- **Couleurs** : Palette douce et apaisante
- **Typographie** : Grande taille, facile à lire
- **Navigation** : Intuitive avec bottom tabs
- **Feedback** : Animations et messages clairs

## 🔒 Sécurité & RGPD

- ✅ Authentification sécurisée (JWT)
- ✅ Chiffrement des communications (HTTPS)
- ✅ Stockage local sécurisé (Capacitor SecureStorage)
- ✅ Pas de tracking ni d'analytics tiers
- ✅ Données hébergées en Europe
- ✅ Conformité RGPD

## 🧪 Tests

### Tests de connexion

```bash
node test-connection.js
```

### Tests de synchronisation journal

```bash
node test-diary-sync.js
```

### Tests de contenu à haut risque

```bash
node test-high-risk-content.js
```

### Tests de textes longs

```bash
node test-long-text.js
```

## 📦 Build Production

### iOS (App Store)

```bash
# 1. Build
npm run build

# 2. Sync
npx cap sync ios

# 3. Ouvrir Xcode
npx cap open ios

# 4. Dans Xcode :
# - Sélectionner "Any iOS Device"
# - Product > Archive
# - Upload vers App Store Connect
```

### Android (Play Store)

```bash
# 1. Build
npm run build

# 2. Sync
npx cap sync android

# 3. Ouvrir Android Studio
npx cap open android

# 4. Dans Android Studio :
# - Build > Generate Signed Bundle/APK
# - Sélectionner "Android App Bundle"
# - Upload vers Google Play Console
```

## 🌐 Configuration Capacitor

Fichier `capacitor.config.ts` :

```typescript
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.melio.app',
  appName: 'Melio',
  webDir: 'dist',
  server: {
    // Pour le développement local
    // url: 'http://192.168.1.X:5173',
    // cleartext: true
  }
};

export default config;
```

## 🚨 Dépannage

### Le backend n'est pas accessible

1. Vérifier que le backend est lancé
2. Vérifier l'URL dans `.env`
3. Vérifier les CORS du backend

### Erreur de build iOS

```bash
# Nettoyer le cache
cd ios/App
pod deintegrate
pod install
```

### Erreur de build Android

```bash
# Nettoyer le build
cd android
./gradlew clean
```

### Live reload ne fonctionne pas

```bash
# Vérifier la configuration dans capacitor.config.ts
# S'assurer que l'URL server.url pointe vers votre IP locale
```

## 📝 Scripts disponibles

```bash
npm run dev          # Développement web
npm run build        # Build production
npm run preview      # Preview du build
npm run lint         # Linter
npm run cap:sync     # Synchroniser Capacitor
npm run cap:copy     # Copier les assets
npm run android      # Build + Ouvrir Android Studio
npm run ios          # Build + Ouvrir Xcode
```

## 🔗 Liens utiles

- **Backend** : [melio-backend](https://github.com/ShalomAngoDev/melio-backend)
- **Web (Agents)** : [melio-web](https://github.com/ShalomAngoDev/melio-web)
- **Documentation Capacitor** : https://capacitorjs.com/docs
- **Documentation React** : https://react.dev

## 👥 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/amelioration`)
3. Commit les changements (`git commit -m 'Ajout fonctionnalité'`)
4. Push vers la branche (`git push origin feature/amelioration`)
5. Ouvrir une Pull Request

## 📄 Licence

Propriétaire - Melio © 2025

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@melio.app
- 🐛 Issues : https://github.com/ShalomAngoDev/melio-mobile/issues

---

**Fait avec ❤️ pour la protection des élèves**
