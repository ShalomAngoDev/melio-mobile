import axios from 'axios';
import { getApiUrl } from '../config/api';

const API_BASE_URL = getApiUrl();

// Configuration de base d'axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs de réponse et le renouvellement automatique des tokens
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          // Essayer de renouveler le token
          const response = await authService.refreshToken(refreshToken);
          if (response.accessToken) {
            localStorage.setItem('accessToken', response.accessToken);
            if (response.refreshToken) {
              localStorage.setItem('refreshToken', response.refreshToken);
            }
            
            // Refaire la requête originale avec le nouveau token
            originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Erreur lors du renouvellement du token:', refreshError);
      }

      // Si le refresh échoue, déconnecter l'utilisateur
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('melio_user');
      window.location.href = '/';
    }
    
    return Promise.reject(error);
  }
);

// Types pour les données
export interface Student {
  id: string;
  schoolId: string;
  firstName: string;
  lastName: string;
  birthdate: string;
  sex: string;
  className: string;
  parentName?: string;
  parentPhone: string;
  parentEmail?: string;
  uniqueId: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    className: string;
  };
}

// Services API
export const authService = {
  // Connexion élève
  studentLogin: async (schoolCode: string, studentIdentifier: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/student/login', {
      schoolCode,
      studentIdentifier,
    });
    return response.data;
  },

  // Rafraîchir le token
  refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post('/auth/refresh', {
      refreshToken,
    });
    return response.data;
  },
};

export const studentService = {
  // Récupérer le profil de l'élève
  getProfile: async (): Promise<Student> => {
    const response = await api.get('/students/me');
    return response.data;
  },
};

// Types pour le journal intime
export interface JournalEntry {
  id: string;
  studentId: string;
  mood: 'TRES_TRISTE' | 'TRISTE' | 'NEUTRE' | 'CONTENT' | 'TRES_HEUREUX';
  contentText: string;
  createdAt: string;
  aiRiskScore?: number;
  aiRiskLevel?: 'FAIBLE' | 'MOYEN' | 'ELEVE' | 'CRITIQUE';
  aiSummary?: string;
  aiAdvice?: string;
  processedAt?: string;
}

export interface CreateJournalEntryDto {
  mood: 'TRES_TRISTE' | 'TRISTE' | 'NEUTRE' | 'CONTENT' | 'TRES_HEUREUX';
  contentText: string;
}

export const journalService = {
  // Créer une nouvelle entrée de journal
  createEntry: async (studentId: string, data: CreateJournalEntryDto): Promise<JournalEntry> => {
    const response = await api.post(`/students/${studentId}/journal`, data);
    return response.data;
  },

  // Récupérer les entrées de journal d'un élève
  getEntries: async (studentId: string, limit?: number, offset?: number): Promise<JournalEntry[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await api.get(`/students/${studentId}/journal?${params.toString()}`);
    return response.data;
  },

  // Récupérer une entrée spécifique
  getEntry: async (studentId: string, entryId: string): Promise<JournalEntry> => {
    const response = await api.get(`/students/${studentId}/journal/${entryId}`);
    return response.data;
  },

  // Mettre à jour une entrée de journal
  updateEntry: async (studentId: string, entryId: string, data: CreateJournalEntryDto): Promise<JournalEntry> => {
    const response = await api.patch(`/students/${studentId}/journal/${entryId}`, data);
    return response.data;
  },
};



// Types pour le chat interactif
export interface ChatMessage {
  id: string;
  studentId: string;
  sender: 'USER' | 'BOT';
  content: string;
  resourceId?: string;
  createdAt: string;
}

export interface CreateChatMessageDto {
  content: string;
}

export interface ChatStats {
  totalMessages: number;
  userMessages: number;
  botMessages: number;
  lastActivity: string | null;
}

export const chatService = {
  // Envoyer un message à Mélio et recevoir une réponse
  sendMessage: async (studentId: string, content: string): Promise<{ userMessage: ChatMessage; botResponse: ChatMessage }> => {
    const response = await api.post(`/students/${studentId}/chat`, { content });
    return response.data;
  },

  // Récupérer les messages de chat d'un élève
  getMessages: async (studentId: string, limit?: number, offset?: number): Promise<ChatMessage[]> => {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());
    if (offset) params.append('offset', offset.toString());
    
    const response = await api.get(`/students/${studentId}/chat?${params.toString()}`);
    return response.data;
  },

  // Récupérer les statistiques de chat
  getStats: async (studentId: string): Promise<ChatStats> => {
    const response = await api.get(`/students/${studentId}/chat/stats`);
    return response.data;
  },

  // Supprimer tous les messages de chat
  deleteAllMessages: async (studentId: string): Promise<void> => {
    await api.delete(`/students/${studentId}/chat`);
  },
};

// ===== TYPES POUR LES SIGNALEMENTS =====

export interface Report {
  id: string;
  schoolId: string;
  studentId?: string;
  content: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anonymous: boolean;
  status: 'NOUVEAU' | 'EN_COURS' | 'TRAITE';
  createdAt: string;
  updatedAt: string;
}

export interface CreateReportData {
  schoolId: string;
  studentId?: string;
  content: string;
  urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  anonymous: boolean;
}

export const reportService = {
  // Créer un signalement
  createReport: async (data: CreateReportData): Promise<Report> => {
    const response = await api.post('/reports', data);
    return response.data;
  },
};

export default api;
