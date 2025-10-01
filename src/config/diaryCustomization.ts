// Configuration pour la personnalisation des entrées de journal

export const DIARY_COLORS = [
  {
    id: 'pink',
    name: 'Rose',
    primary: 'bg-pink-100',
    border: 'border-pink-300',
    text: 'text-pink-700',
    gradient: 'from-pink-100 to-pink-50',
    accent: '#ec4899'
  },
  {
    id: 'purple',
    name: 'Violet',
    primary: 'bg-purple-100',
    border: 'border-purple-300',
    text: 'text-purple-700',
    gradient: 'from-purple-100 to-purple-50',
    accent: '#a855f7'
  },
  {
    id: 'blue',
    name: 'Bleu',
    primary: 'bg-blue-100',
    border: 'border-blue-300',
    text: 'text-blue-700',
    gradient: 'from-blue-100 to-blue-50',
    accent: '#3b82f6'
  },
  {
    id: 'green',
    name: 'Vert',
    primary: 'bg-green-100',
    border: 'border-green-300',
    text: 'text-green-700',
    gradient: 'from-green-100 to-green-50',
    accent: '#10b981'
  },
  {
    id: 'yellow',
    name: 'Jaune',
    primary: 'bg-yellow-100',
    border: 'border-yellow-300',
    text: 'text-yellow-700',
    gradient: 'from-yellow-100 to-yellow-50',
    accent: '#f59e0b'
  },
  {
    id: 'orange',
    name: 'Orange',
    primary: 'bg-orange-100',
    border: 'border-orange-300',
    text: 'text-orange-700',
    gradient: 'from-orange-100 to-orange-50',
    accent: '#f97316'
  },
  {
    id: 'red',
    name: 'Rouge doux',
    primary: 'bg-red-100',
    border: 'border-red-300',
    text: 'text-red-700',
    gradient: 'from-red-100 to-red-50',
    accent: '#ef4444'
  },
  {
    id: 'gray',
    name: 'Gris',
    primary: 'bg-gray-100',
    border: 'border-gray-300',
    text: 'text-gray-700',
    gradient: 'from-gray-100 to-gray-50',
    accent: '#6b7280'
  }
];

export const COVER_IMAGES = [
  {
    id: 'none',
    name: 'Aucune image',
    url: null,
    category: 'Aucune'
  },
  // Nature
  {
    id: 'sky-sunset',
    name: 'Coucher de soleil',
    url: '/covers/sky-sunset.jpg',
    category: 'Nature'
  },
  {
    id: 'ocean-waves',
    name: 'Vagues océan',
    url: '/covers/ocean-waves.jpg',
    category: 'Nature'
  },
  {
    id: 'forest-trees',
    name: 'Forêt',
    url: '/covers/forest-trees.jpg',
    category: 'Nature'
  },
  {
    id: 'flowers-spring',
    name: 'Fleurs',
    url: '/covers/flowers-spring.jpg',
    category: 'Nature'
  },
  {
    id: 'mountains',
    name: 'Montagnes',
    url: '/covers/mountains.jpg',
    category: 'Nature'
  },
  // Abstrait
  {
    id: 'gradient-pink',
    name: 'Dégradé rose',
    url: '/covers/gradient-pink.jpg',
    category: 'Abstrait'
  },
  {
    id: 'gradient-blue',
    name: 'Dégradé bleu',
    url: '/covers/gradient-blue.jpg',
    category: 'Abstrait'
  },
  {
    id: 'gradient-purple',
    name: 'Dégradé violet',
    url: '/covers/gradient-purple.jpg',
    category: 'Abstrait'
  },
  {
    id: 'watercolor',
    name: 'Aquarelle',
    url: '/covers/watercolor.jpg',
    category: 'Abstrait'
  },
  {
    id: 'pastel-clouds',
    name: 'Nuages pastels',
    url: '/covers/pastel-clouds.jpg',
    category: 'Abstrait'
  },
  // Saisons
  {
    id: 'spring-garden',
    name: 'Jardin printemps',
    url: '/covers/spring-garden.jpg',
    category: 'Saisons'
  },
  {
    id: 'summer-beach',
    name: 'Plage été',
    url: '/covers/summer-beach.jpg',
    category: 'Saisons'
  },
  {
    id: 'autumn-leaves',
    name: 'Feuilles automne',
    url: '/covers/autumn-leaves.jpg',
    category: 'Saisons'
  },
  {
    id: 'winter-snow',
    name: 'Neige hiver',
    url: '/covers/winter-snow.jpg',
    category: 'Saisons'
  },
  // Émotions/Atmosphères
  {
    id: 'calm-lake',
    name: 'Lac calme',
    url: '/covers/calm-lake.jpg',
    category: 'Émotions'
  },
  {
    id: 'peaceful-field',
    name: 'Champ paisible',
    url: '/covers/peaceful-field.jpg',
    category: 'Émotions'
  },
  {
    id: 'hope-sunrise',
    name: 'Lever de soleil',
    url: '/covers/hope-sunrise.jpg',
    category: 'Émotions'
  },
  {
    id: 'strength-tree',
    name: 'Arbre fort',
    url: '/covers/strength-tree.jpg',
    category: 'Émotions'
  }
];

export const getColorConfig = (colorId: string) => {
  return DIARY_COLORS.find(c => c.id === colorId) || DIARY_COLORS[0];
};

export const getCoverImage = (imageId: string | null | undefined) => {
  if (!imageId) return COVER_IMAGES[0];
  return COVER_IMAGES.find(img => img.id === imageId) || COVER_IMAGES[0];
};

