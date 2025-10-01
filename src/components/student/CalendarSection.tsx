import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, BookOpen } from 'lucide-react';
import { useDiary } from '../../contexts/DiaryContext';
import { useAuth } from '../../contexts/AuthContext';

interface CalendarEntry {
  date: string; // YYYY-MM-DD format
  entries: any[];
  hasEntries: boolean;
}

export default function CalendarSection() {
  const { getUserEntries } = useDiary();
  const { user } = useAuth();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);

  // Récupérer les entrées de l'utilisateur
  const userEntries = user ? getUserEntries(user.id) : [];

  // Générer les données du calendrier
  useEffect(() => {
    if (!user) return;

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Premier jour du mois
    const firstDay = new Date(year, month, 1);
    // Dernier jour du mois
    const lastDay = new Date(year, month + 1, 0);
    // Premier lundi de la semaine (pour commencer le calendrier)
    const startDate = new Date(firstDay);
    startDate.setDate(firstDay.getDate() - firstDay.getDay() + 1);
    
    // Dernier dimanche de la semaine
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));

    const calendarData: CalendarEntry[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      const dateStr = current.toISOString().split('T')[0];
      const dayEntries = userEntries.filter(entry => {
        const entryDate = new Date(entry.timestamp);
        return entryDate.toISOString().split('T')[0] === dateStr;
      });

      calendarData.push({
        date: dateStr,
        entries: dayEntries,
        hasEntries: dayEntries.length > 0
      });

      current.setDate(current.getDate() + 1);
    }

    setCalendarEntries(calendarData);
  }, [currentDate, userEntries, user]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const formatMonthYear = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const formatDay = (dateStr: string) => {
    return new Date(dateStr).getDate();
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  const isCurrentMonth = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getMonth() === currentDate.getMonth();
  };

  const getSelectedDateEntries = () => {
    if (!selectedDate) return [];
    return userEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toISOString().split('T')[0] === selectedDate;
    });
  };

  const getMoodColor = (mood: string) => {
    const moodColors = {
      'very-sad': 'bg-red-100 border-red-300',
      'sad': 'bg-orange-100 border-orange-300',
      'neutral': 'bg-gray-100 border-gray-300',
      'happy': 'bg-green-100 border-green-300',
      'very-happy': 'bg-blue-100 border-blue-300'
    };
    return moodColors[mood as keyof typeof moodColors] || 'bg-gray-100 border-gray-300';
  };

  const getMoodIcon = (mood: string) => {
    const moodIcons = {
      'very-sad': '😢',
      'sad': '😔',
      'neutral': '😐',
      'happy': '😊',
      'very-happy': '😄'
    };
    return moodIcons[mood as keyof typeof moodIcons] || '😐';
  };

  return (
    <div className="space-y-6">
      {/* Header du calendrier */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <CalendarIcon className="w-6 h-6 mr-3 text-pink-600" />
            Mon Calendrier
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <span className="text-lg font-semibold text-gray-700 min-w-[200px] text-center">
              {formatMonthYear(currentDate)}
            </span>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="grid grid-cols-7 gap-1 mb-4">
          {/* En-têtes des jours */}
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          
          {/* Jours du calendrier */}
          {calendarEntries.map((entry, index) => {
            const day = formatDay(entry.date);
            const isCurrentMonthDay = isCurrentMonth(entry.date);
            const isTodayDate = isToday(entry.date);
            const isSelected = selectedDate === entry.date;

            return (
              <button
                key={entry.date}
                onClick={() => setSelectedDate(entry.date)}
                className={`
                  relative p-2 h-12 rounded-lg transition-all duration-200 text-sm font-medium
                  ${isCurrentMonthDay ? 'text-gray-700' : 'text-gray-400'}
                  ${isTodayDate ? 'bg-pink-100 border-2 border-pink-300' : ''}
                  ${isSelected ? 'bg-blue-100 border-2 border-blue-300' : 'hover:bg-gray-50'}
                  ${entry.hasEntries ? 'ring-2 ring-pink-200' : ''}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span className={isTodayDate ? 'font-bold text-pink-700' : ''}>
                    {day}
                  </span>
                  {entry.hasEntries && (
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mt-1"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Entrées du jour sélectionné */}
      {selectedDate && (
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Entrées du {new Date(selectedDate).toLocaleDateString('fr-FR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {getSelectedDateEntries().length > 0 ? (
            <div className="space-y-3">
              {getSelectedDateEntries().map((entry) => (
                <div
                  key={entry.id}
                  className={`p-4 rounded-2xl border-2 ${getMoodColor(entry.mood)}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getMoodIcon(entry.mood)}</span>
                      <span className="text-sm font-medium text-gray-600">
                        {new Date(entry.timestamp).toLocaleTimeString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    {entry.color && (
                      <div
                        className="w-4 h-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: entry.color }}
                      />
                    )}
                  </div>
                  <p className="text-gray-800 text-sm leading-relaxed">
                    {entry.content.length > 100 
                      ? `${entry.content.substring(0, 100)}...` 
                      : entry.content
                    }
                  </p>
                  {entry.tags && entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.tags.slice(0, 3).map(tagId => (
                        <span
                          key={tagId}
                          className="px-2 py-1 bg-white/50 rounded-full text-xs text-gray-600"
                        >
                          #{tagId}
                        </span>
                      ))}
                      {entry.tags.length > 3 && (
                        <span className="px-2 py-1 bg-white/50 rounded-full text-xs text-gray-600">
                          +{entry.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">Aucune entrée ce jour</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
