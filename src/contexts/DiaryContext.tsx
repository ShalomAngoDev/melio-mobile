import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { journalService, JournalEntry } from '../services/api';

export interface DiaryEntry {
  id: string;
  userId: string;
  content: string;
  mood: 'very-sad' | 'sad' | 'neutral' | 'happy' | 'very-happy';
  timestamp: Date;
  isPrivate: boolean;
  // V2: Nouveaux champs de personnalisation
  color?: string;
  coverImage?: string;
  tags?: string[];
  // Champs pour la synchronisation avec le backend
  synced?: boolean;
  aiRiskScore?: number;
  aiRiskLevel?: 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'CRITIQUE';
  aiSummary?: string;
  aiAdvice?: string;
}

interface DiaryContextType {
  entries: DiaryEntry[];
  addEntry: (content: string, mood: DiaryEntry['mood'], color?: string, coverImage?: string, tags?: string[]) => Promise<void>;
  updateEntry: (entryId: string, content: string, mood: DiaryEntry['mood'], color?: string, coverImage?: string, tags?: string[]) => Promise<void>;
  getUserEntries: (userId: string) => DiaryEntry[];
  deleteEntry: (entryId: string) => void;
  syncEntries: () => Promise<void>;
  isLoading: boolean;
  syncError: string | null;
}

const DiaryContext = createContext<DiaryContextType | undefined>(undefined);

