/**
 * PaymentsManager Component
 * Manages payment receipts review and manual payment creation
 */

import React, { useState } from 'react';
import { PaymentReceipt, PaymentMethod, Theme } from '../../types';
import { formatCurrency, formatDate } from '../../utils';

interface PaymentsManagerProps {
  receipts: PaymentReceipt[];
  onApproveReceipt: (receiptId: string) => void;
  onRejectReceipt: (receiptId: string, reason: string) => void;
  onCreateManualPayment: (payment: {
    tenantId: string;
    amount: number;
    period: string;
    paymentDate: string;
    method: PaymentMethod;
    comments: string;
  }) => void;
  theme: Theme;
  isDark: boolean;
}

export const PaymentsManager: React.FC<PaymentsManagerProps> = ({
  receipts,
  onApproveReceipt,
  onRejectReceipt,
  onCreateManualPayment,
  theme,
  isDark
}) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected' | 'manual'>('pending');
  const [showManualModal, setShowManualModal] = useState(false);
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentReceipt | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Manual payment form state
  const [manualPayment, setManualPayment] = useState({
    tenantId: '',
    amount: '',
    period: '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'efectivo' as PaymentMethod,
    comments: ''
  });

  const pendingReceipts = receipts.filter(r => r.status === 'pendiente');
  const approvedReceipts = receipts.filter(r => r.status === 'aprobado');
  const rejectedReceipts = receipts.filter(r => r.status === 'rechazado');

  const getStatusBadge = (status: PaymentReceipt['status']) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      aprobado: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      rechazado: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
    };
    return styles[status];
  };

  const getMethodIcon = (method: PaymentMethod) => {
    const icons = {
      transferencia: 'fa-building-columns',
      efectivo: 'fa-money-bill-wave',
      cheque: 'fa-money-check',
      tarjeta: 'fa-credit-card',
      mercadopago: 'fa-mobile-screen'
    };
    return icons[method];
  };

  const handleApprove = (receiptId: string) => {
    onApproveReceipt(receiptId);
    setShowReceiptModal(false);
    setSelectedReceipt(null);
  };

  const handleReject = (receiptId: string) => {
    if (!rejectReason.trim()) {
      alert('Debes ingresar un motivo de rechazo');
      return;
    }
    onRejectReceipt(receiptId, rejectReason);
    setShowReceiptModal(false);
    setSelectedReceipt(null);
    setRejectReason('');
  };

  const handleCreateManualPayment = () => {
    if (!manualPayment.tenantId || !manualPayment.amount || !manualPayment.period) {
      alert('Completa todos los campos obligatorios');
      return;
    }

    onCreateManualPayment({
      ...manualPayment,
      amount: parseFloat(manualPayment.amount)
    });

    setShowManualModal(false);
    setManualPayment({
      tenantId: '',
      amount: '',
      period: '',
      paymentDate: new Date().toISOString().split('T')[0],
      method: 'efectivo',
      comments: ''
    });
  };

  const currentReceipts = activeTab === 'pending' ? pendingReceipts 
    : activeTab === 'approved' ? approvedReceipts 
    : activeTab === 'rejected' ? rejectedReceipts 
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white">
            Gestión de Cobros
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Revisa y aprueba comprobantes de pago
          </p>
        </div>
        <button
          onClick={() => setShowManualModal(true)}
          className={`${theme.bgClass} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadowClass} hover:scale-105 transition-all flex items-center gap-2`}
        >
          <i className="fa-solid fa-plus"></i>
          Registrar Pago Manual
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-yellow-600 dark:text-yellow-400 text-sm font-bold">Pendientes</span>
            <i className="fa-solid fa-clock text-yellow-600 dark:text-yellow-400 text-xl"></i>
          </div>
          <p className="text-3xl font-black text-yellow-800 dark:text-yellow-300">{pendingReceipts.length}</p>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl border-2 border-green-200 dark:border-green-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-green-600 dark:text-green-400 text-sm font-bold">Aprobados</span>
            <i className="fa-solid fa-check-circle text-green-600 dark:text-green-400 text-xl"></i>
          </div>
          <p className="text-3xl font-black text-green-800 dark:text-green-300">{approvedReceipts.length}</p>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-xl border-2 border-red-200 dark:border-red-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-red-600 dark:text-red-400 text-sm font-bold">Rechazados</span>
            <i className="fa-solid fa-times-circle text-red-600 dark:text-red-400 text-xl"></i>
          </div>
          <p className="text-3xl font-black text-red-800 dark:text-red-300">{rejectedReceipts.length}</p>
        </div>

        <div className={`${theme.bgClass} bg-opacity-10 dark:bg-opacity-20 p-6 rounded-xl border-2 ${theme.bgClass.replace('bg-', 'border-')}`}>
          <div className="flex items-center justify-between mb-2">
            <span className={`${theme.textClass} text-sm font-bold`}>Total Mes</span>
            <i className={`fa-solid fa-dollar-sign ${theme.textClass} text-xl`}></i>
          </div>
          <p className={`text-3xl font-black ${theme.textClass}`}>
            {formatCurrency(approvedReceipts.reduce((sum, r) => sum + r.amount, 0))}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'pending'
              ? `${theme.bgClass} text-white`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <i className="fa-solid fa-clock mr-2"></i>
          Pendientes ({pendingReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'approved'
              ? `${theme.bgClass} text-white`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <i className="fa-solid fa-check mr-2"></i>
          Aprobados ({approvedReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('rejected')}
          className={`px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${
            activeTab === 'rejected'
              ? `${theme.bgClass} text-white`
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          <i className="fa-solid fa-times mr-2"></i>
          Rechazados ({rejectedReceipts.length})
        </button>
      </div>

      {/* Receipts List */}
      <div className="space-y-4">
        {currentReceipts.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
            <i className="fa-solid fa-inbox text-6xl text-slate-300 dark:text-slate-600 mb-4"></i>
            <p className="text-slate-500 dark:text-slate-400 font-bold">
              No hay comprobantes en esta categoría
            </p>
          </div>
        ) : (
          currentReceipts.map((receipt) => (
            <div
              key={receipt.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all"
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Receipt Info */}
                <div className="flex-1 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-800 dark:text-white mb-1">
                        {receipt.tenantName}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {receipt.propertyAddress}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-xs font-bold ${getStatusBadge(receipt.status)}`}>
                      {receipt.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Monto</p>
                      <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(receipt.amount)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Período</p>
                      <p className="font-bold text-slate-800 dark:text-white">{receipt.period}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Método</p>
                      <p className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <i className={`fa-solid ${getMethodIcon(receipt.method)}`}></i>
                        {receipt.method}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Fecha de Pago</p>
                      <p className="font-bold text-slate-800 dark:text-white">{formatDate(receipt.paymentDate)}</p>
                    </div>
                  </div>

                  {receipt.comments && (
                    <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Comentarios</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{receipt.comments}</p>
                    </div>
                  )}

                  {receipt.reviewedBy && receipt.reviewDate && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      Revisado por <span className="font-bold">{receipt.reviewedBy}</span> el {formatDate(receipt.reviewDate)}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex lg:flex-col gap-2">
                  {receipt.receiptUrl && (
                    <button
                      onClick={() => {
                        setSelectedReceipt(receipt);
                        setShowReceiptModal(true);
                      }}
                      className="flex-1 lg:flex-none px-4 py-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition-all"
                    >
                      <i className="fa-solid fa-eye mr-2"></i>
                      Ver
                    </button>
                  )}
                  {receipt.status === 'pendiente' && (
                    <>
                      <button
                        onClick={() => handleApprove(receipt.id)}
                        className="flex-1 lg:flex-none px-4 py-2 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-all"
                      >
                        <i className="fa-solid fa-check mr-2"></i>
                        Aprobar
                      </button>
                      <button
                        onClick={() => {
                          setSelectedReceipt(receipt);
                          setShowReceiptModal(true);
                        }}
                        className="flex-1 lg:flex-none px-4 py-2 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-all"
                      >
                        <i className="fa-solid fa-times mr-2"></i>
                        Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Manual Payment Modal */}
      {showManualModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                Registrar Pago Manual
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  ID del Inquilino *
                </label>
                <input
                  type="text"
                  value={manualPayment.tenantId}
                  onChange={(e) => setManualPayment({ ...manualPayment, tenantId: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  placeholder="t1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Monto *
                  </label>
                  <input
                    type="number"
                    value={manualPayment.amount}
                    onChange={(e) => setManualPayment({ ...manualPayment, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="185000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Período *
                  </label>
                  <input
                    type="text"
                    value={manualPayment.period}
                    onChange={(e) => setManualPayment({ ...manualPayment, period: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                    placeholder="Enero 2026"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Fecha de Pago *
                  </label>
                  <input
                    type="date"
                    value={manualPayment.paymentDate}
                    onChange={(e) => setManualPayment({ ...manualPayment, paymentDate: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Método de Pago *
                  </label>
                  <select
                    value={manualPayment.method}
                    onChange={(e) => setManualPayment({ ...manualPayment, method: e.target.value as PaymentMethod })}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
                  >
                    <option value="efectivo">Efectivo</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="cheque">Cheque</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="mercadopago">MercadoPago</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Comentarios
                </label>
                <textarea
                  value={manualPayment.comments}
                  onChange={(e) => setManualPayment({ ...manualPayment, comments: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
                  placeholder="Detalles adicionales del pago..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowManualModal(false)}
                  className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateManualPayment}
                  className={`flex-1 ${theme.bgClass} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadowClass} hover:scale-105 transition-all`}
                >
                  Registrar Pago
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Detail Modal */}
      {showReceiptModal && selectedReceipt && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
              <h3 className="text-2xl font-black text-slate-800 dark:text-white">
                Detalle del Comprobante
              </h3>
              <button
                onClick={() => {
                  setShowReceiptModal(false);
                  setSelectedReceipt(null);
                  setRejectReason('');
                }}
                className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Receipt Image */}
              {selectedReceipt.receiptUrl && (
                <div className="bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden">
                  <img
                    src={selectedReceipt.receiptUrl}
                    alt="Comprobante"
                    className="w-full h-auto"
                  />
                </div>
              )}

              {/* Receipt Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Inquilino</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedReceipt.tenantName}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Propiedad</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedReceipt.propertyAddress}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Monto</p>
                  <p className="font-bold text-slate-800 dark:text-white">{formatCurrency(selectedReceipt.amount)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Período</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedReceipt.period}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Método</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedReceipt.method}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Fecha de Pago</p>
                  <p className="font-bold text-slate-800 dark:text-white">{formatDate(selectedReceipt.paymentDate)}</p>
                </div>
              </div>

              {/* Reject Reason Input */}
              {selectedReceipt.status === 'pendiente' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Motivo de Rechazo (si aplica)
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
                    placeholder="Describe por qué rechazas este comprobante..."
                  />
                </div>
              )}

              {/* Actions */}
              {selectedReceipt.status === 'pendiente' && (
                <div className="flex gap-3">
                  <button
                    onClick={() => handleReject(selectedReceipt.id)}
                    className="flex-1 px-6 py-3 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    <i className="fa-solid fa-times mr-2"></i>
                    Rechazar
                  </button>
                  <button
                    onClick={() => handleApprove(selectedReceipt.id)}
                    className="flex-1 px-6 py-3 bg-green-500 text-white rounded-xl font-bold hover:bg-green-600 transition-all"
                  >
                    <i className="fa-solid fa-check mr-2"></i>
                    Aprobar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
