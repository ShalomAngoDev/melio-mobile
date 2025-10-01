import React, { useState } from 'react';
import { Pencil, Calendar, Trash2, Heart, Frown, Meh, Smile, ChevronDown, ChevronUp } from 'lucide-react';
import { useDiary } from '../../contexts/DiaryContext';
import { useAuth } from '../../contexts/AuthContext';

const moodIcons = {
  'very-sad': { icon: Frown, color: 'text-red-500', bg: 'bg-red-100', label: 'Très triste' },
  'sad': { icon: Frown, color: 'text-orange-500', bg: 'bg-orange-100', label: 'Triste' },
  'neutral': { icon: Meh, color: 'text-gray-500', bg: 'bg-gray-100', label: 'Neutre' },
  'happy': { icon: Smile, color: 'text-green-500', bg: 'bg-green-100', label: 'Content' },
  'very-happy': { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100', label: 'Très heureux' }
};

export default function DiarySection() {
  const { user } = useAuth();
  const { addEntry, getUserEntries, deleteEntry, syncEntries, isLoading, syncError } = useDiary();
  const [isWriting, setIsWriting] = useState(false);
  const [newEntry, setNewEntry] = useState('');
  const [selectedMood, setSelectedMood] = useState<keyof typeof moodIcons>('neutral');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(new Set());

  const userEntries = user ? getUserEntries(user.id) : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newEntry.trim()) {
      await addEntry(newEntry.trim(), selectedMood);
      setNewEntry('');
      setSelectedMood('neutral');
      setIsWriting(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
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

      {/* New Entry Form */}
      {isWriting && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
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
                }}
                className="flex-1 py-3 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all duration-200"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Entries List */}
      <div className="space-y-4">
        {userEntries.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <Heart className="w-12 h-12 text-pink-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Ton journal t'attend</h3>
            <p className="text-gray-500">Commence par écrire ta première entrée</p>
          </div>
        ) : (
          userEntries.map((entry) => {
            const MoodIcon = moodIcons[entry.mood].icon;
            return (
              <div
                key={entry.id}
                className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${moodIcons[entry.mood].bg}`}>
                      <MoodIcon className={`w-5 h-5 ${moodIcons[entry.mood].color}`} />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {formatDate(entry.timestamp)}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        Humeur: {moodIcons[entry.mood].label}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="prose prose-sm max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {expandedEntries.has(entry.id) ? entry.content : getTruncatedText(entry.content)}
                  </p>
                  
                  {entry.content.length > 150 && (
                    <button
                      onClick={() => toggleExpanded(entry.id)}
                      className="mt-2 flex items-center text-sm text-pink-600 hover:text-pink-700 transition-colors duration-200"
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
            );
          })
        )}
      </div>
    </div>
  );
}