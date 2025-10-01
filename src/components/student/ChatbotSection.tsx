import React, { useState, useRef, useEffect } from 'react';
import { Send, User, AlertTriangle, Trash2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAlerts } from '../../contexts/AlertContext';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  riskLevel?: 'low' | 'medium' | 'high' | 'critical';
}

// Mots-clés de détection de risque
const riskKeywords = {
  critical: ['suicide', 'me tuer', 'en finir', 'mourir', 'mort', 'disparaître'],
  high: ['violence', 'frapper', 'blesser', 'haine', 'déteste', 'agression', 'menace'],
  medium: ['triste', 'déprimé', 'seul', 'isolé', 'rejeté', 'personne ne m\'aime'],
  low: ['difficile', 'compliqué', 'problème', 'ennui', 'stress']
};

const responseTemplates = {
  critical: [
    "Je suis vraiment inquiet pour toi. Ces pensées sont très préoccupantes. Tu n'es pas seul(e), et il y a des personnes qui peuvent t'aider immédiatement. J'ai alerté un agent social de ton école qui va te contacter très bientôt.",
    "Ce que tu ressens est très difficile, et je comprends ta souffrance. Il est important que tu parles à quelqu'un tout de suite. Un professionnel de ton école va être prévenu pour t'accompagner."
  ],
  high: [
    "Je vois que tu traverses une période très difficile avec des situations de violence. C'est courageux de m'en parler. Un agent social va être informé pour t'aider à trouver des solutions.",
    "Personne ne devrait subir de violence. Tu as le droit d'être en sécurité. Je signale ta situation pour qu'un adulte de confiance puisse t'accompagner."
  ],
  medium: [
    "Je comprends que tu te sentes triste et isolé(e). Ces sentiments sont difficiles à porter. Sache que tu comptes et que des personnes sont là pour t'écouter.",
    "Se sentir seul(e) est vraiment douloureux. Tu es courageux/se de partager ces émotions avec moi. N'hésite pas à continuer à me parler."
  ],
  low: [
    "Je vois que tu rencontres quelques difficultés. C'est normal d'avoir des moments compliqués. Comment puis-je t'aider aujourd'hui ?",
    "Les problèmes peuvent parfois sembler insurmontables, mais tu n'es pas seul(e). Raconte-moi ce qui te préoccupe."
  ],
  general: [
    "Merci de me faire confiance. Je suis là pour t'écouter sans jugement. Comment te sens-tu en ce moment ?",
    "C'est bien de prendre le temps de parler de ce que tu ressens. Que souhaites-tu partager avec moi aujourd'hui ?",
    "Je suis content(e) que tu viennes discuter avec moi. Ton bien-être est important. Comment puis-je t'accompagner ?"
  ]
};

export default function ChatbotSection() {
  const { user } = useAuth();
  const { addAlert } = useAlerts();
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem(`melio_chat_${user?.id}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
    }
    return [
      {
        id: 'welcome',
        content: "Salut ! Je suis Melio, ton compagnon bienveillant. Tu peux me parler de tout ce qui te préoccupe, tes émotions, tes journées... Je suis là pour t'écouter et t'accompagner. 💜",
        sender: 'bot' as const,
        timestamp: new Date()
      }
    ];
  });
  
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(`melio_chat_${user.id}`, JSON.stringify(messages));
    }
  }, [messages, user]);

  const detectRiskLevel = (content: string): 'low' | 'medium' | 'high' | 'critical' | null => {
    const lowerContent = content.toLowerCase();
    
    for (const [level, keywords] of Object.entries(riskKeywords)) {
      if (keywords.some(keyword => lowerContent.includes(keyword))) {
        return level as 'low' | 'medium' | 'high' | 'critical';
      }
    }
    return null;
  };

  const getRandomResponse = (riskLevel: string | null) => {
    const templates = riskLevel && responseTemplates[riskLevel as keyof typeof responseTemplates] 
      ? responseTemplates[riskLevel as keyof typeof responseTemplates]
      : responseTemplates.general;
    
    return templates[Math.floor(Math.random() * templates.length)];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const userMessage: Message = {
      id: `msg_${Date.now()}_user`,
      content: newMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsTyping(true);

    // Analyse du risque
    const riskLevel = detectRiskLevel(userMessage.content);
    
    // Créer une alerte si risque détecté
    if (riskLevel && ['medium', 'high', 'critical'].includes(riskLevel) && user) {
      const keywords = Object.entries(riskKeywords).find(([level]) => level === riskLevel)?.[1] || [];
      const detectedKeywords = keywords.filter(keyword => 
        userMessage.content.toLowerCase().includes(keyword)
      );

      addAlert({
        studentId: user.id,
        studentName: user.name,
        message: userMessage.content,
        riskLevel: riskLevel as 'medium' | 'high' | 'critical',
        resolved: false,
        keywords: detectedKeywords,
        context: 'Conversation avec le chatbot Melio',
        schoolCode: user.schoolCode
      });
    }

    // Réponse du bot après un délai
    setTimeout(() => {
      const botResponse: Message = {
        id: `msg_${Date.now()}_bot`,
        content: getRandomResponse(riskLevel),
        sender: 'bot',
        timestamp: new Date(),
        riskLevel: riskLevel || undefined
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };

  const clearAllMessages = () => {
    const welcomeMessage = {
      id: 'welcome',
      content: "Salut ! Je suis Melio, ton compagnon bienveillant. Tu peux me parler de tout ce qui te préoccupe, tes émotions, tes journées... Je suis là pour t'écouter et t'accompagner. 💜",
      sender: 'bot' as const,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
    setShowClearConfirm(false);
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

        {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start space-x-2 max-w-[85%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500' 
                    : 'bg-transparent'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-4 h-4 text-white" />
                  ) : (
                    <img src="/logo-icon.png" alt="Melio" className="w-5 h-5" />
                  )}
                </div>
                
                {/* Message Bubble */}
                <div className={`rounded-2xl px-3 py-2 max-w-full ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-pink-400 to-pink-500 text-white'
                    : 'bg-gray-100 text-gray-800 border border-gray-200'
                }`}>
                  <p className="text-sm leading-relaxed break-words">{message.content}</p>
                  {message.riskLevel && ['medium', 'high', 'critical'].includes(message.riskLevel) && (
                    <div className="flex items-center mt-2 text-xs text-orange-600 bg-orange-50 rounded-lg px-2 py-1">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      <span>J'ai prévenu un adulte de confiance</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full flex items-center justify-center bg-transparent">
                  <img src="/logo-icon.png" alt="Melio" className="w-5 h-5" />
                </div>
                <div className="bg-gray-100 rounded-3xl px-4 py-3 border border-gray-200">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                         style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" 
                         style={{ animationDelay: '0.2s' }}></div>
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
            className="flex-1 px-4 py-3 rounded-full border-2 border-pink-200 focus:ring-2 focus:ring-pink-400 focus:border-pink-400 transition-all duration-200 text-base bg-gray-50"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || isTyping}
            className="w-12 h-12 bg-gradient-to-r from-pink-400 to-pink-500 text-white rounded-full hover:from-pink-500 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 shadow-lg flex items-center justify-center"
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
                Tous tes messages avec Melio seront supprimés. Cette action ne peut pas être annulée.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 py-2 px-4 bg-gray-200 text-gray-700 rounded-2xl font-medium hover:bg-gray-300 transition-all duration-200"
                >
                  Annuler
                </button>
                <button
                  onClick={clearAllMessages}
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