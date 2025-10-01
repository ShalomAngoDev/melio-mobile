import { Flame, Award } from 'lucide-react';

interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakWidget({ currentStreak, bestStreak }: StreakWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 rounded-3xl p-6 shadow-lg border-2 border-orange-200">
      <div className="flex items-center justify-between">
        {/* Streak actuel */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-md opacity-50 animate-pulse" />
            <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-4 shadow-xl">
              <Flame className="w-8 h-8 text-white" />
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-orange-700">Série actuelle</p>
            <p className="text-3xl font-bold text-orange-900">{currentStreak} jour{currentStreak !== 1 ? 's' : ''}</p>
            {currentStreak > 0 && (
              <p className="text-xs text-orange-600 mt-1">
                Continue comme ça ! 🔥
              </p>
            )}
          </div>
        </div>

        {/* Record personnel */}
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2 mb-1">
            <Award className="w-5 h-5 text-yellow-600" />
            <p className="text-sm font-medium text-yellow-700">Record</p>
          </div>
          <p className="text-2xl font-bold text-yellow-900">{bestStreak} jour{bestStreak !== 1 ? 's' : ''}</p>
          {bestStreak < currentStreak && (
            <p className="text-xs text-green-600 mt-1 font-semibold">
              ✨ Nouveau record !
            </p>
          )}
        </div>
      </div>

      {/* Barre de progression vers le prochain badge */}
      {currentStreak < 7 && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-2">
            <span>Prochain badge: 🔥 Semaine Parfaite</span>
            <span className="font-semibold">{currentStreak}/7 jours</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStreak / 7) * 100}%` }}
            />
          </div>
        </div>
      )}
      {currentStreak >= 7 && currentStreak < 30 && (
        <div className="mt-4 pt-4 border-t border-orange-200">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-2">
            <span>Prochain badge: 🎯 Régulier</span>
            <span className="font-semibold">{currentStreak}/30 jours</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStreak / 30) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

