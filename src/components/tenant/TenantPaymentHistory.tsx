/**
 * TenantPaymentHistory Component
 * Displays payment history and upload receipts for tenants
 */

import React from 'react';
import { PaymentHistoryItem, Theme } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface TenantPaymentHistoryProps {
  paymentHistory: PaymentHistoryItem[];
  theme: Theme;
  onUploadReceipt: () => void;
}

export const TenantPaymentHistory: React.FC<TenantPaymentHistoryProps> = ({
  paymentHistory,
  theme,
  onUploadReceipt
}) => {
  const getStatusColor = (status: string) => {
    if (status === 'Pagado') return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
    if (status === 'Pendiente') return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
    return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Historial de Pagos</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Tus pagos realizados</p>
        </div>
        <button
          onClick={onUploadReceipt}
          className={`${theme.bgClass} text-white px-4 py-2 rounded-xl font-bold shadow-lg hover:scale-105 transition-all flex items-center gap-2`}
        >
          <i className="fa-solid fa-upload"></i>
          <span className="hidden md:inline">Subir Comprobante</span>
        </button>
      </div>

      <div className="divide-y divide-slate-200 dark:divide-slate-800">
        {paymentHistory.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fa-solid fa-receipt text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <p className="text-slate-500 dark:text-slate-400 font-bold">No hay pagos registrados</p>
          </div>
        ) : (
          paymentHistory.map((payment) => (
            <div key={payment.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-bold text-slate-800 dark:text-white">{payment.period}</h4>
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    <i className="fa-solid fa-calendar mr-2"></i>
                    {formatDate(payment.date)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-black text-slate-800 dark:text-white">
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
