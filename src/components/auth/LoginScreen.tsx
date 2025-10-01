import React, { useState } from 'react';
import { School, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const [schoolCode, setSchoolCode] = useState('');
  const [studentIdentifier, setStudentIdentifier] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);
  
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const success = await login(schoolCode.toUpperCase(), studentIdentifier.toUpperCase());
    
    if (!success) {
      setError('Code école ou identifiant élève incorrect');
      setIsLoading(false);
    }
  };

  const demoCredentials = [
    { school: 'JMO75-01', user: 'EMMA01', name: 'Emma Durand (Élève)', description: 'Collège Victor Hugo - 5eA' },
    { school: 'JMO75-01', user: 'LUCA01', name: 'Lucas Martin (Élève)', description: 'Collège Victor Hugo - 6eB' },
    { school: 'JMO75-01', user: 'ELOD01', name: 'Elodie Bernard (Élève)', description: 'Collège Victor Hugo - 4eC' },
    { school: 'JMO75-01', user: 'THOM01', name: 'Thomas Petit (Élève)', description: 'Collège Victor Hugo - 5eA' }
  ];

  const quickLogin = (school: string, user: string) => {
    setSchoolCode(school);
    setStudentIdentifier(user);
    login(school, user);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-50 via-blue-50 to-purple-50" style={{ paddingTop: 'calc(env(safe-area-inset-top) + 1rem)' }}>
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          
          <div className="mb-3 flex justify-center">
            <img src="/fullLogo.png" alt="Melio" className="h-10 w-auto" />
          </div>
          <p className="text-gray-600 text-lg">Ton espace sécurisé et bienveillant</p>
          <div className="flex items-center justify-center mt-4 space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1" />
              <span>Sécurisé</span>
            </div>
            <div className="flex items-center">
              <img src="/logo-icon.png" alt="Melio" className="w-4 h-4 mr-1" />
              <span>Confidentiel</span>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Selection - Mobile app is only for students */}
            <div className="text-center">
              <div className="inline-flex items-center justify-center p-4 rounded-2xl border-2 border-pink-500 bg-pink-50 text-pink-700">
                <School className="w-6 h-6 mr-2" />
                <div className="text-sm font-medium">Élève</div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Application mobile réservée aux élèves</p>
            </div>

            {/* School Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Code école
              </label>
              <input
                type="text"
                value={schoolCode}
                onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Ex: JMO75-01"
                required
              />
            </div>

            {/* Student Identifier */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Identifiant élève
              </label>
              <input
                type="text"
                value={studentIdentifier}
                onChange={(e) => setStudentIdentifier(e.target.value.toUpperCase())}
                className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                placeholder="Ex: EMMA01"
                required
              />
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 focus:ring-4 focus:ring-pink-200 disabled:opacity-50 transition-all duration-200 shadow-lg"
            >
              {isLoading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>

          {/* Demo Access */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="flex items-center justify-center w-full text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200"
            >
              {showDemo ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
              {showDemo ? 'Masquer' : 'Voir'} les comptes de démonstration
            </button>

            {showDemo && (
              <div className="mt-4 space-y-3">
                {demoCredentials.map((cred, index) => (
                  <button
                    key={index}
                    onClick={() => quickLogin(cred.school, cred.user)}
                    className="w-full p-3 text-left rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all duration-200"
                  >
                    <div className="font-medium text-gray-800">{cred.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{cred.description}</div>
                    <div className="text-xs text-gray-400 mt-1">
                      {cred.school} • {cred.user}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Toutes tes données sont chiffrées et anonymes.<br />
            Seuls les agents sociaux peuvent voir les alertes d'urgence.
          </p>
        </div>
      </div>
    </div>
  );
}