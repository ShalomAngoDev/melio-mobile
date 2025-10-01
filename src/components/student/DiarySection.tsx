import { useState, useEffect } from 'react';
import { Pencil, Calendar, Trash2, Heart, Frown, Meh, Smile, ChevronDown, ChevronUp, Palette, Image as ImageIcon, X, Tag as TagIcon } from 'lucide-react';
import { useDiary } from '../../contexts/DiaryContext';
import { useAuth } from '../../contexts/AuthContext';
import { DIARY_COLORS, COVER_IMAGES, getColorConfig } from '../../config/diaryCustomization';
import { PREDEFINED_TAGS, TAG_CATEGORIES, getTagById } from '../../config/tags';
import StreakWidget from './StreakWidget';
import DaySelector from './DaySelector';

const moodIcons = {
  'very-sad': { icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Très triste' },
  'sad': { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Triste' },
  'neutral': { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Neutre' },
  'happy': { icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Content' },
  'very-happy': { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100', label: 'Très heureux' }
};

export default function DiarySection() {
  const { user } = useAuth();
  const { addEntry, updateEntry, getUserEntries, deleteEntry, syncEntries, isLoading, syncError } = useDiary();
  const [isWriting, setIsWriting] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<keyof typeof moodIcons>('neutral');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());
  // V2: Nouveaux états pour personnalisation
  const [selectedColor, setSelectedColor] = useState(() => {
    // Charger la couleur sauvegardée ou utiliser 'pink' par défaut
    const savedColor = localStorage.getItem('melio_selected_color');
    return savedColor || 'pink';
  });

  // Fonction pour mettre à jour la couleur et la sauvegarder
  const updateSelectedColor = (color: string) => {
    setSelectedColor(color);
    localStorage.setItem('melio_selected_color', color);
  };
  const [selectedCoverImage, setSelectedCoverImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showCoverPicker, setShowCoverPicker] = useState(false);
  const [showTagPicker, setShowTagPicker] = useState(false);
  // V2: Gamification
  const [streakInfo, setStreakInfo] = useState({ currentStreak: 0, bestStreak: 0 });
  // V2: Sélecteur de jour
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const userEntries = user ? getUserEntries(user.id) : [];
  
  // Filtrer les entrées par date
  const filteredEntries = selectedDate 
    ? userEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toISOString().split('T')[0] === selectedDate;
      })
    : userEntries;

  // V2: Récupérer le streak (TODO: depuis l'API)
  useEffect(() => {
    // Mock pour le moment - sera remplacé par un appel API
    setStreakInfo({ currentStreak: userEntries.length > 0 ? 1 : 0, bestStreak: 1 });
  }, [userEntries.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      await addEntry(newEntry.trim(), selectedMood, selectedColor, selectedCoverImage || undefined, selectedTags);
      setNewEntry('');
      setSelectedMood('neutral');
      // Garder la couleur sélectionnée pour la prochaine entrée
      // setSelectedColor('pink'); // Supprimé pour garder la couleur
      setSelectedCoverImage(null);
      setSelectedTags([]);
      setIsWriting(false);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  const openEditModal = (entry: any) => {
    setEditingEntry(entry);
    setNewEntry(entry.content);
    setSelectedMood(entry.mood);
    updateSelectedColor(entry.color || selectedColor); // Garder la couleur actuelle si pas de couleur dans l'entrée
    setSelectedCoverImage(entry.coverImage || null);
    setSelectedTags(entry.tags || []);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim() && editingEntry) {
      await updateEntry(editingEntry.id, newEntry.trim(), selectedMood, selectedColor, selectedCoverImage || undefined, selectedTags);
      setEditingEntry(null);
      setNewEntry('');
      setSelectedMood('neutral');
      // Garder la couleur sélectionnée
      // setSelectedColor('pink'); // Supprimé pour garder la couleur
      setSelectedCoverImage(null);
      setSelectedTags([]);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const toggleExpanded = (entryId: string) => {
    setExpandedEntries(prev => {
      const newSet = new Set(prev);
      if (newSet.has(entryId)) {
        newSet.delete(entryId);
      } else {
        newSet.add(entryId);
      }
      return newSet;
    });
  };

  const getTruncatedText = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <div className="relative space-y-6 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 min-h-screen">
      {/* Papillon en arrière-plan - Version améliorée */}
      <div 
        className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden"
        style={{ zIndex: 0 }}
      >
        {/* Papillon principal */}
        <div className="w-80 h-80 opacity-50 transform rotate-12">
          <img 
            src="/logo-icon.png" 
            alt="" 
            className="w-full h-full object-contain drop-shadow-sm"
          />
        </div>
        
        {/* Papillons secondaires pour plus de profondeur */}
        <div className="absolute top-20 left-10 w-32 h-32 opacity-50 transform -rotate-45">
          <img 
            src="/logo-icon.png" 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        
        <div className="absolute bottom-20 right-10 w-24 h-24 opacity-50 transform rotate-45">
          <img 
            src="/logo-icon.png" 
            alt="" 
            className="w-full h-full object-contain"
          />
        </div>
        
        {/* Effet de brillance subtil */}
        <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/8 to-transparent"></div>
      </div>

      {/* Header */}
      <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20" style={{ zIndex: 1 }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mon Journal Intime</h1>
            <p className="text-gray-600">Exprime tes pensées en toute confidentialité</p>
            
          </div>
          <button
            onClick={() => setIsWriting(true)}
            disabled={isLoading}
            className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Pencil className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* V2: Sélecteur de jour horizontal */}
      <DaySelector 
        selectedDate={selectedDate}
        onDateSelect={setSelectedDate}
      />


      {/* V2: Widget Streak */}
      {userEntries.length > 0 && (
        <div className="relative" style={{ zIndex: 1 }}>
          <StreakWidget 
            currentStreak={streakInfo.currentStreak} 
            bestStreak={streakInfo.bestStreak} 
          />
        </div>
      )}

      {/* New Entry Form */}
      {isWriting && (
        <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20" style={{ zIndex: 1 }}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Comment te sens-tu aujourd'hui ?
              </label>
              <div className="flex space-x-3">
                {Object.entries(moodIcons).map(([mood, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setSelectedMood(mood as keyof typeof moodIcons)}
                      className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                        selectedMood === mood
                          ? `${config.bg} border-current ${config.color}`
                          : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </button>
                  );
                })}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Sélectionné: {moodIcons[selectedMood].label}
              </p>
            </div>

            {/* V2: Sélecteur de couleur compact */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Palette className="w-4 h-4 inline mr-2" />
                Choisis une couleur pour ta feuille
              </label>
              <div className="flex flex-wrap gap-1.5">
                {DIARY_COLORS.map((color) => (
                  <button
                    key={color.id}
                    type="button"
                    onClick={() => updateSelectedColor(color.id)}
                    className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                      selectedColor === color.id
                        ? 'border-gray-800 scale-110 shadow-md ring-2 ring-gray-200'
                        : 'border-gray-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: color.accent }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* V2: Bouton pour ouvrir le sélecteur d'image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <ImageIcon className="w-4 h-4 inline mr-2" />
                Image de couverture (optionnel)
              </label>
              <button
                type="button"
                onClick={() => setShowCoverPicker(true)}
                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-2xl transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  {selectedCoverImage ? (
                    <>
                      <div className="w-12 h-8 rounded-lg overflow-hidden border border-gray-300">
                        <img 
                          src={COVER_IMAGES.find(img => img.id === selectedCoverImage)?.url || ''} 
                          alt="Aperçu"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                      <span className="text-sm text-gray-700">
                        {COVER_IMAGES.find(img => img.id === selectedCoverImage)?.name}
                      </span>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Choisir une image</span>
                  )}
                </div>
                <ImageIcon className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* V2: Sélecteur de tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <TagIcon className="w-4 h-4 inline mr-2" />
                Catégories (optionnel)
              </label>
              <button
                type="button"
                onClick={() => setShowTagPicker(true)}
                className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-2xl transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center flex-wrap gap-2">
                  {selectedTags.length > 0 ? (
                    selectedTags.map(tagId => {
                      const tag = getTagById(tagId);
                      if (!tag) return null;
                      return (
                        <span 
                          key={tagId}
                          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: tag.color + '20', color: tag.color }}
                        >
                          <span className="mr-1">{tag.icon}</span>
                          {tag.name}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">Ajouter des catégories</span>
                  )}
                </div>
                <TagIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raconte ta journée
              </label>
              <textarea
                value={newEntry}
                onChange={(e) => setNewEntry(e.target.value)}
                className="w-full h-32 px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200"
                placeholder="Raconte ta journée, tes émotions, tes pensées..."
                required
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Enregistrer
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsWriting(false);
                  setNewEntry('');
                  setSelectedMood('neutral');
                  setSelectedColor('pink');
                  setSelectedCoverImage(null);
                  setSelectedTags([]);
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal de sélection d'image de couverture */}
      {showCoverPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: editingEntry ? 60 : 50 }}>
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Choisis une image de couverture</h3>
              <button
                onClick={() => setShowCoverPicker(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Grille d'images par catégorie */}
            <div className="space-y-6">
              {['Aucune', 'Nature', 'Abstrait', 'Saisons', 'Émotions'].map((category) => {
                const categoryImages = COVER_IMAGES.filter(img => img.category === category);
                if (categoryImages.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-600 mb-3">{category}</h4>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {categoryImages.map((cover) => (
                        <button
                          key={cover.id}
                          type="button"
                          onClick={() => {
                            setSelectedCoverImage(cover.id === 'none' ? null : cover.id);
                            setShowCoverPicker(false);
                          }}
                          className={`group aspect-video rounded-xl border-2 overflow-hidden transition-all duration-200 ${
                            selectedCoverImage === cover.id || (cover.id === 'none' && !selectedCoverImage)
                              ? 'border-pink-500 ring-4 ring-pink-200'
                              : 'border-gray-300 hover:border-pink-400 hover:shadow-lg'
                          }`}
                        >
                          {cover.url ? (
                            <div className="relative w-full h-full">
                              <img 
                                src={cover.url} 
                                alt={cover.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  // Si l'image n'existe pas, afficher un placeholder avec la couleur
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<div class="w-full h-full bg-gradient-to-br from-${selectedColor}-100 to-${selectedColor}-50 flex items-center justify-center text-xs text-gray-500">${cover.name}</div>`;
                                  }
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <p className="text-xs text-white font-medium truncate">{cover.name}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                              <div className="text-center">
                                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-1" />
                                <p className="text-xs text-gray-500">{cover.name}</p>
                              </div>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <button
                onClick={() => setShowCoverPicker(false)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de sélection de tags */}
      {showTagPicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4" style={{ zIndex: editingEntry ? 60 : 50 }}>
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Catégories de ton entrée</h3>
              <button
                onClick={() => setShowTagPicker(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">Sélectionne une ou plusieurs catégories pour organiser tes entrées</p>

            {/* Tags par catégorie */}
            <div className="space-y-5">
              {TAG_CATEGORIES.map((category) => {
                const categoryTags = PREDEFINED_TAGS.filter(tag => tag.category === category);
                if (categoryTags.length === 0) return null;

                return (
                  <div key={category}>
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categoryTags.map((tag) => {
                        const isSelected = selectedTags.includes(tag.id);
                        return (
                          <button
                            key={tag.id}
                            type="button"
                            onClick={() => toggleTag(tag.id)}
                            className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                              isSelected
                                ? 'shadow-md scale-105'
                                : 'hover:scale-105 opacity-75 hover:opacity-100'
                            }`}
                            style={{
                              backgroundColor: isSelected ? tag.color : tag.color + '20',
                              color: isSelected ? 'white' : tag.color,
                              border: `2px solid ${tag.color}${isSelected ? '' : '40'}`
                            }}
                          >
                            <span className="mr-1.5">{tag.icon}</span>
                            {tag.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">
                  {selectedTags.length} catégorie{selectedTags.length !== 1 ? 's' : ''} sélectionnée{selectedTags.length !== 1 ? 's' : ''}
                </span>
                {selectedTags.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedTags([])}
                    className="text-sm text-red-600 hover:text-red-700"
                  >
                    Tout effacer
                  </button>
                )}
              </div>
              <button
                onClick={() => setShowTagPicker(false)}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition d'une entrée */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-800">Modifier ton entrée</h3>
              <button
                onClick={() => {
                  setEditingEntry(null);
                  setNewEntry('');
                  setSelectedMood('neutral');
                  // Garder la couleur sélectionnée
                  // setSelectedColor('pink'); // Supprimé pour garder la couleur
                  setSelectedCoverImage(null);
                  setSelectedTags([]);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Humeur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Comment te sens-tu ?
                </label>
                <div className="flex space-x-3">
                  {Object.entries(moodIcons).map(([mood, config]) => {
                    const Icon = config.icon;
                    return (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setSelectedMood(mood as keyof typeof moodIcons)}
                        className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                          selectedMood === mood
                            ? `${config.bg} border-current ${config.color}`
                            : 'bg-gray-50 border-gray-200 text-gray-400 hover:bg-gray-100'
                        }`}
                      >
                        <Icon className="w-6 h-6" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Couleur */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Palette className="w-4 h-4 inline mr-2" />
                  Couleur
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {DIARY_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => updateSelectedColor(color.id)}
                      className={`w-8 h-8 rounded-full border-2 transition-all duration-200 ${
                        selectedColor === color.id
                          ? 'border-gray-800 scale-110 shadow-md ring-2 ring-gray-200'
                          : 'border-gray-300 hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.accent }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Image de couverture */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="w-4 h-4 inline mr-2" />
                  Image de couverture
                </label>
                <button
                  type="button"
                  onClick={() => setShowCoverPicker(true)}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-2xl transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    {selectedCoverImage ? (
                      <>
                        <div className="w-12 h-8 rounded-lg overflow-hidden border border-gray-300">
                          <img 
                            src={COVER_IMAGES.find(img => img.id === selectedCoverImage)?.url || ''} 
                            alt="Aperçu"
                            className="w-full h-full object-cover"
                            onError={(e) => e.currentTarget.style.display = 'none'}
                          />
                        </div>
                        <span className="text-sm text-gray-700">
                          {COVER_IMAGES.find(img => img.id === selectedCoverImage)?.name}
                        </span>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Aucune image</span>
                    )}
                  </div>
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TagIcon className="w-4 h-4 inline mr-2" />
                  Catégories
                </label>
                <button
                  type="button"
                  onClick={() => setShowTagPicker(true)}
                  className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 border-2 border-gray-300 rounded-2xl transition-all duration-200 flex items-center justify-between"
                >
                  <div className="flex items-center flex-wrap gap-2">
                    {selectedTags.length > 0 ? (
                      selectedTags.map(tagId => {
                        const tag = getTagById(tagId);
                        if (!tag) return null;
                        return (
                          <span 
                            key={tagId}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
                            style={{ backgroundColor: tag.color + '20', color: tag.color }}
                          >
                            <span className="mr-1">{tag.icon}</span>
                            {tag.name}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-sm text-gray-500">Aucune catégorie</span>
                    )}
                  </div>
                  <TagIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                </button>
              </div>

              {/* Contenu */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modifier le texte
                </label>
                <textarea
                  value={newEntry}
                  onChange={(e) => setNewEntry(e.target.value)}
                  className="w-full h-40 px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent resize-none transition-all duration-200"
                  placeholder="Raconte ta journée, tes émotions, tes pensées..."
                  required
                />
              </div>

              {/* Boutons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200"
                >
                  Enregistrer les modifications
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEntry(null);
                    setNewEntry('');
                    setSelectedMood('neutral');
                    // Garder la couleur sélectionnée
                    // setSelectedColor('pink'); // Supprimé pour garder la couleur
                    setSelectedCoverImage(null);
                    setSelectedTags([]);
                  }}
                  className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Entries List */}
      <div className="relative space-y-4" style={{ zIndex: 1 }}>
        {filteredEntries.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            {selectedDate ? (
              <>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Aucune entrée ce jour</h3>
                <p className="text-gray-500">Tu n'as pas écrit dans ton journal le {new Date(selectedDate).toLocaleDateString('fr-FR', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long'
                })}</p>
              </>
            ) : (
              <>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Ton journal t'attend</h3>
                <p className="text-gray-500">Commence par écrire ta première entrée</p>
              </>
            )}
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const MoodIcon = moodIcons[entry.mood].icon;
            const moodConfig = moodIcons[entry.mood];
            const entryColorConfig = getColorConfig(entry.color || 'pink');
            return (
              <div
                key={entry.id}
                onClick={() => openEditModal(entry)}
                className="group relative bg-gradient-to-br from-white/90 to-white/70 backdrop-blur-md rounded-3xl p-6 shadow-lg border-2 hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 overflow-hidden cursor-pointer"
                style={{ 
                  borderColor: entryColorConfig.accent + '40',
                }}
              >
                {/* Image de couverture en arrière-plan */}
                {entry.coverImage && (
                  <div 
                    className="absolute inset-0 rounded-3xl opacity-10 pointer-events-none"
                    style={{
                      backgroundImage: `url(${COVER_IMAGES.find(img => img.id === entry.coverImage)?.url})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                )}

                {/* Barre colorée personnalisée */}
                <div 
                  className={`absolute left-0 top-0 bottom-0 w-2 rounded-l-3xl`}
                  style={{ 
                    background: `linear-gradient(to bottom, ${entryColorConfig.accent}, transparent)` 
                  }}
                />

                {/* Effet de brillance au survol */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      {/* Icône d'humeur plus grande et stylisée */}
                      <div className={`relative p-3 rounded-2xl ${moodConfig.bg} shadow-md`}>
                        <MoodIcon className={`w-6 h-6 ${moodConfig.color}`} />
                        <div className={`absolute -top-1 -right-1 w-3 h-3 ${moodConfig.bg} rounded-full border-2 border-white`} />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${moodConfig.bg} ${moodConfig.color}`}>
                            {moodConfig.label}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Supprimer cette entrée ?')) {
                          deleteEntry(entry.id);
                        }
                      }}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all duration-200 hover:scale-110"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Tags de l'entrée */}
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {entry.tags.map(tagId => {
                        const tag = getTagById(tagId);
                        if (!tag) return null;
                        return (
                          <span 
                            key={tagId}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: tag.color + '20', 
                              color: tag.color,
                              border: `1px solid ${tag.color}40`
                            }}
                          >
                            <span className="mr-1">{tag.icon}</span>
                            {tag.name}
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Contenu avec style amélioré */}
                  <div className="pl-2 border-l-4 border-transparent group-hover:border-pink-200 transition-colors duration-300">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap text-base">
                      {expandedEntries.has(entry.id) ? entry.content : getTruncatedText(entry.content)}
                    </p>
                    
                    {entry.content.length > 150 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpanded(entry.id);
                        }}
                        className="mt-3 flex items-center text-sm font-medium text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-4 py-2 rounded-full transition-all duration-200"
                      >
                        {expandedEntries.has(entry.id) ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-1" />
                            Voir moins
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-1" />
                            Lire la suite
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}