'use client';

/**
 * Team Certification Component
 *
 * Displays team certification status from AVALA for compliance tracking.
 * Shows competency coverage, DC-3 compliance, and expiration alerts.
 */

import { useState } from 'react';
import {
  AvalaProvider,
  useTeamCompetencyReport,
  useExpirationAlerts,
  useCompetencyStatusDisplay,
  getCompetencyLevelLabel,
  getDC3StatusLabel,
  daysUntilExpiration,
  type CompetencyStatus,
} from '@avala/client/react';

// Configuration
const AVALA_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_AVALA_API_URL || 'https://api.avala.madfam.io',
  apiKey: process.env.NEXT_PUBLIC_AVALA_API_KEY,
  tenantId: process.env.NEXT_PUBLIC_AVALA_TENANT_ID || 'madfam',
};

// Default MADFAM team ID
const MADFAM_TEAM_ID = process.env.NEXT_PUBLIC_MADFAM_TEAM_ID || 'madfam-core';

// ============================================================================
// Sub-components
// ============================================================================

function StatusBadge({ status }: { status: CompetencyStatus }) {
  const { label, color } = useCompetencyStatusDisplay(status);

  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}20`, color }}
    >
      {label}
    </span>
  );
}

function ComplianceGauge({ value, label }: { value: number; label: string }) {
  const getColor = (v: number) => {
    if (v >= 90) return '#22c55e';
    if (v >= 70) return '#eab308';
    if (v >= 50) return '#f97316';
    return '#ef4444';
  };

  const color = getColor(value);

  return (
    <div className="text-center">
      <div className="relative w-20 h-20 mx-auto">
        <svg className="w-full h-full transform -rotate-90">
          <circle cx="40" cy="40" r="36" stroke="#e5e7eb" strokeWidth="8" fill="none" />
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke={color}
            strokeWidth="8"
            fill="none"
            strokeDasharray={`${(value / 100) * 226} 226`}
            strokeLinecap="round"
          />
        </svg>
        <span
          className="absolute inset-0 flex items-center justify-center text-lg font-bold"
          style={{ color }}
        >
          {value}%
        </span>
      </div>
      <p className="text-xs text-gray-600 mt-1">{label}</p>
    </div>
  );
}

function CompetencyCoverageBar({
  name,
  certified,
  inProgress,
  notStarted,
  total,
}: {
  name: string;
  certified: number;
  inProgress: number;
  notStarted: number;
  total: number;
}) {
  const certifiedPct = (certified / total) * 100;
  const inProgressPct = (inProgress / total) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-gray-900 truncate">{name}</span>
        <span className="text-gray-500 text-xs">
          {certified}/{total} certificados
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
        <div className="bg-green-500 h-full" style={{ width: `${certifiedPct}%` }} />
        <div className="bg-blue-400 h-full" style={{ width: `${inProgressPct}%` }} />
      </div>
    </div>
  );
}

function ExpirationAlertItem({
  employeeName,
  competencyName,
  expiresAt,
}: {
  employeeName: string;
  competencyName: string;
  expiresAt: string;
}) {
  const days = daysUntilExpiration(expiresAt);
  const isUrgent = days <= 7;

  return (
    <div
      className={`p-3 rounded-lg ${
        isUrgent ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-900">{employeeName}</p>
          <p className="text-xs text-gray-600">{competencyName}</p>
        </div>
        <span className={`text-xs font-semibold ${isUrgent ? 'text-red-600' : 'text-amber-600'}`}>
          {days <= 0 ? 'Expirado' : `${days} días`}
        </span>
      </div>
    </div>
  );
}

