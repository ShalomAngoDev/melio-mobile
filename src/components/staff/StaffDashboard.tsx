import React, { useState } from 'react';
import { Shield, AlertTriangle, BarChart3, FileText, Users, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AlertsSection from './AlertsSection';
import StatisticsSection from './StatisticsSection';
import ReportsSection from './ReportsSection';

export default function StaffDashboard() {
  const { user, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('alerts');

  const menuItems = [
    { id: 'alerts', label: 'Alertes', icon: AlertTriangle, color: 'red' },
    { id: 'statistics', label: 'Statistiques', icon: BarChart3, color: 'blue' },
    { id: 'reports', label: 'Rapports', icon: FileText, color: 'green' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                Espace Agent Social
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center bg-white/60 rounded-full px-4 py-2">
                <Shield className="w-4 h-4 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
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
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">Tableau de bord</h2>
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

              <div className="mt-8 p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <div className="flex items-center mb-2">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="text-sm font-medium text-blue-800">Accès Sécurisé</span>
                </div>
                <p className="text-xs text-blue-700">
                  Vous n'avez accès qu'aux alertes d'urgence. Les journaux personnels restent privés.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeSection === 'alerts' && <AlertsSection />}
            {activeSection === 'statistics' && <StatisticsSection />}
            {activeSection === 'reports' && <ReportsSection />}
          </div>
        </div>
      </div>
    </div>
  );
}