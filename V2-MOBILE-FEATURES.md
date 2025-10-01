# 📱 Melio Mobile V2 - Nouvelles Fonctionnalités

**Branche** : `v2-development`  
**Status** : En développement local  
**Date** : 1er octobre 2025

---

## 🎨 Fonctionnalités à implémenter

### 1. ✅ Image de couverture pour chaque entrée
**Description** : Permettre à l'élève de choisir une image de couverture parmi une liste prédéfinie pour personnaliser son entrée de journal.

**Implémentation** :
- [ ] Créer dossier `public/covers/` avec 15-20 images de couverture
- [ ] Composant de sélection d'image (grille d'images)
- [ ] Stocker l'image choisie avec l'entrée
- [ ] Afficher l'image en fond du card (avec overlay)
- [ ] Backend : Ajouter champ `coverImage` à la table `journal_entries`

**Images de couverture** :
- Nature (ciel, océan, forêt, fleurs)
- Abstrait (couleurs, dégradés, patterns)
- Saisons (printemps, été, automne, hiver)
- Émotions (calme, joie, force, espoir)

---

### 2. 🎨 Choix de couleur du card
**Description** : L'élève peut choisir une couleur/thème pour sa feuille du jour.

**Implémentation** :
- [ ] Palette de 8-10 couleurs prédéfinies
- [ ] Sélecteur de couleur dans le formulaire
- [ ] Appliquer la couleur au card (bordure + accents)
- [ ] Backend : Ajouter champ `color` à la table `journal_entries`

**Palette de couleurs** :
- Rose (par défaut)
- Violet
- Bleu
- Vert
- Jaune
- Orange
- Rouge doux
- Gris

---

### 3. 🏷️ Tags et catégories
**Description** : Ajouter des tags pour catégoriser les entrées et faciliter la recherche.

**Implémentation** :
- [ ] Backend : Table `tags` + table de liaison `entry_tags`
- [ ] Backend : Endpoints CRUD pour tags
- [ ] Liste de tags prédéfinis (école, amis, famille, sport, etc.)
- [ ] Sélection multi-tags lors de l'écriture
- [ ] Filtrage par tags dans la liste
- [ ] Badges de tags colorés sur les cards

**Tags prédéfinis** :
- 🏫 École
- 👥 Amis
- 👨‍👩‍👧 Famille
- ⚽ Sport
- 🎨 Créativité
- 📚 Devoirs
- 💭 Pensées
- ❤️ Émotions
- 🎉 Événement
- 😟 Difficulté

---

### 4. 📷 Ajout de photos
**Description** : Permettre l'ajout de photos au journal comme preuves ou souvenirs.

**Implémentation** :
- [ ] Backend : Upload d'images vers MinIO/S3
- [ ] Backend : Compression automatique (max 2MB)
- [ ] Backend : Relation `journal_entry_photos`
- [ ] Mobile : Capacitor Camera plugin
- [ ] Mobile : Sélection depuis galerie ou caméra
- [ ] Mobile : Aperçu et suppression avant envoi
- [ ] Mobile : Galerie des photos dans le card
- [ ] Mobile : Modal pour voir photo en grand

**Sécurité** :
- Validation format (JPEG, PNG uniquement)
- Limite 3 photos par entrée
- Photos cryptées côté serveur
- Suppression automatique après X mois (RGPD)

---

### 5. 📅 Vue calendrier
**Description** : Calendrier mensuel affichant les jours avec entrées.

**Implémentation** :
- [ ] Composant calendrier (react-calendar ou custom)
- [ ] Indicateurs visuels (points colorés selon humeur)
- [ ] Clic sur un jour → affiche l'entrée
- [ ] Navigation mois par mois
- [ ] Heatmap des émotions

**Design** :
- Jours avec entrée : cercle coloré selon humeur
- Jour actuel : bordure épaisse
- Navigation fluide
- Vue mois/semaine

---

### 6. 🔍 Recherche
**Description** : Rechercher dans toutes les entrées de journal.

**Implémentation** :
- [ ] Backend : Indexation full-text PostgreSQL
- [ ] Backend : Endpoint de recherche avec filtres
- [ ] Mobile : Barre de recherche
- [ ] Mobile : Filtres (date, humeur, tags)
- [ ] Mobile : Surlignage des résultats
- [ ] Mobile : Tri par pertinence/date

**Filtres** :
- Par période (dernière semaine, mois, année)
- Par humeur
- Par tags
- Texte libre

---

### 7. 🏆 Gamification

#### 7.1 Système de badges
**Description** : Récompenser l'engagement avec des badges.

**Implémentation** :
- [ ] Backend : Table `achievements` et `student_achievements`
- [ ] Backend : Calcul automatique des badges
- [ ] Backend : Endpoint pour récupérer les badges
- [ ] Mobile : Page "Mes badges"
- [ ] Mobile : Animation lors de l'obtention
- [ ] Mobile : Partage de badge (optionnel)

