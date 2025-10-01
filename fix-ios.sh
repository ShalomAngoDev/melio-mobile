#!/bin/bash

echo "🔧 Correction des erreurs Auto Layout iOS..."

# Nettoyer le projet
echo "1. 🧹 Nettoyage du projet..."
rm -rf node_modules
rm -rf ios
rm -rf dist

# Réinstaller les dépendances
echo "2. 📦 Réinstallation des dépendances..."
npm install

# Construire l'application
echo "3. 🏗️ Construction de l'application..."
npm run build

# Ajouter iOS
echo "4. 📱 Ajout de la plateforme iOS..."
npx cap add ios

# Synchroniser
echo "5. 🔄 Synchronisation..."
npx cap sync ios

# Ouvrir dans Xcode
echo "6. 🚀 Ouverture dans Xcode..."
npx cap open ios

echo "✅ Correction terminée !"
echo "📱 L'application iOS est maintenant ouverte dans Xcode."
echo "🔧 Vérifiez les contraintes Auto Layout dans Interface Builder."





