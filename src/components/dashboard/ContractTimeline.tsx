/**
 * ContractTimeline Component
 * Visual timeline showing contract expiration dates
 */

import React, { useState } from 'react';
import { TimelineData } from '../../types';

export interface ContractTimelineProps {
  data: TimelineData;
}

export const ContractTimeline: React.FC<ContractTimelineProps> = ({ data }) => {
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-calendar-days text-blue-500"></i>
          Semáforo de Vencimientos
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Este Mes - Rojo (Urgente) */}
        <div 
          className="relative p-5 rounded-xl bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-all cursor-pointer"
          onMouseEnter={() => setHoveredSection('thisMonth')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Este Mes</span>
            <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center">
              <i className="fa-solid fa-exclamation text-white text-sm"></i>
            </div>
          </div>
          <div className="text-4xl font-black text-red-600 dark:text-red-400 mb-1">{data.thisMonth.count}</div>
          <p className="text-sm text-red-700 dark:text-red-300 font-medium">vencen ahora</p>
          
          {hoveredSection === 'thisMonth' && data.thisMonth.properties.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-red-200 dark:border-red-700 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Propiedades:</p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {data.thisMonth.properties.map((prop, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <i className="fa-solid fa-circle text-[4px] text-red-500"></i>
                    {prop}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Próximo Mes - Naranja (Atención) */}
        <div 
          className="relative p-5 rounded-xl bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all cursor-pointer"
          onMouseEnter={() => setHoveredSection('nextMonth')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 uppercase tracking-wider">Próximo Mes</span>
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
              <i className="fa-solid fa-clock text-white text-sm"></i>
            </div>
          </div>
          <div className="text-4xl font-black text-orange-600 dark:text-orange-400 mb-1">{data.nextMonth.count}</div>
          <p className="text-sm text-orange-700 dark:text-orange-300 font-medium">vencen en Marzo</p>
          
          {hoveredSection === 'nextMonth' && data.nextMonth.properties.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-orange-200 dark:border-orange-700 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Propiedades:</p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {data.nextMonth.properties.map((prop, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <i className="fa-solid fa-circle text-[4px] text-orange-500"></i>
                    {prop}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* +60 Días - Azul (Futuro) */}
        <div 
          className="relative p-5 rounded-xl bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all cursor-pointer"
          onMouseEnter={() => setHoveredSection('future')}
          onMouseLeave={() => setHoveredSection(null)}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">+60 Días</span>
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <i className="fa-solid fa-check text-white text-sm"></i>
            </div>
          </div>
          <div className="text-4xl font-black text-blue-600 dark:text-blue-400 mb-1">{data.future.count}</div>
          <p className="text-sm text-blue-700 dark:text-blue-300 font-medium">vencen en Abril</p>
          
          {hoveredSection === 'future' && data.future.properties.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-blue-200 dark:border-blue-700 z-10 animate-in fade-in slide-in-from-top-2 duration-200">
              <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mb-2 uppercase">Propiedades:</p>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                {data.future.properties.map((prop, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <i className="fa-solid fa-circle text-[4px] text-blue-500"></i>
                    {prop}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
