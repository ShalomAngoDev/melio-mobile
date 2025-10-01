import React, { useState } from 'react';
import { Megaphone, User, Shield, Send, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { reportService, CreateReportData } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

export default function ReportSection() {
  const { user } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [formData, setFormData] = useState({
    content: '',
    urgency: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL',
    anonymous: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const canSubmit = formData.content.trim().length >= 10;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const submitReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !canSubmit) return;

    setIsLoading(true);

    try {
      // Validation
      if (!formData.content.trim()) {
        showWarning('Veuillez décrire la situation');
        return;
      }

      if (formData.content.length < 10) {
        showWarning('Veuillez fournir plus de détails (au moins 10 caractères)');
        return;
      }

      // Extraire le schoolId du token JWT si user.schoolId est vide
      let schoolId = user.schoolId;
      if (!schoolId) {
        try {
          const token = localStorage.getItem('accessToken');
          if (token) {
            const payload = JSON.parse(atob(token.split('.')[1]));
            schoolId = payload.schoolId;
          }
        } catch (error) {
          console.error('Erreur lors de l\'extraction du schoolId du token:', error);
        }
      }

      if (!schoolId) {
        showError('Impossible de déterminer l\'école. Veuillez vous reconnecter.');
        return;
      }

      const reportData: CreateReportData = {
        schoolId: schoolId,
        studentId: formData.anonymous ? undefined : user.id,
        content: formData.content.trim(),
        urgency: formData.urgency,
        anonymous: formData.anonymous,
      };

      await reportService.createReport(reportData);
      setSubmitted(true);
      showSuccess('Signalement envoyé avec succès ! L\'équipe de l\'école va examiner votre demande.');
      
      // Réinitialiser le formulaire après 3 secondes
      setTimeout(() => {
        setSubmitted(false);
        setFormData({
          content: '',
          urgency: 'MEDIUM',
          anonymous: true,
        });
      }, 3000);

    } catch (err: any) {
      console.error('Erreur lors de l\'envoi du signalement:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de l\'envoi du signalement';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Signalement envoyé !</h3>
          <p className="text-gray-600 mb-4">
            Votre signalement a été transmis à l'équipe de l'école. 
            Ils examineront votre demande et prendront les mesures nécessaires.
          </p>
          <div className="text-sm text-gray-500">
            Vous recevrez une notification si des informations supplémentaires sont nécessaires.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
      <div className="flex items-center mb-4">
        <Megaphone className="w-6 h-6 text-pink-600 mr-2" />
        <h3 className="text-xl font-semibold text-gray-800">Signaler une situation</h3>
      </div>

      <form onSubmit={submitReport} className="space-y-5">
        {/* Anonymat */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-200">
          <div className="flex-1">
            <span className="font-medium text-gray-800 block">Signaler de manière anonyme</span>
            <span className="text-sm text-gray-500">
              Votre identité ne sera pas révélée à l'équipe de l'école
            </span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="anonymous"
              checked={formData.anonymous}
              onChange={handleInputChange}
              className="sr-only"
            />
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ease-in-out ${
              formData.anonymous ? 'bg-pink-500' : 'bg-gray-300'
            }`}>
              <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                formData.anonymous ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

        {/* Niveau d'urgence - Version compacte sur une ligne */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-2">
            À quel point c'est urgent ? *
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[
              { value: 'LOW', label: 'Faible', color: 'bg-green-100 text-green-800 border-green-300' },
              { value: 'MEDIUM', label: 'Moyen', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
              { value: 'HIGH', label: 'Élevé', color: 'bg-orange-100 text-orange-800 border-orange-300' },
              { value: 'CRITICAL', label: 'Urgent', color: 'bg-red-100 text-red-800 border-red-300' },
            ].map((option) => (
              <label
                key={option.value}
                className={`relative flex items-center justify-center p-2 border-2 rounded-lg cursor-pointer transition-all ${
                  formData.urgency === option.value
                    ? `${option.color} border-current`
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={option.value}
                  checked={formData.urgency === option.value}
                  onChange={handleInputChange}
                  className="sr-only"
                />
                <span className="font-medium text-xs text-center">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Décrivez la situation *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            required
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-transparent text-base resize-none"
            placeholder="Décrivez ce que vous avez observé ou vécu. Soyez aussi précis que possible pour aider l'équipe à comprendre la situation..."
            maxLength={2000}
          />
          <div className="text-right text-sm text-gray-500 mt-1">
            {formData.content.length}/2000 caractères
          </div>
        </div>

     

        {/* Bouton d'envoi */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!canSubmit || isLoading}
            className="px-6 py-3 bg-pink-500 text-white rounded-2xl hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Envoyer le signalement
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


