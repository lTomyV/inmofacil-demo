import React from 'react';
import { Tenant } from '../types';

interface DelinquentTableProps {
  tenants: Tenant[];
  onWhatsApp: (number: string, message: string) => void;
}

const DelinquentTable: React.FC<DelinquentTableProps> = ({ tenants, onWhatsApp }) => {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
          <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
          Morosos Críticos
        </h3>
        <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 px-3 py-1 rounded-full text-xs font-bold">
          {tenants.length} inquilinos
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Inquilino</th>
              <th className="text-left py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estado</th>
              <th className="text-right py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Monto</th>
              <th className="text-center py-3 px-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((tenant) => {
              const isGrave = tenant.daysLate > 10;
              const statusBg = isGrave ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400';
              const statusText = isGrave ? 'Mora Grave' : 'Atraso Leve';

              return (
                <tr key={tenant.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                        {tenant.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">{tenant.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">{tenant.phone}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`${statusBg} px-3 py-1 rounded-full text-xs font-bold inline-block`}>
                      {statusText} ({tenant.daysLate}d)
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-bold text-lg text-slate-800 dark:text-white">
                      ${tenant.debtAmount.toLocaleString('es-AR')}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onWhatsApp(tenant.phone, `Hola ${tenant.name}, te recordamos que tenés un pago pendiente de $${tenant.debtAmount.toLocaleString('es-AR')}.`)}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 group"
                      >
                        <i className="fa-brands fa-whatsapp text-base"></i>
                        Inquilino
                      </button>
                      {isGrave && tenant.guarantor && (
                        <button
                          onClick={() => onWhatsApp(tenant.guarantor!.phone, `Hola ${tenant.guarantor!.name}, te contactamos porque ${tenant.name} tiene una mora de ${tenant.daysLate} días.`)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 group relative"
                        >
                          <i className="fa-brands fa-whatsapp text-base"></i>
                          <i className="fa-solid fa-exclamation absolute -top-1 -right-1 text-[10px]"></i>
                          Garante
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DelinquentTable;
