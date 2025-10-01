import React, { useState } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, AlertTriangle, Activity } from 'lucide-react';
import { useAlerts } from '../../contexts/AlertContext';
import { useAuth } from '../../contexts/AuthContext';

export default function StatisticsSection() {
  const { user } = useAuth();
  const { alerts, getAlertStats } = useAlerts();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  const schoolAlerts = user ? alerts.filter(alert => alert.schoolCode === user.schoolCode) : [];
  const stats = getAlertStats(user?.schoolCode);

  // Simulation de données pour le graphique
  const chartData = {
    week: [
      { label: 'Lun', critical: 1, high: 2, medium: 3, low: 1 },
      { label: 'Mar', critical: 0, high: 1, medium: 2, low: 2 },
      { label: 'Mer', critical: 2, high: 3, medium: 1, low: 1 },
      { label: 'Jeu', critical: 0, high: 1, medium: 4, low: 2 },
      { label: 'Ven', critical: 1, high: 2, medium: 2, low: 3 },
      { label: 'Sam', critical: 0, high: 0, medium: 1, low: 0 },
      { label: 'Dim', critical: 0, high: 1, medium: 1, low: 1 }
    ],
    month: [
      { label: 'Sem 1', critical: 3, high: 8, medium: 12, low: 6 },
      { label: 'Sem 2', critical: 2, high: 6, medium: 15, low: 8 },
      { label: 'Sem 3', critical: 4, high: 10, medium: 18, low: 12 },
      { label: 'Sem 4', critical: 1, high: 4, medium: 10, low: 7 }
    ],
    year: [
      { label: 'Jan', critical: 8, high: 24, medium: 45, low: 32 },
      { label: 'Fév', critical: 6, high: 18, medium: 38, low: 28 },
      { label: 'Mar', critical: 10, high: 32, medium: 52, low: 41 },
      { label: 'Avr', critical: 5, high: 20, medium: 35, low: 25 }
    ]
  };

  const currentData = chartData[timeRange];
  const maxValue = Math.max(...currentData.map(d => d.critical + d.high + d.medium + d.low));

  const getBarHeight = (value: number) => (value / maxValue) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Statistiques Anonymes</h1>
            <p className="text-gray-600">Analyse des tendances pour votre établissement</p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeRange('week')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                timeRange === 'week'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Semaine
            </button>
            <button
              onClick={() => setTimeRange('month')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                timeRange === 'month'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Mois
            </button>
            <button
              onClick={() => setTimeRange('year')}
              className={`px-4 py-2 rounded-2xl font-medium transition-all duration-200 ${
                timeRange === 'year'
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Année
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-red-100 p-3 rounded-2xl">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
              <div className="text-sm text-gray-600">Total alertes</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% ce mois</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-2xl">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">{stats.resolved}</div>
              <div className="text-sm text-gray-600">Résolues</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600">
              {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}% du total
            </span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-2xl">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {new Set(schoolAlerts.map(a => a.studentId)).size}
              </div>
              <div className="text-sm text-gray-600">Élèves concernés</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600">Sur ~{Math.round(Math.random() * 200 + 300)} élèves</span>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-2xl">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-800">
                {stats.total > 0 ? Math.round(stats.total / 30) : 0}
              </div>
              <div className="text-sm text-gray-600">Moy./jour</div>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <span className="text-gray-600">Derniers 30 jours</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Évolution des alertes par niveau de risque
          </h3>
          
          <div className="h-64 flex items-end justify-between space-x-2">
            {currentData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div className="w-full max-w-12 flex flex-col-reverse space-y-reverse space-y-1">
                  {/* Critical */}
                  {data.critical > 0 && (
                    <div
                      className="bg-red-500 rounded-t"
                      style={{ height: `${getBarHeight(data.critical)}px` }}
                      title={`${data.critical} critique(s)`}
                    />
                  )}
                  {/* High */}
                  {data.high > 0 && (
                    <div
                      className="bg-orange-500"
                      style={{ height: `${getBarHeight(data.high)}px` }}
                      title={`${data.high} élevée(s)`}
                    />
                  )}
                  {/* Medium */}
                  {data.medium > 0 && (
                    <div
                      className="bg-yellow-500"
                      style={{ height: `${getBarHeight(data.medium)}px` }}
                      title={`${data.medium} moyenne(s)`}
                    />
                  )}
                  {/* Low */}
                  {data.low > 0 && (
                    <div
                      className="bg-blue-500 rounded-b"
                      style={{ height: `${getBarHeight(data.low)}px` }}
                      title={`${data.low} faible(s)`}
                    />
                  )}
                </div>
                <div className="text-xs text-gray-600 mt-2">{data.label}</div>
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mt-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
              <span>Critique</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-orange-500 rounded mr-2"></div>
              <span>Élevé</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
              <span>Moyen</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
              <span>Faible</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-white/20">
          <h3 className="text-lg font-semibold text-gray-800 mb-6">
            Répartition par niveau de risque
          </h3>
          
          <div className="space-y-4">
            {[
              { level: 'critical', label: 'Critique', count: stats.byRiskLevel.critical || 0, color: 'bg-red-500' },
              { level: 'high', label: 'Élevé', count: stats.byRiskLevel.high || 0, color: 'bg-orange-500' },
              { level: 'medium', label: 'Moyen', count: stats.byRiskLevel.medium || 0, color: 'bg-yellow-500' },
              { level: 'low', label: 'Faible', count: stats.byRiskLevel.low || 0, color: 'bg-blue-500' }
            ].map((item) => {
              const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0;
              return (
                <div key={item.level}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                    <span className="text-sm text-gray-600">{item.count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className={`${item.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-2xl border border-blue-200">
            <h4 className="font-medium text-blue-800 mb-2">Recommandations</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Focus sur la prévention si beaucoup d'alertes moyennes</li>
              <li>• Renforcer l'équipe si alertes critiques fréquentes</li>
              <li>• Analyser les tendances pour anticiper</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}