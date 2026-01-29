/**
 * TenantTickets Component
 * Displays active and resolved maintenance tickets for tenants
 */

import React, { useState } from 'react';
import { Ticket, Theme } from '../../types';

interface TenantTicketsProps {
  tickets: Ticket[];
  theme: Theme;
  onReportIssue: () => void;
  onResolveTicket: (ticketId: string) => void;
}

export const TenantTickets: React.FC<TenantTicketsProps> = ({
  tickets,
  theme,
  onReportIssue,
  onResolveTicket
}) => {
  const [showResolved, setShowResolved] = useState(false);

  const activeTickets = tickets.filter(t => t.status !== 'resuelto');
  const resolvedTickets = tickets.filter(t => t.status === 'resuelto');

  const getPriorityColor = (priority: Ticket['priority']) => {
    if (priority === 'alta') return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
    if (priority === 'media') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
  };

  const getStatusColor = (status: Ticket['status']) => {
    if (status === 'pendiente') return 'bg-slate-100 text-slate-800 dark:bg-slate-800/50 dark:text-slate-400';
    if (status === 'en proceso') return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
    if (status === 'resuelto') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
  };

  const getStatusIcon = (status: Ticket['status']) => {
    if (status === 'pendiente') return 'fa-clock';
    if (status === 'en proceso') return 'fa-wrench';
    if (status === 'resuelto') return 'fa-check-circle';
    return 'fa-file-invoice';
  };

  const displayTickets = showResolved ? resolvedTickets : activeTickets;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">Mis Solicitudes</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              {activeTickets.length} {activeTickets.length === 1 ? 'solicitud activa' : 'solicitudes activas'}
            </p>
          </div>
          <button
            onClick={onReportIssue}
            className={`${theme.bgClass} text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
          >
            <i className="fa-solid fa-plus"></i>
            <span className="hidden md:inline">Reportar Problema</span>
          </button>
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowResolved(false)}
            className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
              !showResolved
                ? `${theme.bgClass} text-white`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <i className="fa-solid fa-wrench mr-2"></i>
            Activas ({activeTickets.length})
          </button>
          <button
            onClick={() => setShowResolved(true)}
            className={`flex-1 px-4 py-2 rounded-xl font-bold transition-all ${
              showResolved
                ? `${theme.bgClass} text-white`
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}
          >
            <i className="fa-solid fa-check-circle mr-2"></i>
            Resueltas ({resolvedTickets.length})
          </button>
        </div>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {displayTickets.length === 0 ? (
          <div className="p-8 text-center">
            <i className={`fa-solid ${showResolved ? 'fa-check-circle' : 'fa-tools'} text-6xl text-slate-300 dark:text-slate-600 mb-4`}></i>
            <p className="text-slate-500 dark:text-slate-400 font-bold mb-2">
              {showResolved ? 'No hay solicitudes resueltas' : 'No hay solicitudes activas'}
            </p>
            {!showResolved && (
              <p className="text-sm text-slate-400 dark:text-slate-500">
                Reporta cualquier problema de mantenimiento
              </p>
            )}
          </div>
        ) : (
          displayTickets.map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl ${getPriorityColor(ticket.priority)} flex items-center justify-center flex-shrink-0`}>
                  <i className={`fa-solid ${getStatusIcon(ticket.status)} text-xl`}></i>
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-white">
                      {ticket.title}
                    </h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold whitespace-nowrap ${getPriorityColor(ticket.priority)}`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400 mb-3">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(ticket.status)}`}>
                      {ticket.status}
                    </span>
                    <span>
                      <i className="fa-solid fa-clock mr-1"></i>
                      {ticket.date}
                    </span>
                    {ticket.origin === 'bot' && (
                      <span className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 px-2 py-1 rounded-lg text-xs font-bold">
                        <i className="fa-solid fa-robot mr-1"></i>
                        Vía Bot
                      </span>
                    )}
                  </div>

                  {/* Resolved Info */}
                  {ticket.status === 'resuelto' && ticket.resolvedBy && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                      <p className="text-xs text-green-800 dark:text-green-400">
                        <i className="fa-solid fa-check-circle mr-1"></i>
                        Marcado como resuelto por {ticket.resolvedBy === 'tenant' ? 'ti' : 'el agente'} el {ticket.resolvedDate}
                      </p>
                    </div>
                  )}

                  {/* Action Button */}
                  {ticket.status !== 'resuelto' && (
                    <button
                      onClick={() => onResolveTicket(ticket.id)}
                      className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold text-sm transition-all"
                    >
                      <i className="fa-solid fa-check mr-2"></i>
                      Marcar como Resuelto
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
