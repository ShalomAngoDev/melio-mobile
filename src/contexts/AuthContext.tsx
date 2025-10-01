import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authService } from '../services/api';

interface User {
  id: string;
  name: string;
  role: 'student';
  schoolCode: string;
  schoolId: string;
}

interface AuthContextType {
  user: User | null;
  login: (schoolCode: string, studentIdentifier: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const savedUser = localStorage.getItem('melio_user');
      const savedToken = localStorage.getItem('accessToken');
      const savedRefreshToken = localStorage.getItem('refreshToken');

      if (savedUser && savedToken) {
        try {
          // Vérifier si le token est encore valide
          const isValid = await validateToken(savedToken);
          if (isValid) {
            setUser(JSON.parse(savedUser));
          } else if (savedRefreshToken) {
            // Essayer de renouveler le token
            const refreshed = await refreshAuthToken();
            if (refreshed) {
              setUser(JSON.parse(savedUser));
            } else {
              // Si le refresh échoue, déconnecter
              logout();
            }
          } else {
            logout();
          }
        } catch (error) {
          console.error('Erreur lors de la validation du token:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (schoolCode: string, studentIdentifier: string): Promise<boolean> => {
    try {
      const response = await authService.studentLogin(schoolCode, studentIdentifier);

      if (!response.student) {
        throw new Error('No student data in response');
      }

      const newUser: User = {
        id: response.student.id,
        name: `${response.student.firstName} ${response.student.lastName}`,
        role: 'student',
        schoolCode: schoolCode,
        schoolId: response.student.schoolId || ''
      };

      setUser(newUser);
      localStorage.setItem('melio_user', JSON.stringify(newUser));
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return true;
    } catch (error) {
      console.error('Student login error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('melio_user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  };

  // Fonction pour valider un token
  const validateToken = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/v1/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      return response.ok;
    } catch {
      return false;
    }
  };

  // Fonction pour renouveler le token
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      const response = await authService.refreshToken(refreshToken);
      if (response.accessToken) {
        localStorage.setItem('accessToken', response.accessToken);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors du renouvellement du token:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}