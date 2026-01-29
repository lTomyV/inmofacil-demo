/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel
 */

import React from 'react';
import { TenantConfig } from '../../types';

export interface AdminSidebarProps {
  config: TenantConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  config,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'propiedades', label: 'Propiedades', icon: 'fa-building' },
    { id: 'inquilinos', label: 'Inquilinos', icon: 'fa-users' },
    { id: 'contratos', label: 'Contratos', icon: 'fa-file-contract' },
    { id: 'configuracion', label: 'Configuración', icon: 'fa-cog' },
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black text-slate-800 dark:text-white">
              {config.logoText}
            </h2>
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all flex items-center gap-3 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              <span className="font-bold">{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
};
