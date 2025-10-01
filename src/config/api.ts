// Configuration de l'API pour l'app mobile
export const API_CONFIG = {
  // URL de base de l'API - Force l'IP locale pour le développement
  BASE_URL: 'http://192.168.1.107:3000/api/v1',
  
  // Timeout pour les requêtes
  TIMEOUT: 10000,
  
  // Headers par défaut
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// Fonction pour obtenir l'URL de l'API selon l'environnement
export const getApiUrl = () => {
  // Pour le développement, toujours utiliser l'IP locale
  return 'http://192.168.1.107:3000/api/v1';
};
