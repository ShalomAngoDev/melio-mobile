import { Flame, Award } from 'lucide-react';

interface StreakWidgetProps {
  currentStreak: number;
  bestStreak: number;
}

export default function StreakWidget({ currentStreak, bestStreak }: StreakWidgetProps) {
  return (
    <div className="bg-gradient-to-br from-orange-100 via-orange-50 to-yellow-50 rounded-2xl p-4 shadow-md border border-orange-200">
      <div className="flex items-center justify-between">
        {/* Streak actuel */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-0 bg-orange-400 rounded-full blur-sm opacity-40 animate-pulse" />
            <div className="relative bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-2 shadow-lg">
              <Flame className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-orange-700">Série actuelle</p>
            <p className="text-xl font-bold text-orange-900">{currentStreak} jour{currentStreak !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Record personnel */}
        <div className="flex items-center space-x-2">
          <div className="text-right">
            <p className="text-xs font-medium text-yellow-700">Record</p>
            <p className="text-lg font-bold text-yellow-900">{bestStreak} jour{bestStreak !== 1 ? 's' : ''}</p>
          </div>
          <Award className="w-5 h-5 text-yellow-600" />
        </div>
      </div>

      {/* Barre de progression compacte vers le prochain badge */}
      {currentStreak < 7 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
            <span className="font-medium">🔥 Semaine Parfaite</span>
            <span className="font-semibold">{currentStreak}/7</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-1.5 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStreak / 7) * 100}%` }}
            />
          </div>
        </div>
      )}
      {currentStreak >= 7 && currentStreak < 30 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-orange-700 mb-1">
            <span className="font-medium">🎯 Régulier</span>
            <span className="font-semibold">{currentStreak}/30</span>
          </div>
          <div className="w-full bg-orange-200 rounded-full h-1.5 overflow-hidden">
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

