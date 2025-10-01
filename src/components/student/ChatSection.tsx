import React, { useState, useRef, useEffect } from 'react';
import { Send, User, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import { chatService } from '../../services/api';

export default function ChatSection() {
  const { user } = useAuth();
  const { messages, unreadCount, isLoading, error, loadMessages, markAsRead, clearAllMessages, setMessages } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [localMessages, setLocalMessages] = useState<any[]>([]);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Marquer les messages comme lus quand on ouvre le chat
  useEffect(() => {
    markAsRead();
  }, []);

  // Synchroniser les messages locaux avec les messages du contexte
  useEffect(() => {
    // Ne synchroniser que si le contexte a des messages et que les messages locaux sont vides
    // Ne pas remplacer les messages existants pour éviter les pertes
    if (messages.length > 0 && localMessages.length === 0) {
      setLocalMessages(messages);
    }
  }, [messages, localMessages.length]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || isSending) return;

    // Réinitialiser le flag d'effacement quand on envoie un nouveau message
    localStorage.removeItem(`chat_cleared_${user.id}`);
    localStorage.removeItem(`chat_cleared_timestamp_${user.id}`);

    const messageContent = newMessage.trim();
    setNewMessage('');
    setIsSending(true);
    
    // Afficher immédiatement le message de l'élève
    const userMessage = {
      id: `temp_${Date.now()}`,
      studentId: user.id,
      sender: 'USER' as const,
      content: messageContent,
      createdAt: new Date().toISOString()
    };
    
    // Ajouter le message de l'élève immédiatement aux messages locaux ET au contexte
    const newLocalMessages = [...localMessages, userMessage];
    setLocalMessages(newLocalMessages);
    setMessages(newLocalMessages); // Synchroniser avec le contexte
    
    // Démarrer l'animation de frappe de Mélio
    setIsTyping(true);

    // Délai fixe de 3 secondes pour simuler le temps de réflexion de Mélio
    const thinkingTime = 3000; // 3 secondes
    
    try {
      // Attendre 3 secondes avant d'envoyer le message au backend
      await new Promise(resolve => setTimeout(resolve, thinkingTime));
      
      // Appeler directement l'API
      const { userMessage: serverUserMessage, botResponse } = await chatService.sendMessage(user.id, messageContent);
      
      // Remplacer le message temporaire par le message du serveur et ajouter la réponse de Mélio
      const filtered = localMessages.filter(msg => msg.id !== userMessage.id);
          const newMessages = [...filtered, serverUserMessage, botResponse];
          setLocalMessages(newMessages);
          setMessages(newMessages); // Synchroniser avec le contexte
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // En cas d'erreur, supprimer le message temporaire
      const filtered = localMessages.filter(msg => msg.id !== userMessage.id);
      setLocalMessages(filtered);
      setMessages(filtered); // Synchroniser avec le contexte
    } finally {
      // Arrêter l'animation de frappe et réactiver l'input
      setTimeout(() => {
        setIsTyping(false);
        setIsSending(false);
      }, 500);
    }
  };

  const handleClearAllMessages = async () => {
    try {
      // Effacer les messages locaux immédiatement
      setLocalMessages([]);
      
      // Effacer les messages du contexte
      await clearAllMessages();
      
      // Forcer la synchronisation pour s'assurer que tous les messages sont effacés
      setMessages([]);
      
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Erreur lors de l\'effacement des messages:', error);
      // En cas d'erreur, remettre les messages locaux
      setLocalMessages(messages);
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 flex flex-col" style={{ height: 'calc(100vh - 250px)', marginBottom: '-35px', marginTop: 'calc(60px + env(safe-area-inset-top))' }}>
      {/* Fixed Header */}
      <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-t-3xl p-3 border-b border-pink-200 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-transparent rounded-full flex items-center justify-center mr-3">
              <img src="/logo-icon.png" alt="Melio" className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center">
                <img src="/fullLogo.png" alt="Melio" className="h-6 w-auto mr-2" />
                <span className="text-base font-bold text-gray-800">Salut ! 👋</span>
                {unreadCount > 0 && (
                  <div className="ml-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">
                    {unreadCount}
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-600">Je suis là pour t'écouter et t'aider</p>
            </div>
          </div>
          {messages.length > 1 && (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-all duration-200"
              title="Effacer la conversation"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Messages Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {localMessages.length === 0 ? (
          <div className="text-center py-8">
            <img src="/logo-icon.png" alt="Melio" className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">Mélio t'attend</h3>
            <p className="text-gray-500">Écris-moi pour commencer notre conversation</p>
          </div>
        ) : (
            localMessages.map((message, index) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start space-x-2 max-w-[85%] ${
                  message.sender === 'USER' ? 'flex-row-reverse space-x-reverse' : ''
                }`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'USER' 
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500' 
                      : 'bg-transparent'
                  }`}>
                    {message.sender === 'USER' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <img src="/logo-icon.png" alt="Melio" className="w-5 h-5" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-3 py-2 max-w-full ${
                    message.sender === 'USER'
                      ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}>
                    <p className="text-sm leading-relaxed break-words">{message.content}</p>
                    {message.resourceId && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <div className="flex items-center text-xs opacity-75">
                          <span>📚</span>
                          <span className="ml-1">Ressource disponible</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
        )}
        
        {isTyping && (
          <div className="flex justify-start bot-message">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent">
                <img src="/logo-icon.png" alt="Melio" className="w-5 h-5" />
              </div>
              <div className="typing-indicator bg-gradient-to-r from-pink-50 to-purple-50 rounded-3xl px-4 py-3 border border-pink-200 shadow-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 font-medium">Mélio écrit</span>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full typing-dot"></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full typing-dot"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed Input */}
      <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Dis-moi ce qui se passe... 💭"
              className="message-input flex-1 px-4 py-3 rounded-full border-2 border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-base bg-gray-50"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={!newMessage.trim() || isSending}
              className="send-button w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 shadow-lg flex items-center justify-center"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        <div className="text-xs text-gray-500 mt-1 text-center">
          Tes messages sont privés.
        </div>
      </div>

      {/* Clear Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 mx-4 max-w-sm w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Effacer la conversation ?</h3>
              <p className="text-sm text-gray-600 mb-6">
                Tous les messages de cette conversation seront effacés. Cette action est irréversible.
              </p>
                   <div className="flex space-x-3">
                     <button
                       onClick={() => setShowClearConfirm(false)}
                       className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all duration-200"
                     >
                       Annuler
                     </button>
                     <button
                       onClick={handleClearAllMessages}
                       className="flex-1 py-2 px-4 bg-red-500 text-white rounded-2xl font-medium hover:bg-red-600 transition-all duration-200"
                     >
                       Effacer
                     </button>
                   </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
