import React from 'react';
import { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
}

const TicketList: React.FC<TicketListProps> = ({ tickets }) => {
  const getPriorityConfig = (priority: string) => {
    switch (priority) {
      case 'alta':
        return { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-800 dark:text-red-400', icon: 'fa-solid fa-fire' };
      case 'media':
        return { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', icon: 'fa-solid fa-flag' };
      case 'baja':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-800 dark:text-blue-400', icon: 'fa-solid fa-circle-info' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-800 dark:text-slate-400', icon: 'fa-solid fa-circle' };
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pendiente':
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', label: 'Pendiente' };
      case 'en proceso':
        return { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400', label: 'En Proceso' };
      case 'esperando presupuesto':
        return { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-400', label: 'Esperando Presupuesto' };
      default:
        return { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-400', label: 'Sin Estado' };
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-wrench text-purple-500"></i>
          Gestión de Tickets de Reparación
        </h3>
        <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400 px-3 py-1 rounded-full text-xs font-bold">
          {tickets.length} tickets
        </span>
      </div>

      <div className="space-y-4">
        {tickets.map((ticket) => {
          const priorityConfig = getPriorityConfig(ticket.priority);
          const statusConfig = getStatusConfig(ticket.status);

          return (
            <div 
              key={ticket.id} 
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all group"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {ticket.title}
                    </h4>
                    {ticket.origin === 'bot' && (
                      <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                        <i className="fa-brands fa-whatsapp"></i>
                        Bot Automático
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`${priorityConfig.bg} ${priorityConfig.text} px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1`}>
                      <i className={priorityConfig.icon}></i>
                      {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                    </span>
                    <span className={`${statusConfig.bg} ${statusConfig.text} px-2 py-1 rounded-lg text-xs font-bold`}>
                      {statusConfig.label}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                      <i className="fa-solid fa-clock"></i>
                      {ticket.date}
                    </span>
                  </div>
                </div>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
                  <i className="fa-solid fa-eye"></i>
                  Ver Detalles
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {tickets.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fa-solid fa-clipboard-check text-slate-400 text-2xl"></i>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">No hay tickets pendientes</p>
        </div>
      )}
    </div>
  );
};

export default TicketList;
