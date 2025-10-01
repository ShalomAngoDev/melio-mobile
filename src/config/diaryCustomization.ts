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
  { id: 'none', name: 'Aucune', url: null, category: 'Aucune' },
  { id: 'sunset', name: 'Coucher de soleil', url: '/covers/sunset.svg', category: 'Nature' },
  { id: 'ocean', name: 'Océan paisible', url: '/covers/ocean.svg', category: 'Nature' },
  { id: 'forest', name: 'Forêt mystérieuse', url: '/covers/forest.svg', category: 'Nature' },
  { id: 'mountain', name: 'Montagnes majestueuses', url: '/covers/mountain.svg', category: 'Nature' },
  { id: 'flower', name: 'Fleur délicate', url: '/covers/flower.svg', category: 'Nature' },
  { id: 'happy', name: 'Joie éclatante', url: '/covers/happy.svg', category: 'Émotions' },
  { id: 'calm', name: 'Sérénité', url: '/covers/calm.svg', category: 'Émotions' },
  { id: 'dreamy', name: 'Rêverie', url: '/covers/dreamy.svg', category: 'Émotions' },
  { id: 'energetic', name: 'Énergie positive', url: '/covers/energetic.svg', category: 'Émotions' },
  { id: 'school', name: 'École et apprentissage', url: '/covers/school.svg', category: 'Activités' },
  { id: 'sport', name: 'Sport et mouvement', url: '/covers/sport.svg', category: 'Activités' },
  { id: 'music', name: 'Musique et créativité', url: '/covers/music.svg', category: 'Activités' },
  { id: 'art', name: 'Art et expression', url: '/covers/art.svg', category: 'Activités' },
  { id: 'home', name: 'Maison et famille', url: '/covers/home.svg', category: 'Vie quotidienne' },
  { id: 'friends', name: 'Amis et partage', url: '/covers/friends.svg', category: 'Vie quotidienne' },
  { id: 'adventure', name: 'Aventure et découverte', url: '/covers/adventure.svg', category: 'Vie quotidienne' },
  { id: 'night', name: 'Nuit étoilée', url: '/covers/night.svg', category: 'Vie quotidienne' },
  { id: 'rainbow', name: 'Arc-en-ciel', url: '/covers/rainbow.svg', category: 'Vie quotidienne' },
  { id: 'stars', name: 'Étoiles scintillantes', url: '/covers/stars.svg', category: 'Vie quotidienne' }
];

export const getColorConfig = (colorId: string) => {
  return DIARY_COLORS.find(c => c.id === colorId) || DIARY_COLORS[0];
};

export const getCoverImage = (imageId: string | null | undefined) => {
  if (!imageId) return COVER_IMAGES[0];
  return COVER_IMAGES.find(img => img.id === imageId) || COVER_IMAGES[0];
};