function TeamReportSection() {
  const { data: report, isLoading, error } = useTeamCompetencyReport(MADFAM_TEAM_ID);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="flex gap-4 justify-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-gray-200 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-gray-50 rounded-lg text-center">
        Conectar con AVALA API para ver métricas del equipo
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Compliance Gauges */}
      <div className="flex justify-center gap-8">
        <ComplianceGauge value={report.complianceScore} label="Cumplimiento General" />
        <ComplianceGauge value={report.dc3Compliance.complianceRate} label="DC-3 / SIRCE" />
      </div>

      {/* Competency Coverage */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700">Cobertura por Competencia</h4>
        {report.competencyCoverage.slice(0, 5).map(coverage => (
          <CompetencyCoverageBar
            key={coverage.competencyId}
            name={coverage.competencyName}
            certified={coverage.certifiedCount}
            inProgress={coverage.inProgressCount}
            notStarted={coverage.notStartedCount}
            total={report.totalMembers}
          />
        ))}
      </div>

      {/* DC-3 Stats */}
      <div className="grid grid-cols-4 gap-2 text-center">
        <div className="p-2 bg-green-50 rounded">
          <p className="text-lg font-bold text-green-600">{report.dc3Compliance.completed}</p>
          <p className="text-xs text-gray-600">Completados</p>
        </div>
        <div className="p-2 bg-amber-50 rounded">
          <p className="text-lg font-bold text-amber-600">{report.dc3Compliance.pending}</p>
          <p className="text-xs text-gray-600">Pendientes</p>
        </div>
        <div className="p-2 bg-red-50 rounded">
          <p className="text-lg font-bold text-red-600">{report.dc3Compliance.overdue}</p>
          <p className="text-xs text-gray-600">Vencidos</p>
        </div>
        <div className="p-2 bg-gray-50 rounded">
          <p className="text-lg font-bold text-gray-600">{report.dc3Compliance.totalRequired}</p>
          <p className="text-xs text-gray-600">Requeridos</p>
        </div>
      </div>
    </div>
  );
}

function ExpirationAlertsSection() {
  const { data: alerts, isLoading } = useExpirationAlerts(30);

  if (isLoading) {
    return (
      <div className="animate-pulse space-y-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-200 rounded-lg" />
        ))}
      </div>
    );
  }

  if (!alerts || alerts.length === 0) {
    return (
      <div className="text-sm text-gray-500 p-4 bg-green-50 rounded-lg text-center">
        ✅ Sin vencimientos próximos
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {alerts.slice(0, 5).map(alert => (
        <ExpirationAlertItem
          key={`${alert.employeeId}-${alert.competencyId}`}
          employeeName={alert.employeeName}
          competencyName={alert.competencyName}
          expiresAt={alert.expiresAt}
        />
      ))}
      {alerts.length > 5 && (
        <p className="text-xs text-center text-gray-500">+{alerts.length - 5} más vencimientos</p>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

function TeamCertificationContent() {
  const [activeTab, setActiveTab] = useState<'overview' | 'alerts'>('overview');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-teal-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🎓</span>
              Certificación del Equipo
            </h3>
            <p className="text-sm text-gray-600">Cumplimiento DC-3 y competencias CONOCER</p>
          </div>
          <a
            href="https://app.avala.madfam.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Abrir AVALA →
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 border-b border-gray-200">
        <div className="flex gap-6">
          {[
            { id: 'overview', label: 'Resumen' },
            { id: 'alerts', label: 'Alertas' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-emerald-500 text-emerald-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && <TeamReportSection />}
        {activeTab === 'alerts' && <ExpirationAlertsSection />}
      </div>

      {/* Footer */}
      <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        Cumplimiento LFT/SIRCE impulsado por AVALA Learning Cloud
      </div>
    </div>
  );
}

/**
 * Team Certification Widget
 *
 * Embed this component in admin dashboards to track
 * team competency and DC-3 compliance status.
 */
export default function TeamCertification() {
  return (
    <AvalaProvider config={AVALA_CONFIG}>
      <TeamCertificationContent />
    </AvalaProvider>
  );
}

export { TeamCertification, StatusBadge, ComplianceGauge };
