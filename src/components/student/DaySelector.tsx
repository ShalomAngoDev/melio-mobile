import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useDiary } from '../../contexts/DiaryContext';
import { useAuth } from '../../contexts/AuthContext';

interface DaySelectorProps {
  selectedDate: string | null;
  onDateSelect: (date: string | null) => void;
}

export default function DaySelector({ selectedDate, onDateSelect }: DaySelectorProps) {
  const { getUserEntries } = useDiary();
  const { user } = useAuth();
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  // Récupérer les entrées de l'utilisateur
  const userEntries = user ? getUserEntries(user.id) : [];

  // Générer les jours (3 semaines : précédente, actuelle, suivante)
  useEffect(() => {
    const today = new Date();
    const startDate = new Date(currentWeek);
    startDate.setDate(currentWeek.getDate() - 7); // Commencer 1 semaine avant

    const days = [];
    for (let i = 0; i < 21; i++) { // 3 semaines
      const day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      
      // Ne garder que les jours passés et aujourd'hui
      if (day <= today) {
        days.push(day);
      }
    }
    setWeekDays(days);
  }, [currentWeek]);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentWeek(prev => {
      const newWeek = new Date(prev);
      if (direction === 'prev') {
        newWeek.setDate(newWeek.getDate() - 14); // Naviguer de 2 semaines
      } else {
        newWeek.setDate(newWeek.getDate() + 14); // Naviguer de 2 semaines
      }
      return newWeek;
    });
  };

  const formatDay = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: 'numeric'
    }).format(date);
  };

  const formatMonth = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      month: 'short'
    }).format(date);
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const hasEntries = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return userEntries.some(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toISOString().split('T')[0] === dateStr;
    });
  };

  const getEntryCount = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return userEntries.filter(entry => {
      const entryDate = new Date(entry.timestamp);
      return entryDate.toISOString().split('T')[0] === dateStr;
    }).length;
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    if (isSelected(date)) {
      onDateSelect(null); // Désélectionner si déjà sélectionné
    } else {
      onDateSelect(dateStr);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-3 shadow-lg border border-white/20">
      {/* Header avec navigation */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-800">
          {weekDays.length > 0 ? (
            weekDays.length === 1 
              ? `${formatMonth(weekDays[0])} ${weekDays[0]?.getFullYear()}`
              : `${formatMonth(weekDays[0])} - ${formatMonth(weekDays[weekDays.length - 1])} ${weekDays[0]?.getFullYear()}`
          ) : 'Aucun jour disponible'}
        </h3>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => navigateWeek('next')}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Sélecteur de jours horizontal scrollable */}
      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {weekDays.map((day, index) => {
          const dayHasEntries = hasEntries(day);
          const entryCount = getEntryCount(day);
          const isTodayDate = isToday(day);
          const isSelectedDate = isSelected(day);

          return (
            <button
              key={day.toISOString()}
              onClick={() => handleDateClick(day)}
              className={`
                flex-shrink-0 w-12 h-14 rounded-xl flex flex-col items-center justify-center transition-all duration-200
                ${isSelectedDate 
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white shadow-lg scale-105' 
                  : isTodayDate 
                    ? 'bg-pink-100 border-2 border-pink-300 text-pink-700' 
                    : dayHasEntries 
                      ? 'bg-green-50 border-2 border-green-200 text-green-700 hover:bg-green-100' 
                      : 'bg-gray-50 border-2 border-gray-200 text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {/* Jour de la semaine */}
              <span className="text-[10px] font-medium mb-0.5">
                {formatDay(day).split(' ')[0]}
              </span>
              
              {/* Numéro du jour */}
              <span className="text-sm font-bold">
                {formatDay(day).split(' ')[1]}
              </span>

              {/* Indicateur d'entrées */}
              {dayHasEntries && (
                <div className="mt-0.5 flex items-center justify-center">
                  <div className={`
                    w-1.5 h-1.5 rounded-full
                    ${isSelectedDate ? 'bg-white' : 'bg-green-500'}
                  `} />
                  {entryCount > 1 && (
                    <span className={`
                      ml-0.5 text-[10px] font-bold
                      ${isSelectedDate ? 'text-white' : 'text-green-600'}
                    `}>
                      {entryCount}
                    </span>
                  )}
                </div>
              )}

              {/* Indicateur "aujourd'hui" */}
              {isTodayDate && !isSelectedDate && (
                <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-pink-500 rounded-full border border-white" />
              )}
            </button>
          );
        })}
      </div>

      {/* Message d'information */}
      {selectedDate && (
        <div className="mt-3 text-center">
          <p className="text-sm text-gray-600">
            Entrées du {new Date(selectedDate).toLocaleDateString('fr-FR', {
              weekday: 'long',
              day: 'numeric',
              month: 'long'
            })}
          </p>
        </div>
      )}
    </div>
  );
}
