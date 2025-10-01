import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { chatService, ChatMessage } from '../services/api';

interface ChatContextType {
  messages: ChatMessage[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  sendMessage: (content: string) => Promise<{ userMessage: ChatMessage; botResponse: ChatMessage }>;
  loadMessages: () => Promise<void>;
  markAsRead: () => void;
  clearAllMessages: () => Promise<void>;
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  // Réinitialiser l'erreur d'authentification quand l'utilisateur change
  useEffect(() => {
    if (user) {
      setAuthError(false);
    }
  }, [user]);

  // Charger les messages au démarrage
  useEffect(() => {
    if (user && !authError) {
      loadMessages();
      // Désactiver le rechargement automatique pour éviter les interférences
      // const interval = setInterval(() => {
      //   if (!isLoading && messages.length > 0) {
      //     loadMessages();
      //   }
      // }, 30000);
      // return () => clearInterval(interval);
    }
  }, [user, isLoading, messages.length, authError]);

  const loadMessages = async () => {
    if (!user) return;

    // Vérifier si l'utilisateur est authentifié
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.log('Utilisateur non authentifié, ne pas charger les messages');
      setAuthError(true);
      return;
    }

    // Vérifier si les messages ont été effacés
    const isCleared = localStorage.getItem(`chat_cleared_${user.id}`);
    const clearTimestamp = localStorage.getItem(`chat_cleared_timestamp_${user.id}`);
    
    if (isCleared === 'true') {
      // Vérifier si l'effacement est récent (moins de 24h)
      const now = Date.now();
      const clearTime = clearTimestamp ? parseInt(clearTimestamp) : 0;
      const hoursSinceClear = (now - clearTime) / (1000 * 60 * 60);
      
      if (hoursSinceClear < 24) {
        setMessages([]);
        setUnreadCount(0);
        return;
      } else {
        // Si l'effacement est ancien, le considérer comme expiré
        localStorage.removeItem(`chat_cleared_${user.id}`);
        localStorage.removeItem(`chat_cleared_timestamp_${user.id}`);
      }
    }

    // Ne pas recharger si on est en train de taper ou si on a des messages récents
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Charger seulement les 10 derniers messages pour éviter de surcharger l'interface
      const newMessages = await chatService.getMessages(user.id, 10, 0);
      
      // Filtrer les messages pour ne garder que ceux des 24 dernières heures
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentMessages = newMessages.filter(msg => 
        new Date(msg.createdAt) >= oneDayAgo
      );
      
      
      // Fusionner avec les messages existants pour éviter la perte
      setMessages(prevMessages => {
        // Si on a des messages existants et que les nouveaux sont identiques, ne pas changer
        if (prevMessages.length > 0 && recentMessages.length === prevMessages.length) {
          const isSame = prevMessages.every((msg, index) => 
            recentMessages[index] && msg.id === recentMessages[index].id
          );
          if (isSame) {
            return prevMessages;
          }
        }

      // Créer un Map pour éviter les doublons
      const messageMap = new Map();
      
      // Ajouter les messages existants
      prevMessages.forEach(msg => messageMap.set(msg.id, msg));
      
      // Ajouter seulement les nouveaux messages récents (pas de remplacement)
      recentMessages.forEach(msg => {
        if (!messageMap.has(msg.id)) {
          messageMap.set(msg.id, msg);
        }
      });
      
      // Retourner les messages triés par date (les plus récents en dernier)
      return Array.from(messageMap.values()).sort((a, b) => 
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
      });
      
      // Calculer le nombre de messages non lus (messages BOT non lus) parmi les messages récents
      const unread = recentMessages.filter(msg => 
        msg.sender === 'BOT' && 
        !localStorage.getItem(`chat_read_${msg.id}`)
      ).length;
      setUnreadCount(unread);

    } catch (err: any) {
      console.error('Erreur lors du chargement des messages:', err);
      
      // Si c'est une erreur 404, ne pas afficher d'erreur car c'est normal si l'utilisateur n'est pas connecté
      if (err.response?.status === 404) {
        console.log('Endpoint chat non trouvé - utilisateur probablement non authentifié');
        setMessages([]);
        setUnreadCount(0);
        setAuthError(true);
      } else {
        setError('Erreur lors du chargement des messages');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!user || !content.trim()) {
      throw new Error('Utilisateur non connecté ou message vide');
    }

    // Réinitialiser le flag d'effacement quand on envoie un nouveau message
    localStorage.removeItem(`chat_cleared_${user.id}`);
    localStorage.removeItem(`chat_cleared_timestamp_${user.id}`);

    setIsLoading(true);
    setError(null);

    try {
      const { userMessage, botResponse } = await chatService.sendMessage(user.id, content.trim());
      
      // Retourner les messages sans les ajouter automatiquement
      return { userMessage, botResponse };

    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du message:', err);
      setError('Erreur lors de l\'envoi du message');
      throw err; // Re-throw pour que le composant puisse gérer l'erreur
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = () => {
    // Marquer tous les messages comme lus
    messages.forEach(msg => {
      if (msg.sender === 'BOT') {
        localStorage.setItem(`chat_read_${msg.id}`, 'true');
      }
    });
    setUnreadCount(0);
  };

  const clearAllMessages = async () => {
    if (!user) return;

    try {
      // Supprimer les messages côté serveur
      await chatService.deleteAllMessages(user.id);
      
      // Effacer tous les messages du localStorage
      messages.forEach(msg => {
        localStorage.removeItem(`chat_read_${msg.id}`);
      });
      
      // Marquer que les messages ont été effacés dans le localStorage
      localStorage.setItem(`chat_cleared_${user.id}`, 'true');
      localStorage.setItem(`chat_cleared_timestamp_${user.id}`, Date.now().toString());
      
      // Vider la liste des messages
      setMessages([]);
      setUnreadCount(0);
    } catch (err: any) {
      console.error('Erreur lors de l\'effacement des messages:', err);
      setError('Erreur lors de l\'effacement des messages');
    }
  };

  return (
    <ChatContext.Provider value={{
      messages,
      unreadCount,
      isLoading,
      error,
      sendMessage,
      loadMessages,
      markAsRead,
      clearAllMessages,
      setMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
