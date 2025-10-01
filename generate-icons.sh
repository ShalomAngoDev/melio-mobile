#!/bin/bash

echo "🎨 Génération des icônes d'application iOS..."

# Vérifier si ImageMagick est installé
if ! command -v convert &> /dev/null; then
    echo "❌ ImageMagick n'est pas installé. Installation..."
    if command -v brew &> /dev/null; then
        brew install imagemagick
    else
        echo "❌ Homebrew n'est pas installé. Veuillez installer ImageMagick manuellement."
        exit 1
    fi
fi

# Créer le dossier des icônes
ICON_DIR="ios/App/App/Assets.xcassets/AppIcon.appiconset"
mkdir -p "$ICON_DIR"

# Utiliser le logo existant logo-icon.png
SOURCE_ICON="public/logo-icon.png"

if [ ! -f "$SOURCE_ICON" ]; then
    echo "❌ Logo source non trouvé : $SOURCE_ICON"
    exit 1
fi

echo "📱 Utilisation du logo existant : $SOURCE_ICON"

# Créer l'icône de base 1024x1024 à partir du logo (carrée avec fond)
echo "🔄 Redimensionnement du logo vers 1024x1024 (carré avec fond)..."
magick "$SOURCE_ICON" -resize 1024x1024 -background transparent -gravity center -extent 1024x1024 "$ICON_DIR/AppIcon-1024.png"

# Générer toutes les tailles d'icônes
echo "🔄 Génération des différentes tailles..."

# iPhone
magick "$ICON_DIR/AppIcon-1024.png" -resize 40x40 -background transparent -gravity center -extent 40x40 "$ICON_DIR/AppIcon-20@2x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 60x60 -background transparent -gravity center -extent 60x60 "$ICON_DIR/AppIcon-20@3x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 58x58 -background transparent -gravity center -extent 58x58 "$ICON_DIR/AppIcon-29@2x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 87x87 -background transparent -gravity center -extent 87x87 "$ICON_DIR/AppIcon-29@3x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 80x80 -background transparent -gravity center -extent 80x80 "$ICON_DIR/AppIcon-40@2x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 120x120 -background transparent -gravity center -extent 120x120 "$ICON_DIR/AppIcon-40@3x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 120x120 -background transparent -gravity center -extent 120x120 "$ICON_DIR/AppIcon-60@2x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 180x180 -background transparent -gravity center -extent 180x180 "$ICON_DIR/AppIcon-60@3x.png"

# iPad
magick "$ICON_DIR/AppIcon-1024.png" -resize 20x20 -background transparent -gravity center -extent 20x20 "$ICON_DIR/AppIcon-20.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 29x29 -background transparent -gravity center -extent 29x29 "$ICON_DIR/AppIcon-29.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 40x40 -background transparent -gravity center -extent 40x40 "$ICON_DIR/AppIcon-40.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 76x76 -background transparent -gravity center -extent 76x76 "$ICON_DIR/AppIcon-76.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 152x152 -background transparent -gravity center -extent 152x152 "$ICON_DIR/AppIcon-76@2x.png"
magick "$ICON_DIR/AppIcon-1024.png" -resize 167x167 -background transparent -gravity center -extent 167x167 "$ICON_DIR/AppIcon-83.5@2x.png"

# App Store
cp "$ICON_DIR/AppIcon-1024.png" "$ICON_DIR/AppIcon-1024.png"

echo "✅ Icônes générées avec succès !"
echo "📱 Icônes créées :"
echo "   - iPhone : 20@2x, 20@3x, 29@2x, 29@3x, 40@2x, 40@3x, 60@2x, 60@3x"
echo "   - iPad : 20, 20@2x, 29, 29@2x, 40, 40@2x, 76, 76@2x, 83.5@2x"
echo "   - App Store : 1024x1024"

echo ""
echo "🔧 Prochaines étapes :"
echo "1. Ouvrir Xcode : npx cap open ios"
echo "2. Sélectionner le projet App"
echo "3. Aller dans l'onglet General"
echo "4. Vérifier que les icônes sont correctement chargées"
echo "5. Lancer l'application"
