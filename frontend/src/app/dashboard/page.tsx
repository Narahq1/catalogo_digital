'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import EmptyState from '@/components/EmptyState';

interface Metrics {
  totalProducts: number;
  totalViews: number;
  dailyViews: { date: string; views: number }[];
  categoryViews: { category: string; views: number }[];
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  // userName lido apenas no cliente para evitar hydration mismatch
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Leitura do localStorage somente no cliente
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserName(u.name?.split(' ')[0] || '');
      }
    } catch { /* ignore */ }

    api.get('/dashboard/metrics')
      .then(({ data }) => setMetrics(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const hasData = metrics && (metrics.totalViews > 0 || metrics.totalProducts > 0);

  const maxViews = metrics?.dailyViews?.length
    ? Math.max(...metrics.dailyViews.map((d) => Number(d.views)), 1)
    : 1;

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header — sem emoji para evitar SSR mismatch */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          {userName ? `Olá, ${userName}!` : 'Olá!'}
        </h1>
        <p className="text-sm text-gray-400 mt-1">Veja um resumo do seu catálogo</p>
      </div>

      {/* Cards de métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <MetricCard
          label="Total de Visualizações"
          value={loading ? '—' : String(metrics?.totalViews ?? 0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          color="from-blue-500 to-blue-400"
        />
        <MetricCard
          label="Produtos Cadastrados"
          value={loading ? '—' : String(metrics?.totalProducts ?? 0)}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
            </svg>
          }
          color="from-purple-500 to-purple-400"
        />
      </div>

      {/* Gráfico de barras */}
      <div className="card mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">
          Visualizações — Últimos 7 dias
        </h2>

        {!hasData ? (
          <EmptyState
            message="Nenhum dado de acesso registrado ainda. Os gráficos aparecerão aqui assim que seu catálogo receber visitas."
            icon={
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            }
          />
        ) : (
          <div className="flex items-end gap-3 h-40 border-b border-l border-gray-100 px-2 pb-2">
            {metrics!.dailyViews.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md bg-brand-gradient opacity-80 min-h-[4px] transition-all"
                  style={{ height: `${(Number(d.views) / maxViews) * 100}%` }}
                />
                <span className="text-[10px] text-gray-400">
                  {new Date(d.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Barras por categoria */}
      {hasData && metrics!.categoryViews.length > 0 && (
        <div className="card">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Visualizações por Categoria</h2>
          <div className="space-y-3">
            {metrics!.categoryViews.map((c, i) => {
              const total = metrics!.totalViews || 1;
              const pct = Math.round((Number(c.views) / total) * 100);
              const colors = [
                'from-blue-500 to-blue-400', 'from-purple-500 to-purple-400',
                'from-pink-500 to-pink-400', 'from-indigo-500 to-indigo-400',
              ];
              return (
                <div key={c.category}>
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{c.category || 'Sem categoria'}</span>
                    <span>{pct}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${colors[i % colors.length]} rounded-full`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
}

function MetricCard({ label, value, icon, color }: MetricCardProps) {
  return (
    <div className="card flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color}
                       flex items-center justify-center text-white flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