export function DiaryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [entries, setEntries] = useState<DiaryEntry[]>(() => {
    const saved = localStorage.getItem('melio_diary');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      }));
    }
    return [];
  });
  const [isLoading, setIsLoading] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Fonction pour convertir les humeurs entre les formats
  const convertMoodToBackend = (mood: DiaryEntry['mood']): 'TRES_TRISTE' | 'TRISTE' | 'NEUTRE' | 'CONTENT' | 'TRES_HEUREUX' => {
    const moodMap = {
      'very-sad': 'TRES_TRISTE',
      'sad': 'TRISTE',
      'neutral': 'NEUTRE',
      'happy': 'CONTENT',
      'very-happy': 'TRES_HEUREUX'
    };
    return moodMap[mood];
  };

  const convertMoodFromBackend = (mood: 'TRES_TRISTE' | 'TRISTE' | 'NEUTRE' | 'CONTENT' | 'TRES_HEUREUX'): DiaryEntry['mood'] => {
    const moodMap = {
      'TRES_TRISTE': 'very-sad',
      'TRISTE': 'sad',
      'NEUTRE': 'neutral',
      'CONTENT': 'happy',
      'TRES_HEUREUX': 'very-happy'
    };
    return moodMap[mood];
  };

  const addEntry = async (content: string, mood: DiaryEntry['mood'], color?: string, coverImage?: string, tags?: string[]) => {
    if (!user) return;

    setIsLoading(true);
    setSyncError(null);

    try {
      // Créer l'entrée localement d'abord
      const newEntry: DiaryEntry = {
        id: `entry_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
        userId: user.id,
        content,
        mood,
        timestamp: new Date(),
        isPrivate: true,
        synced: false,
        // V2: Nouveaux champs
        color: color || 'pink',
        coverImage,
        tags: tags || []
      };

      const updatedEntries = [newEntry, ...entries];
      setEntries(updatedEntries);
      localStorage.setItem('melio_diary', JSON.stringify(updatedEntries));

      // Synchroniser avec le backend
      const backendEntry = await journalService.createEntry(user.id, {
        mood: convertMoodToBackend(mood),
        contentText: content
        // TODO V2: Ajouter color, coverImage, tags quand backend sera mis à jour
      });

      // Mettre à jour l'entrée locale avec les données du backend
      const syncedEntry: DiaryEntry = {
        ...newEntry,
        id: backendEntry.id,
        synced: true,
        aiRiskScore: backendEntry.aiRiskScore,
        aiRiskLevel: backendEntry.aiRiskLevel,
        aiSummary: backendEntry.aiSummary,
        aiAdvice: backendEntry.aiAdvice
      };

      const finalEntries = [syncedEntry, ...entries.filter(e => e.id !== newEntry.id)];
      setEntries(finalEntries);
      localStorage.setItem('melio_diary', JSON.stringify(finalEntries));

    } catch (error: any) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncError('Erreur lors de la sauvegarde. L\'entrée est sauvegardée localement.');
    } finally {
      setIsLoading(false);
    }
  };

  const getUserEntries = (userId: string) => 
    entries.filter(entry => entry.userId === userId);

  const updateEntry = async (entryId: string, content: string, mood: DiaryEntry['mood'], color?: string, coverImage?: string, tags?: string[]) => {
    // Mettre à jour localement d'abord
    const updatedEntries = entries.map(entry => {
      if (entry.id === entryId) {
        return {
          ...entry,
          content,
          mood,
          color: color || entry.color,
          coverImage: coverImage !== undefined ? coverImage : entry.coverImage,
          tags: tags || entry.tags,
          synced: false // Marquer comme non synchronisé
        };
      }
      return entry;
    });
    setEntries(updatedEntries);
    localStorage.setItem('melio_diary', JSON.stringify(updatedEntries));

    // Synchroniser avec le backend si possible
    if (user) {
      try {
        await journalService.updateEntry(user.id, entryId, {
          mood: convertMoodToBackend(mood),
          contentText: content
          // TODO V2: Ajouter color, coverImage, tags quand backend sera mis à jour
        });
        
        // Marquer comme synchronisé
        const syncedEntries = updatedEntries.map(entry => {
          if (entry.id === entryId) {
            return { ...entry, synced: true };
          }
          return entry;
        });
        setEntries(syncedEntries);
        localStorage.setItem('melio_diary', JSON.stringify(syncedEntries));
        
      } catch (error) {
        console.error('Erreur lors de la synchronisation de la modification:', error);
        // L'entrée reste en local comme non synchronisée
      }
    }
  };

  const deleteEntry = (entryId: string) => {
    const updatedEntries = entries.filter(entry => entry.id !== entryId);
    setEntries(updatedEntries);
    localStorage.setItem('melio_diary', JSON.stringify(updatedEntries));
  };

  const syncEntries = async () => {
    if (!user) return;

    setIsLoading(true);
    setSyncError(null);

    try {
      // Récupérer les entrées du backend
      const backendEntries = await journalService.getEntries(user.id);
      
      // Convertir les entrées du backend au format local
      const convertedEntries: DiaryEntry[] = backendEntries.map(entry => ({
        id: entry.id,
        userId: entry.studentId,
        content: entry.contentText,
        mood: convertMoodFromBackend(entry.mood),
        timestamp: new Date(entry.createdAt),
        isPrivate: true,
        synced: true,
        aiRiskScore: entry.aiRiskScore,
        aiRiskLevel: entry.aiRiskLevel,
        aiSummary: entry.aiSummary,
        aiAdvice: entry.aiAdvice
      }));

      // Fusionner avec les entrées locales (garder les entrées non synchronisées)
      const localUnsynced = entries.filter(entry => !entry.synced);
      const allEntries = [...convertedEntries, ...localUnsynced].sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setEntries(allEntries);
      localStorage.setItem('melio_diary', JSON.stringify(allEntries));

    } catch (error: any) {
      console.error('Erreur lors de la synchronisation:', error);
      setSyncError('Erreur lors de la synchronisation avec le serveur.');
    } finally {
      setIsLoading(false);
    }
  };

  // Synchronisation automatique au chargement si l'utilisateur est connecté
  useEffect(() => {
    if (user) {
      syncEntries();
    }
  }, [user]);

  return (
    <DiaryContext.Provider value={{
      entries,
      addEntry,
      updateEntry,
      getUserEntries,
      deleteEntry,
      syncEntries,
      isLoading,
      syncError
    }}>
      {children}
    </DiaryContext.Provider>
  );
}

export function useDiary() {
  const context = useContext(DiaryContext);
  if (context === undefined) {
    throw new Error('useDiary must be used within a DiaryProvider');
  }
  return context;
}