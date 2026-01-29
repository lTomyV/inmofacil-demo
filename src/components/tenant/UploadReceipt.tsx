/**
 * UploadReceipt Component
 * Modal for tenants to upload payment receipts
 */

import React, { useState } from 'react';
import { PaymentMethod, Theme } from '../../types';

interface UploadReceiptProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (receipt: {
    amount: number;
    period: string;
    paymentDate: string;
    method: PaymentMethod;
    comments: string;
    receiptFile?: File;
  }) => void;
  theme: Theme;
  suggestedAmount?: number;
  suggestedPeriod?: string;
}

export const UploadReceipt: React.FC<UploadReceiptProps> = ({
  isOpen,
  onClose,
  onUpload,
  theme,
  suggestedAmount,
  suggestedPeriod
}) => {
  const [formData, setFormData] = useState({
    amount: suggestedAmount?.toString() || '',
    period: suggestedPeriod || '',
    paymentDate: new Date().toISOString().split('T')[0],
    method: 'transferencia' as PaymentMethod,
    comments: '',
    receiptFile: null as File | null
  });

  const [preview, setPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, receiptFile: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    if (!formData.amount || !formData.period || !formData.paymentDate) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    onUpload({
      amount: parseFloat(formData.amount),
      period: formData.period,
      paymentDate: formData.paymentDate,
      method: formData.method,
      comments: formData.comments,
      receiptFile: formData.receiptFile || undefined
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              Subir Comprobante
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Adjunta el comprobante de tu pago
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Comprobante *
            </label>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <button
                    onClick={() => {
                      setPreview(null);
                      setFormData({ ...formData, receiptFile: null });
                    }}
                    className="text-red-500 hover:text-red-600 font-bold"
                  >
                    <i className="fa-solid fa-trash mr-2"></i>
                    Eliminar
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="space-y-2">
                    <i className="fa-solid fa-cloud-arrow-up text-6xl text-slate-300 dark:text-slate-600"></i>
                    <p className="text-slate-600 dark:text-slate-400 font-bold">
                      Haz clic para seleccionar un archivo
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      PNG, JPG, PDF (máx. 10MB)
                    </p>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Monto *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value })}
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
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                Método de Pago *
              </label>
              <select
                value={formData.method}
                onChange={(e) => setFormData({ ...formData, method: e.target.value as PaymentMethod })}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              >
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
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
              value={formData.comments}
              onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
              placeholder="Detalles adicionales del pago..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className={`flex-1 ${theme.bgClass} text-white px-6 py-3 rounded-xl font-bold shadow-lg ${theme.shadowClass} hover:scale-105 transition-all`}
            >
              <i className="fa-solid fa-upload mr-2"></i>
              Subir Comprobante
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
