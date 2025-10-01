import { useState, useEffect } from 'react';
import { Trophy, Lock, Sparkles, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import StreakWidget from './StreakWidget';

interface Achievement {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  threshold?: number;
  unlockedAt?: string;
}

interface Progress {
  totalEntries: number;
  currentStreak: number;
  bestStreak: number;
  unlockedAchievements: number;
  totalAchievements: number;
  recentAchievements: Achievement[];
}

export default function AchievementsSection() {
  const { user } = useAuth();
  const [allAchievements, setAllAchievements] = useState<Achievement[]>([]);
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // TODO: Récupérer depuis l'API
  useEffect(() => {
    // Pour le moment, afficher les badges en dur
    setAllAchievements([
      { id: '1', code: 'first_entry', name: 'Premier Pas', description: 'Tu as écrit ta première entrée !', icon: '🌱', category: 'WRITING', threshold: 1 },
      { id: '2', code: 'week_streak', name: 'Semaine Parfaite', description: '7 jours consécutifs', icon: '🔥', category: 'STREAK', threshold: 7 },
      { id: '3', code: 'writer_30', name: 'Écrivain', description: '30 entrées dans ton journal', icon: '📖', category: 'WRITING', threshold: 30 },
      { id: '4', code: 'regular_30', name: 'Régulier', description: '30 jours consécutifs', icon: '🎯', category: 'STREAK', threshold: 30 },
      { id: '5', code: 'champion_100', name: 'Champion', description: '100 entrées totales', icon: '🌟', category: 'WRITING', threshold: 100 },
      { id: '6', code: 'transformation', name: 'Transformation', description: 'Amélioration visible', icon: '🦋', category: 'SPECIAL' },
      { id: '7', code: 'courage', name: 'Courageux', description: 'Tu as fait un signalement', icon: '💪', category: 'ENGAGEMENT', threshold: 1 },
      { id: '8', code: 'open_heart', name: 'Cœur Ouvert', description: 'Tu as partagé avec Mélio', icon: '❤️', category: 'ENGAGEMENT', threshold: 1 },
      { id: '9', code: 'rainbow', name: 'Arc-en-ciel', description: 'Toutes les humeurs exprimées', icon: '🌈', category: 'SPECIAL' },
      { id: '10', code: 'creative', name: 'Créatif', description: '10 photos ajoutées', icon: '🎨', category: 'WRITING', threshold: 10 },
    ]);

    // Mock de badges débloqués
    setUnlockedAchievements([
      { id: '1', code: 'first_entry', name: 'Premier Pas', description: 'Tu as écrit ta première entrée !', icon: '🌱', category: 'WRITING', threshold: 1, unlockedAt: new Date().toISOString() },
    ]);

    setProgress({
      totalEntries: 1,
      currentStreak: 1,
      bestStreak: 1,
      unlockedAchievements: 1,
      totalAchievements: 10,
      recentAchievements: []
    });

    setIsLoading(false);
  }, [user]);

  const getCategoryColor = (category: string) => {
    const colors = {
      WRITING: 'from-blue-500 to-blue-600',
      STREAK: 'from-orange-500 to-red-500',
      ENGAGEMENT: 'from-pink-500 to-purple-500',
      SPECIAL: 'from-purple-500 to-indigo-500',
    };
    return colors[category as keyof typeof colors] || 'from-gray-500 to-gray-600';
  };

  const isUnlocked = (achievementId: string) => {
    return unlockedAchievements.some(ua => ua.id === achievementId);
  };

  const categories = ['WRITING', 'STREAK', 'ENGAGEMENT', 'SPECIAL'];
  const categoryNames = {
    WRITING: 'Écriture',
    STREAK: 'Régularité',
    ENGAGEMENT: 'Engagement',
    SPECIAL: 'Spéciaux',
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Mes Badges</h1>
            <p className="text-gray-600">
              {progress?.unlockedAchievements || 0}/{progress?.totalAchievements || 0} badges débloqués
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full p-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Barre de progression générale */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-full transition-all duration-500"
              style={{ width: `${((progress?.unlockedAchievements || 0) / (progress?.totalAchievements || 1)) * 100}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-2 text-center">
            {Math.round(((progress?.unlockedAchievements || 0) / (progress?.totalAchievements || 1)) * 100)}% complété
          </p>
        </div>
      </div>

      {/* Widget Streak */}
      {progress && (
        <StreakWidget 
          currentStreak={progress.currentStreak} 
          bestStreak={progress.bestStreak} 
        />
      )}

      {/* Statistiques rapides */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <p className="text-sm font-medium text-gray-700">Total entrées</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">{progress?.totalEntries || 0}</p>
        </div>

        <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
          <div className="flex items-center space-x-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <p className="text-sm font-medium text-gray-700">Badges</p>
          </div>
          <p className="text-3xl font-bold text-purple-900">{progress?.unlockedAchievements || 0}</p>
        </div>
      </div>

      {/* Liste des badges par catégorie */}
      <div className="space-y-6">
        {categories.map(category => {
          const categoryAchievements = allAchievements.filter(a => a.category === category);
          if (categoryAchievements.length === 0) return null;

          return (
            <div key={category}>
              <h2 className="text-lg font-bold text-gray-800 mb-4">
                {categoryNames[category as keyof typeof categoryNames]}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {categoryAchievements.map(achievement => {
                  const unlocked = isUnlocked(achievement.id);
                  const unlockedData = unlockedAchievements.find(ua => ua.id === achievement.id);

                  return (
                    <div
                      key={achievement.id}
                      className={`group relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
                        unlocked
                          ? 'bg-gradient-to-br from-white/90 to-white/70 border-white/40 shadow-lg hover:shadow-2xl hover:scale-105'
                          : 'bg-gray-100/50 border-gray-300/50 opacity-75'
                      }`}
                    >
                      {/* Effet brillant pour les badges débloqués */}
                      {unlocked && (
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12" />
                      )}

                      <div className="p-5">
                        <div className="flex items-start space-x-4">
                          {/* Icône du badge */}
                          <div className={`relative flex-shrink-0`}>
                            <div 
                              className={`text-5xl ${unlocked ? 'filter-none' : 'grayscale opacity-40'}`}
                            >
                              {achievement.icon}
                            </div>
                            {!unlocked && (
                              <div className="absolute inset-0 flex items-center justify-center">
                                <Lock className="w-6 h-6 text-gray-500" />
                              </div>
                            )}
                          </div>

                          {/* Détails */}
                          <div className="flex-1">
                            <h3 className={`font-bold text-lg ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                              {achievement.name}
                            </h3>
                            <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                              {achievement.description}
                            </p>

                            {/* Threshold ou date de débloca */}
                            {unlocked && unlockedData?.unlockedAt ? (
                              <p className="text-xs text-green-600 font-medium mt-2 flex items-center">
                                <Sparkles className="w-3 h-3 mr-1" />
                                Débloqué le {new Date(unlockedData.unlockedAt).toLocaleDateString('fr-FR')}
                              </p>
                            ) : achievement.threshold ? (
                              <p className="text-xs text-gray-500 mt-2">
                                Objectif: {achievement.threshold} {category === 'STREAK' ? 'jours' : 'entrées'}
                              </p>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message d'encouragement */}
      {progress && progress.unlockedAchievements === 0 && (
        <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-6 text-center border-2 border-purple-200">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-purple-900 mb-2">Commence ton aventure !</h3>
          <p className="text-purple-700">
            Écris dans ton journal pour débloquer ton premier badge 🌱
          </p>
        </div>
      )}
    </div>
  );
}

