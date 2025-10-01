import React, { useState } from 'react';
import { Play, Book, Users, Heart, Star, Clock, Eye } from 'lucide-react';

interface LibraryItem {
  id: string;
  title: string;
  type: 'video' | 'testimony' | 'book' | 'article';
  category: 'bullying' | 'emotions' | 'friendship' | 'self-esteem' | 'help';
  description: string;
  duration?: string;
  author?: string;
  rating: number;
  views: number;
  thumbnail: string;
}

const libraryContent: LibraryItem[] = [
  {
    id: '1',
    title: 'Comment j\'ai surmonté le harcèlement',
    type: 'testimony',
    category: 'bullying',
    description: 'Témoignage de Sarah, 16 ans, qui partage son expérience et comment elle a retrouvé confiance en elle.',
    duration: '8 min',
    author: 'Sarah M.',
    rating: 4.8,
    views: 1247,
    thumbnail: 'https://images.pexels.com/photos/3182834/pexels-photo-3182834.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '2',
    title: 'Gérer ses émotions au quotidien',
    type: 'video',
    category: 'emotions',
    description: 'Techniques simples pour comprendre et gérer tes émotions, expliquées par une psychologue.',
    duration: '12 min',
    author: 'Dr. Claire Dubois',
    rating: 4.9,
    views: 2156,
    thumbnail: 'https://images.pexels.com/photos/3808904/pexels-photo-3808904.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'Les vrais amis',
    type: 'book',
    category: 'friendship',
    description: 'Extrait du livre "Adolescence et amitié" - Comment reconnaître les vraies amitiés.',
    author: 'Marie Rousseau',
    rating: 4.6,
    views: 892,
    thumbnail: 'https://images.pexels.com/photos/4050290/pexels-photo-4050290.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '4',
    title: 'Tu es unique et précieux',
    type: 'video',
    category: 'self-esteem',
    description: 'Film court inspirant sur l\'acceptation de soi et la valorisation de ses différences.',
    duration: '6 min',
    author: 'Collectif Jeunesse',
    rating: 4.7,
    views: 3421,
    thumbnail: 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'Où trouver de l\'aide ?',
    type: 'article',
    category: 'help',
    description: 'Guide complet des ressources disponibles : numéros d\'urgence, associations, professionnels.',
    author: 'Équipe Melio',
    rating: 4.9,
    views: 1845,
    thumbnail: 'https://images.pexels.com/photos/3184639/pexels-photo-3184639.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '6',
    title: 'Mon histoire de résilience',
    type: 'testimony',
    category: 'bullying',
    description: 'Témoignage de Tom qui raconte comment il a transformé sa souffrance en force.',
    duration: '10 min',
    author: 'Tom L.',
    rating: 4.8,
    views: 967,
    thumbnail: 'https://images.pexels.com/photos/3184296/pexels-photo-3184296.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

const categories = [
  { id: 'all', label: 'Tout', icon: Heart },
  { id: 'bullying', label: 'Harcèlement', icon: Users },
  { id: 'emotions', label: 'Émotions', icon: Heart },
  { id: 'friendship', label: 'Amitié', icon: Users },
  { id: 'self-esteem', label: 'Estime de soi', icon: Star },
  { id: 'help', label: 'Aide', icon: Book }
];

const typeIcons = {
  video: Play,
  testimony: Users,
  book: Book,
  article: Book
};

export default function LibrarySection() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  const filteredContent = selectedCategory === 'all' 
    ? libraryContent 
    : libraryContent.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Bibliothèque Bien-être</h1>
        <p className="text-gray-600">Des ressources pour t'accompagner et t'inspirer</p>
      </div>

      {/* Categories */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map(item => {
          const TypeIcon = typeIcons[item.type];
          return (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group"
            >
              <div className="relative">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-3 left-3">
                  <div className="bg-black/70 text-white px-3 py-1 rounded-full text-xs flex items-center">
                    <TypeIcon className="w-3 h-3 mr-1" />
                    {item.type === 'video' ? 'Vidéo' : 
                     item.type === 'testimony' ? 'Témoignage' :
                     item.type === 'book' ? 'Livre' : 'Article'}
                  </div>
                </div>
                {item.duration && (
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {item.duration}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors duration-200">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {item.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center">
                      <Star className="w-3 h-3 text-yellow-400 mr-1" fill="currentColor" />
                      <span>{item.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      <span>{item.views}</span>
                    </div>
                  </div>
                  {item.author && (
                    <span>par {item.author}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedItem.thumbnail}
                alt={selectedItem.title}
                className="w-full h-64 object-cover"
              />
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/70 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-all duration-200"
              >
                ✕
              </button>
            </div>
            
            <div className="p-8">
              <div className="flex items-center mb-4">
                <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm mr-3">
                  {selectedItem.type === 'video' ? 'Vidéo' : 
                   selectedItem.type === 'testimony' ? 'Témoignage' :
                   selectedItem.type === 'book' ? 'Livre' : 'Article'}
                </div>
                {selectedItem.duration && (
                  <div className="text-sm text-gray-500 flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {selectedItem.duration}
                  </div>
                )}
              </div>
              
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                {selectedItem.title}
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {selectedItem.description}
              </p>
              
              {selectedItem.type === 'video' || selectedItem.type === 'testimony' ? (
                <div className="bg-gray-100 rounded-2xl p-8 text-center mb-6">
                  <Play className="w-12 h-12 text-pink-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    Cette fonctionnalité sera disponible dans la version complète de Melio.
                  </p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-800 mb-3">Extrait :</h3>
                  <p className="text-gray-700 leading-relaxed">
                    "Il est important de se rappeler que chaque personne est unique et précieuse. 
                    Les difficultés que tu traverses ne définissent pas qui tu es. Tu as en toi 
                    toutes les ressources nécessaires pour surmonter les épreuves et grandir. 
                    N'hésite jamais à demander de l'aide - c'est un signe de courage, pas de faiblesse."
                  </p>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" />
                    <span>{selectedItem.rating}/5</span>
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    <span>{selectedItem.views} vues</span>
                  </div>
                </div>
                {selectedItem.author && (
                  <span>par {selectedItem.author}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}