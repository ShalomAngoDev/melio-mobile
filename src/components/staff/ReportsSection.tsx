import React, { useState } from 'react';
import { FileText, Download, Calendar, BarChart3, TrendingUp, Users } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';

export default function ReportsSection() {
  const { user } = useAuth();
  const { getAlertStats } = useAlerts();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [reportType, setReportType] = useState('summary');

  const stats = getAlertStats(user?.schoolCode);

  const generatePDFReport = () => {
    // Simulation de génération de PDF
    const reportData = {
      school: user?.schoolCode,
      period: selectedPeriod,
      type: reportType,
      stats: stats,
      generatedAt: new Date().toISOString()
    };

    // Créer un faux lien de téléchargement
    const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(reportData, null, 2))}`;
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute('href', dataStr);
    downloadAnchorNode.setAttribute('download', `melio-rapport-${selectedPeriod}-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();

    // Dans la vraie version, ceci génèrerait un vrai PDF
    alert('Rapport généré ! (Simulation - fichier JSON téléchargé)');
  };

  const reportTemplates = [
    {
      id: 'summary',
      title: 'Rapport de synthèse',
      description: 'Vue d\'ensemble des statistiques principales',
      icon: BarChart3,
      features: ['Nombre total d\'alertes', 'Répartition par niveau de risque', 'Taux de résolution', 'Évolution temporelle']
    },
    {
      id: 'detailed',
      title: 'Rapport détaillé',
      description: 'Analyse approfondie avec recommandations',
      icon: FileText,
      features: ['Analyse des tendances', 'Mots-clés les plus fréquents', 'Recommandations personnalisées', 'Comparaison périodes']
    },
    {
      id: 'trends',
      title: 'Rapport de tendances',
      description: 'Évolution et prédictions',
      icon: TrendingUp,
      features: ['Graphiques d\'évolution', 'Analyse saisonnière', 'Prédictions', 'Indicateurs de performance']
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Génération de Rapports</h1>
        <p className="text-gray-600">Rapports anonymes pour le suivi et la prévention</p>
      </div>

      {/* Configuration */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Configuration du rapport</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Period Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Période d'analyse
            </label>
            <div className="space-y-2">
              {[
                { id: 'week', label: 'Cette semaine' },
                { id: 'month', label: 'Ce mois' },
                { id: 'quarter', label: 'Ce trimestre' },
                { id: 'year', label: 'Cette année' }
              ].map((period) => (
                <label key={period.id} className="flex items-center">
                  <input
                    type="radio"
                    name="period"
                    value={period.id}
                    checked={selectedPeriod === period.id}
                    onChange={(e) => setSelectedPeriod(e.target.value)}
                    className="mr-3 text-pink-500 focus:ring-pink-500"
                  />
                  <span className="text-gray-700">{period.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Type de rapport
            </label>
            <div className="space-y-3">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <label
                    key={template.id}
                    className={`flex items-start p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      reportType === template.id
                        ? 'border-pink-500 bg-pink-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportType"
                      value={template.id}
                      checked={reportType === template.id}
                      onChange={(e) => setReportType(e.target.value)}
                      className="mr-3 mt-1 text-pink-500 focus:ring-pink-500"
                    />
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <Icon className="w-4 h-4 mr-2 text-gray-600" />
                        <span className="font-medium text-gray-800">{template.title}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                      <ul className="text-xs text-gray-500 space-y-1">
                        {template.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Aperçu du rapport</h2>
        
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Rapport Melio - {reportTemplates.find(t => t.id === reportType)?.title}
              </h3>
              <p className="text-gray-600">
                École: {user?.schoolCode} | Période: {selectedPeriod === 'week' ? 'Cette semaine' : 
                selectedPeriod === 'month' ? 'Ce mois' : 
                selectedPeriod === 'quarter' ? 'Ce trimestre' : 'Cette année'}
              </p>
              <p className="text-sm text-gray-500">
                Généré le {new Date().toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                Confidentiel
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total alertes</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Résolues</div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="text-2xl font-bold text-red-600">{stats.unresolved}</div>
              <div className="text-sm text-gray-600">En cours</div>
            </div>
          </div>

          {reportType === 'summary' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Répartition par niveau de risque:</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                  <div className="text-lg font-bold text-red-600">{stats.byRiskLevel.critical || 0}</div>
                  <div className="text-xs text-gray-600">Critique</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                  <div className="text-lg font-bold text-orange-600">{stats.byRiskLevel.high || 0}</div>
                  <div className="text-xs text-gray-600">Élevé</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                  <div className="text-lg font-bold text-yellow-600">{stats.byRiskLevel.medium || 0}</div>
                  <div className="text-xs text-gray-600">Moyen</div>
                </div>
                <div className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                  <div className="text-lg font-bold text-blue-600">{stats.byRiskLevel.low || 0}</div>
                  <div className="text-xs text-gray-600">Faible</div>
                </div>
              </div>
            </div>
          )}

          {reportType === 'detailed' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Analyse détaillée:</h4>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h5 className="font-medium text-gray-800 mb-2">Recommandations principales:</h5>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>• Renforcer la prévention dans les espaces de vie scolaire</li>
                  <li>• Organiser des séances de sensibilisation</li>
                  <li>• Former les équipes pédagogiques à la détection</li>
                </ul>
              </div>
            </div>
          )}

          {reportType === 'trends' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800">Tendances observées:</h4>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                  <span className="text-sm font-medium text-gray-800">Évolution positive</span>
                </div>
                <p className="text-sm text-gray-700">
                  Le taux de résolution des alertes s'améliore progressivement (+15% ce mois).
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Generate Button */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-1">Générer le rapport</h3>
            <p className="text-sm text-gray-600">
              Le rapport sera généré au format PDF anonyme et sécurisé
            </p>
          </div>
          
          <button
            onClick={generatePDFReport}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl font-medium hover:from-pink-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
          >
            <Download className="w-5 h-5 mr-2" />
            Télécharger PDF
          </button>
        </div>
        
        <div className="mt-4 p-4 bg-blue-50 rounded-2xl border border-blue-200">
          <div className="flex items-start">
            <FileText className="w-5 h-5 text-blue-600 mr-2 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-800 mb-1">Confidentialité garantie</h4>
              <p className="text-sm text-blue-700">
                Tous les rapports sont anonymisés. Aucune donnée personnelle n'est incluse.
                Seules les statistiques aggregées et recommandations sont présentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}