// Tags prédéfinis (synchronisés avec le backend)
export interface Tag {
  id: string;
  name: string;
  icon: string;
  color: string;
  category: string;
}

export const PREDEFINED_TAGS: Tag[] = [
  // Activité
  { id: 'tag_school', name: 'École', icon: '🏫', color: '#3b82f6', category: 'Activité' },
  { id: 'tag_sport', name: 'Sport', icon: '⚽', color: '#ef4444', category: 'Activité' },
  { id: 'tag_creativity', name: 'Créativité', icon: '🎨', color: '#a855f7', category: 'Activité' },
  
  // Social
  { id: 'tag_friends', name: 'Amis', icon: '👥', color: '#10b981', category: 'Social' },
  { id: 'tag_family', name: 'Famille', icon: '👨‍👩‍👧', color: '#f59e0b', category: 'Social' },
  
  // École
  { id: 'tag_homework', name: 'Devoirs', icon: '📚', color: '#6b7280', category: 'École' },
  
  // Émotion
  { id: 'tag_thoughts', name: 'Pensées', icon: '💭', color: '#8b5cf6', category: 'Émotion' },
  { id: 'tag_emotions', name: 'Émotions', icon: '❤️', color: '#ec4899', category: 'Émotion' },
  { id: 'tag_difficulty', name: 'Difficulté', icon: '😟', color: '#dc2626', category: 'Émotion' },
  
  // Vie
  { id: 'tag_event', name: 'Événement', icon: '🎉', color: '#f97316', category: 'Vie' },
  { id: 'tag_success', name: 'Réussite', icon: '🌟', color: '#fbbf24', category: 'Vie' },
  
  // Important
  { id: 'tag_help', name: "Besoin d'aide", icon: '🆘', color: '#b91c1c', category: 'Important' },
];

export const getTagById = (id: string): Tag | undefined => {
  return PREDEFINED_TAGS.find(tag => tag.id === id);
};

export const getTagsByCategory = (category: string): Tag[] => {
  return PREDEFINED_TAGS.filter(tag => tag.category === category);
};

export const TAG_CATEGORIES = ['Activité', 'Social', 'École', 'Émotion', 'Vie', 'Important'];