**Badges à créer** :
- 🌱 **Premier pas** : Première entrée
- 🔥 **Semaine parfaite** : 7 jours consécutifs
- 📖 **Écrivain** : 30 entrées totales
- 🎯 **Régulier** : 30 jours consécutifs
- 🌟 **Champion** : 100 entrées totales
- 🦋 **Transformation** : Amélioration humeur sur 2 semaines
- 💪 **Courageux** : Signalement effectué
- ❤️ **Ouvert** : Conversation avec Mélio
- 🌈 **Diversité** : Toutes les humeurs exprimées
- 🎨 **Créatif** : 10 photos ajoutées

#### 7.2 Compteur de streak
**Description** : Afficher les jours consécutifs d'écriture.

**Implémentation** :
- [ ] Backend : Calcul du streak actuel
- [ ] Backend : Record personnel de streak
- [ ] Mobile : Widget streak en haut de page
- [ ] Mobile : Animation flamme 🔥
- [ ] Mobile : Notification si risque de casser le streak
- [ ] Mobile : Graphique d'historique

**Design du widget** :
```
🔥 Série actuelle : 12 jours
⭐ Record : 25 jours
```

#### 7.3 Messages d'encouragement
**Description** : Messages positifs après chaque action.

**Implémentation** :
- [ ] Backend : Base de messages contextuels
- [ ] Messages variés selon action
- [ ] Animation confettis pour jalons
- [ ] Ton bienveillant et encourageant

**Exemples de messages** :
- "Bravo ! Continue comme ça 🌟"
- "Tu es sur une belle lancée ! 🔥"
- "Merci de partager tes émotions ❤️"
- "Tu as franchi une étape importante ! 🎉"

---

## 🗄️ Modifications Base de Données

### Nouvelle structure `journal_entries`
```sql
ALTER TABLE journal_entries ADD COLUMN cover_image TEXT;
ALTER TABLE journal_entries ADD COLUMN color TEXT DEFAULT 'pink';
```

### Nouvelle table `tags`
```sql
CREATE TABLE tags (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  icon TEXT,
  color TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table de liaison `entry_tags`
```sql
CREATE TABLE entry_tags (
  entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  tag_id TEXT REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (entry_id, tag_id)
);
```

### Nouvelle table `entry_photos`
```sql
CREATE TABLE entry_photos (
  id TEXT PRIMARY KEY,
  entry_id TEXT REFERENCES journal_entries(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  photo_key TEXT NOT NULL,
  uploaded_at TIMESTAMP DEFAULT NOW()
);
```

### Nouvelle table `achievements`
```sql
CREATE TABLE achievements (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  threshold INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table de liaison `student_achievements`
```sql
CREATE TABLE student_achievements (
  id TEXT PRIMARY KEY,
  student_id TEXT REFERENCES students(id) ON DELETE CASCADE,
  achievement_id TEXT REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(student_id, achievement_id)
);
```

### Ajout de champs streak
```sql
ALTER TABLE students ADD COLUMN current_streak INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN best_streak INTEGER DEFAULT 0;
ALTER TABLE students ADD COLUMN last_entry_date DATE;
```

---

## 📦 Dépendances à installer

### Mobile
```bash
cd mobile

# Caméra et photos
npm install @capacitor/camera

# Calendrier
npm install react-calendar

# Confettis
npm install react-confetti

# Icônes supplémentaires
npm install lucide-react
```

### Backend
```bash
cd backend

# Upload de fichiers
npm install multer @types/multer

# Traitement d'images
npm install sharp
```

---

## 🎯 Ordre d'implémentation recommandé

1. **Couleurs des cards** (1h) - Plus simple, effet immédiat
2. **Images de couverture** (2h) - Préparer les assets + intégration
3. **Tags/catégories** (4h) - Backend + Frontend
4. **Gamification** (6h) - Badges + Streaks + Encouragements
5. **Photos** (6h) - Upload + Affichage + Sécurité
6. **Calendrier** (4h) - Vue + Navigation
7. **Recherche** (4h) - Backend + Frontend + Filtres

**Total estimé** : ~27h de développement

---

## ✅ Checklist avant merge en production

- [ ] Tous les tests unitaires passent
- [ ] Tests E2E sur iOS
- [ ] Tests E2E sur Android
- [ ] Performance validée (photos compressées)
- [ ] Sécurité validée (uploads sécurisés)
- [ ] UX testée avec utilisateurs
- [ ] Documentation mise à jour
- [ ] Migration de base de données préparée
- [ ] Rollback plan en place

---

**Dernière mise à jour** : 1er octobre 2025

