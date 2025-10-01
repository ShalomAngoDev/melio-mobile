import React, { useState } from 'react';
import { AlertTriangle, Clock, User, CheckCircle, MessageCircle, Calendar, Tag } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';

const riskLevelConfig = {
  low: { color: 'text-yellow-600', bg: 'bg-yellow-100', border: 'border-yellow-200', label: 'Faible' },
  medium: { color: 'text-orange-600', bg: 'bg-orange-100', border: 'border-orange-200', label: 'Moyen' },
  high: { color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200', label: 'Élevé' },
  critical: { color: 'text-red-800', bg: 'bg-red-200', border: 'border-red-300', label: 'Critique' }
};

export default function AlertsSection() {
  const { user } = useAuth();
  const { alerts, resolveAlert, getUnresolvedAlerts, getAlertStats } = useAlerts();
  const [selectedAlert, setSelectedAlert] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unresolved'>('unresolved');

  const schoolAlerts = user ? alerts.filter(alert => alert.schoolCode === user.schoolCode) : [];
  const filteredAlerts = filter === 'unresolved' 
    ? schoolAlerts.filter(alert => !alert.resolved)
    : schoolAlerts;
  
  const stats = getAlertStats(user?.schoolCode);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Gestion des Alertes</h1>
            <p className="text-gray-600">Suivi des situations d'urgence détectées par Melio</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('unresolved')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                filter === 'unresolved'
                  ? 'bg-red-100 text-red-700 border border-red-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Non résolues ({stats.unresolved})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Toutes ({stats.total})
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
            <div className="text-2xl font-bold text-red-600">{stats.byRiskLevel.critical || 0}</div>
            <div className="text-sm text-red-700">Critiques</div>
          </div>
          <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
            <div className="text-2xl font-bold text-orange-600">{stats.byRiskLevel.high || 0}</div>
            <div className="text-sm text-orange-700">Élevées</div>
          </div>
          <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
            <div className="text-2xl font-bold text-yellow-600">{stats.byRiskLevel.medium || 0}</div>
            <div className="text-sm text-yellow-700">Moyennes</div>
          </div>
          <div className="bg-green-50 rounded-2xl p-4 border border-green-100">
            <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
            <div className="text-sm text-green-700">Résolues</div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 text-center shadow-lg border border-white/20">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">
              {filter === 'unresolved' ? 'Aucune alerte non résolue' : 'Aucune alerte'}
            </h3>
            <p className="text-gray-500">
              {filter === 'unresolved' 
                ? 'Toutes les alertes ont été traitées'
                : 'Aucune alerte n\'a été détectée pour cette école'
              }
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const config = riskLevelConfig[alert.riskLevel];
            const isExpanded = selectedAlert === alert.id;
            
            return (
              <div
                key={alert.id}
                className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 overflow-hidden transition-all duration-200 ${
                  alert.resolved ? 'opacity-60' : ''
                }`}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.color} border ${config.border}`}>
                          {config.label}
                        </div>
                        {alert.resolved && (
                          <div className="flex items-center px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Résolue
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="w-4 h-4 mr-2" />
                          <span>Élève: {alert.studentName}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{formatDate(alert.timestamp)}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          <span>{alert.context}</span>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-2xl p-4 mb-4">
                        <h4 className="font-medium text-gray-800 mb-2">Message détecté:</h4>
                        <p className="text-gray-700 leading-relaxed">{alert.message}</p>
                      </div>

                      {alert.keywords.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                            <Tag className="w-4 h-4 mr-2" />
                            Mots-clés détectés:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {alert.keywords.map((keyword, index) => (
                              <span
                                key={index}
                                className={`px-2 py-1 rounded-full text-xs ${config.bg} ${config.color}`}
                              >
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <button
                        onClick={() => setSelectedAlert(isExpanded ? null : alert.id)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-2xl hover:bg-blue-200 transition-all duration-200 text-sm font-medium"
                      >
                        {isExpanded ? 'Réduire' : 'Détails'}
                      </button>
                      {!alert.resolved && (
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="px-4 py-2 bg-green-100 text-green-700 rounded-2xl hover:bg-green-200 transition-all duration-200 text-sm font-medium"
                        >
                          Marquer comme résolue
                        </button>
                      )}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <h4 className="font-medium text-gray-800 mb-3">Actions recommandées:</h4>
                      <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <ul className="space-y-2 text-sm text-blue-800">
                          {alert.riskLevel === 'critical' && (
                            <>
                              <li>• Contacter immédiatement l'élève et sa famille</li>
                              <li>• Orienter vers un professionnel de santé mentale</li>
                              <li>• Signaler si nécessaire aux autorités compétentes</li>
                            </>
                          )}
                          {alert.riskLevel === 'high' && (
                            <>
                              <li>• Programmer un entretien avec l'élève dans les 24h</li>
                              <li>• Informer l'équipe pédagogique</li>
                              <li>• Envisager un suivi psychologique</li>
                            </>
                          )}
                          {alert.riskLevel === 'medium' && (
                            <>
                              <li>• Organiser un entretien dans les 48h</li>
                              <li>• Surveiller l'évolution de la situation</li>
                              <li>• Proposer un accompagnement</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}