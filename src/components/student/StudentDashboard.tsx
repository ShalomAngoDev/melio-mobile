import { useState } from 'react';
import { BookOpen, User, LogOut, Shield, Sparkles, Heart, Megaphone, X, School, GraduationCap, Hash, Phone, MessageCircle, Trophy, Calendar } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';
import DiarySection from './DiarySection';
import ChatSection from './ChatSection';
import LibrarySection from './LibrarySection';
import ReportSection from './ReportSection';
import AchievementsSection from './AchievementsSection';
import CalendarSection from './CalendarSection'; // Import the new calendar component

export default function StudentDashboard() {
  const { user, logout } = useAuth();
  const { unreadCount } = useChat();
  const [activeSection, setActiveSection] = useState('diary');
  const [showProfile, setShowProfile] = useState(false);

  const menuItems = [
    { id: 'diary', label: 'Mon Journal', icon: BookOpen, color: 'pink' },
    { id: 'calendar', label: 'Calendrier', icon: Calendar, color: 'green' }, // New calendar option
    { id: 'chat', label: 'Parler à Mélio', icon: MessageCircle, color: 'purple' },
    { id: 'library', label: 'Bibliothèque', icon: Sparkles, color: 'blue' },
    { id: 'report', label: 'Signalement', icon: Megaphone, color: 'pink' }
  ];

  return (
    <div className={`bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50 ${activeSection === 'chat' ? 'h-screen overflow-hidden' : 'min-h-screen'}`}>
      {/* Header */}
      <header
        className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10"
        style={{ paddingTop: 'env(safe-area-inset-top)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center mr-8">
                <img src="/logo-icon.png" alt="Melio" className="w-8 h-8 mr-3" />
                <img src="/fullLogo.png" alt="Melio" className="h-6 w-auto" />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Bouton Profil */}
              <button
                onClick={() => setShowProfile(true)}
                className="flex items-center bg-white/60 rounded-full px-4 py-2 hover:bg-white/80 transition-all duration-200"
              >
                <User className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </button>

              {/* Bouton Mes Badges */}
              <button
                onClick={() => setActiveSection('achievements')}
                className={`p-2 rounded-full transition-all duration-200 ${
                  activeSection === 'achievements'
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                    : 'bg-white/60 hover:bg-white/80 text-gray-700'
                }`}
                title="Mes Badges"
              >
                <Trophy className="w-5 h-5" />
              </button>

              {/* Bouton Déconnexion */}
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white/60 rounded-full transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation (hidden on mobile) */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Ton espace privé</h2>
              <nav className="space-y-3">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-2xl text-left transition-all duration-200 ${
                        isActive
                          ? `bg-${item.color}-100 text-${item.color}-700 border-2 border-${item.color}-200`
                          : 'text-gray-600 hover:bg-gray-50 border-2 border-transparent'
                      }`}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>

              <div className="mt-8 p-4 bg-green-50 rounded-2xl border border-green-200">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-green-600 mr-2" />
                  <span className="text-sm font-medium text-green-800">100% Confidentiel</span>
                </div>
                <p className="text-xs text-green-700">
                  Ton journal reste privé. Seules les situations d'urgence sont signalées aux agents sociaux.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 pb-24" style={{ paddingBottom: 'calc(96px + env(safe-area-inset-bottom))' }}>
            {activeSection === 'diary' && <DiarySection />}
            {activeSection === 'calendar' && <CalendarSection />} {/* Render CalendarSection */}
            {activeSection === 'chat' && <ChatSection />}
            {activeSection === 'achievements' && <AchievementsSection />}
            {activeSection === 'library' && <LibrarySection />}
            {activeSection === 'report' && <ReportSection />}
          </div>
        </div>
      </div>

      {/* Bottom Mobile Navigation */}
      <nav
        className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white/95 backdrop-blur border-t border-gray-200"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="grid grid-cols-4 gap-1 px-2 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`flex flex-col items-center justify-center py-2 rounded-2xl transition relative ${
                  isActive
                    ? 'bg-pink-100 text-pink-700 border border-pink-200'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-pink-700' : ''}`} />
                     {item.id === 'chat' && unreadCount > 0 && (
                       <div className="notification-badge absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full px-1.5 py-0.5 min-w-[18px] h-4 flex items-center justify-center">
                         {unreadCount}
                       </div>
                     )}
                </div>
                <span className={`text-[11px] font-medium ${isActive ? 'text-pink-700' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Profile Modal */}
      {showProfile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Mon Profil</h2>
              <button
                onClick={() => setShowProfile(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Nom */}
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <User className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Nom complet</p>
                  <p className="font-medium text-gray-800">{user?.name}</p>
                </div>
              </div>

              {/* École */}
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <School className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">École</p>
                  <p className="font-medium text-gray-800">
                    {user?.schoolCode === 'COLLEGE2024' ? 'Collège Victor Hugo' : 
                     user?.schoolCode === 'LYCEE2024' ? 'Lycée Jean Moulin' : 
                     user?.schoolCode}
                  </p>
                </div>
              </div>

              {/* Classe */}
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <GraduationCap className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Classe</p>
                  <p className="font-medium text-gray-800">
                    {user?.id === 'student_1' ? '6ème A' :
                     user?.id === 'student_4' ? '2nde B' : 'Non définie'}
                  </p>
                </div>
              </div>

              {/* Identifiant élève */}
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <Hash className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Identifiant élève</p>
                  <p className="font-medium text-gray-800">
                    {user?.id === 'student_1' ? 'ELEVE001' :
                     user?.id === 'student_4' ? 'ELEVE101' : user?.id}
                  </p>
                </div>
              </div>

              {/* Numéro de parent */}
              <div className="flex items-center p-4 bg-gray-50 rounded-2xl">
                <Phone className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="text-sm text-gray-500">Numéro de parent</p>
                  <p className="font-medium text-gray-800">
                    {user?.id === 'student_1' ? '+33 6 12 34 56 78' :
                     user?.id === 'student_4' ? '+33 6 87 65 43 21' : 'Non renseigné'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
              <div className="flex items-center mb-2">
                <Shield className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">Informations protégées</span>
              </div>
              <p className="text-xs text-blue-700">
                Ces informations sont gérées par ton école et ne peuvent pas être modifiées depuis l'application.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}