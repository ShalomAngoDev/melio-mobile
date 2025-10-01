import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertProvider } from './contexts/AlertContext';
import { DiaryProvider } from './contexts/DiaryContext';
import { ChatProvider } from './contexts/ChatContext';
import { ToastProvider } from './contexts/ToastContext';
import LoginScreen from './components/auth/LoginScreen';
import StudentDashboard from './components/student/StudentDashboard';
import StaffDashboard from './components/staff/StaffDashboard';
import LoadingScreen from './components/common/LoadingScreen';
import './styles/animations.css';

function AppContent() {
  const { user, isLoading } = useAuth();
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    if (user) {
      setIsTransitioning(true);
      const timer = setTimeout(() => setIsTransitioning(false), 800);
      return () => clearTimeout(timer);
    }
  }, [user]);

  if (isLoading || isTransitioning) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return user.role === 'student' ? <StudentDashboard /> : <StaffDashboard />;
}

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AlertProvider>
          <DiaryProvider>
            <ChatProvider>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <AppContent />
              </div>
            </ChatProvider>
          </DiaryProvider>
        </AlertProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;