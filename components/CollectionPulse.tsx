import React from 'react';

interface CollectionPulseProps {
  totalExpected: number;
  totalCollected: number;
  percentage: number;
}

const CollectionPulse: React.FC<CollectionPulseProps> = ({ totalExpected, totalCollected, percentage }) => {
  const remaining = totalExpected - totalCollected;
  const colorClass = percentage >= 80 ? 'bg-emerald-500' : percentage >= 50 ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Pulso de Cobranza Mensual</h3>
        <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
          <i className="fa-solid fa-hand-holding-dollar text-xl"></i>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-black text-slate-800 dark:text-white">
            ${totalCollected.toLocaleString('es-AR')}
          </span>
          <span className="text-slate-500 dark:text-slate-400 text-sm">
            / ${totalExpected.toLocaleString('es-AR')}
          </span>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Faltan cobrar: <span className="font-bold text-red-600 dark:text-red-400">${remaining.toLocaleString('es-AR')}</span>
        </p>
      </div>

      <div className="relative">
        <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <div 
            className={`h-full ${colorClass} transition-all duration-500 relative`}
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">0%</span>
          <span className={`text-xl font-black ${percentage >= 80 ? 'text-emerald-600' : percentage >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
            {percentage}%
          </span>
          <span className="text-xs text-slate-500 dark:text-slate-400">100%</span>
        </div>
      </div>
    </div>
  );
};

export default CollectionPulse;
