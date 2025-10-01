const fs = require('fs');
const path = require('path');

// Configuration des images de couverture
const covers = [
  // Nature
  { id: 'sunset', name: 'Coucher de soleil', gradient: 'linear-gradient(45deg, #ff6b6b, #ffa500, #ffd700)', category: 'Nature' },
  { id: 'ocean', name: 'Océan paisible', gradient: 'linear-gradient(45deg, #74b9ff, #0984e3, #00b894)', category: 'Nature' },
  { id: 'forest', name: 'Forêt mystérieuse', gradient: 'linear-gradient(45deg, #00b894, #00a085, #2d3436)', category: 'Nature' },
  { id: 'mountain', name: 'Montagnes majestueuses', gradient: 'linear-gradient(45deg, #636e72, #74b9ff, #a29bfe)', category: 'Nature' },
  { id: 'flower', name: 'Fleur délicate', gradient: 'linear-gradient(45deg, #fd79a8, #fdcb6e, #e17055)', category: 'Nature' },
  
  // Émotions
  { id: 'happy', name: 'Joie éclatante', gradient: 'linear-gradient(45deg, #fdcb6e, #e17055, #fd79a8)', category: 'Émotions' },
  { id: 'calm', name: 'Sérénité', gradient: 'linear-gradient(45deg, #74b9ff, #a29bfe, #fd79a8)', category: 'Émotions' },
  { id: 'dreamy', name: 'Rêverie', gradient: 'linear-gradient(45deg, #a29bfe, #fd79a8, #fdcb6e)', category: 'Émotions' },
  { id: 'energetic', name: 'Énergie positive', gradient: 'linear-gradient(45deg, #00b894, #fdcb6e, #e17055)', category: 'Émotions' },
  
  // Activités
  { id: 'school', name: 'École et apprentissage', gradient: 'linear-gradient(45deg, #74b9ff, #0984e3, #00b894)', category: 'Activités' },
  { id: 'sport', name: 'Sport et mouvement', gradient: 'linear-gradient(45deg, #00b894, #fdcb6e, #e17055)', category: 'Activités' },
  { id: 'music', name: 'Musique et créativité', gradient: 'linear-gradient(45deg, #a29bfe, #fd79a8, #fdcb6e)', category: 'Activités' },
  { id: 'art', name: 'Art et expression', gradient: 'linear-gradient(45deg, #fd79a8, #e17055, #fdcb6e)', category: 'Activités' },
  
  // Vie quotidienne
  { id: 'home', name: 'Maison et famille', gradient: 'linear-gradient(45deg, #fdcb6e, #e17055, #fd79a8)', category: 'Vie quotidienne' },
  { id: 'friends', name: 'Amis et partage', gradient: 'linear-gradient(45deg, #74b9ff, #a29bfe, #fd79a8)', category: 'Vie quotidienne' },
  { id: 'adventure', name: 'Aventure et découverte', gradient: 'linear-gradient(45deg, #00b894, #74b9ff, #a29bfe)', category: 'Vie quotidienne' },
  { id: 'night', name: 'Nuit étoilée', gradient: 'linear-gradient(45deg, #2d3436, #636e72, #74b9ff)', category: 'Vie quotidienne' },
  { id: 'rainbow', name: 'Arc-en-ciel', gradient: 'linear-gradient(45deg, #ff6b6b, #fdcb6e, #00b894, #74b9ff, #a29bfe, #fd79a8)', category: 'Vie quotidienne' },
  { id: 'stars', name: 'Étoiles scintillantes', gradient: 'linear-gradient(45deg, #2d3436, #636e72, #a29bfe, #74b9ff)', category: 'Vie quotidienne' }
];

// Fonction pour générer une image SVG avec gradient
function generateCoverSVG(id, name, gradient) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="400" height="300" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient-${id}" x1="0%" y1="0%" x2="100%" y2="100%">
      ${gradient.replace('linear-gradient(45deg, ', '').replace(')', '').split(', ').map((color, index) => {
        const stop = (index / (gradient.split(', ').length - 1)) * 100;
        return `<stop offset="${stop}%" style="stop-color:${color};stop-opacity:1" />`;
      }).join('\n      ')}
    </linearGradient>
  </defs>
  
  <!-- Fond avec gradient -->
  <rect width="400" height="300" fill="url(#gradient-${id})" />
  
  <!-- Motif décoratif -->
  <circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.1)" />
  <circle cx="350" cy="80" r="40" fill="rgba(255,255,255,0.08)" />
  <circle cx="80" cy="250" r="25" fill="rgba(255,255,255,0.06)" />
  <circle cx="320" cy="220" r="35" fill="rgba(255,255,255,0.1)" />
  
  <!-- Texte du nom -->
  <text x="200" y="160" text-anchor="middle" fill="rgba(255,255,255,0.9)" font-family="Arial, sans-serif" font-size="24" font-weight="bold">
    ${name}
  </text>
  
  <!-- Motif de fond subtil -->
  <pattern id="dots-${id}" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
    <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)" />
  </pattern>
  <rect width="400" height="300" fill="url(#dots-${id})" />
</svg>`;
}

// Créer le dossier covers s'il n'existe pas
const coversDir = path.join(__dirname, '..', 'public', 'covers');
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
}

// Générer les images
covers.forEach(cover => {
  const svgContent = generateCoverSVG(cover.id, cover.name, cover.gradient);
  const filePath = path.join(coversDir, `${cover.id}.svg`);
  
  fs.writeFileSync(filePath, svgContent);
  console.log(`✅ Généré: ${cover.name} (${cover.id}.svg)`);
});

console.log(`\n🎨 ${covers.length} images de couverture générées dans public/covers/`);
console.log('📁 Catégories: Nature, Émotions, Activités, Vie quotidienne');
