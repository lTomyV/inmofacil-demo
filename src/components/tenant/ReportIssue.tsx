/**
 * ReportIssue Component
 * Simple form to report maintenance issues with WhatsApp communication
 */

import React, { useState } from 'react';
import { Theme } from '../../types';
import { openWhatsApp } from '../../utils';

interface ReportIssueProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (issue: {
    title: string;
    description: string;
  }) => void;
  theme: Theme;
  whatsappNumber: string;
}

export const ReportIssue: React.FC<ReportIssueProps> = ({
  isOpen,
  onClose,
  onSubmit,
  theme,
  whatsappNumber
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!formData.title || !formData.description) {
      alert('Por favor completa el título y la descripción');
      return;
    }

    onSubmit(formData);

    // Open WhatsApp with the issue details
    const message = `🏠 *Problema Reportado*\n\n*Título:* ${formData.title}\n\n*Descripción:*\n${formData.description}\n\nGracias por reportar. ¿Podrías enviarme fotos o más detalles?`;
    openWhatsApp(whatsappNumber, message);

    onClose();

    // Reset form
    setFormData({
      title: '',
      description: ''
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              Reportar Problema
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Describe el problema y continuaremos por WhatsApp
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
          {/* Info Banner */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <i className="fa-brands fa-whatsapp text-2xl text-green-500"></i>
              <div className="flex-1">
                <p className="text-sm font-bold text-slate-800 dark:text-white mb-1">
                  Continuaremos por WhatsApp
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Después de reportar, se abrirá WhatsApp para que puedas enviar fotos y más detalles directamente.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              ¿Cuál es el problema? *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors"
              placeholder="Ej: Filtración en el baño"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-white font-medium outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-colors resize-none"
              placeholder="Describe el problema brevemente. Luego podrás enviar fotos por WhatsApp..."
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
              <i className="fa-brands fa-whatsapp mr-2"></i>
              Reportar y Abrir WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
