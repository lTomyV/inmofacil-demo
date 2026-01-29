/**
 * AdminSidebar Component
 * Navigation sidebar for admin panel with collapse functionality
 */

import React from 'react';
import { TenantConfig } from '../../types';
import { THEMES } from '../../constants';

export interface AdminSidebarProps {
  config: TenantConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  config,
  activeTab,
  onTabChange,
  isOpen,
  onClose,
  isCollapsed,
  onToggleCollapse,
}) => {
  const currentTheme = THEMES.find(t => t.id === config.themeId) || THEMES[0];
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
    { id: 'propiedades', label: 'Propiedades', icon: 'fa-building' },
    { id: 'inquilinos', label: 'Inquilinos', icon: 'fa-users' },
    { id: 'contratos', label: 'Contratos', icon: 'fa-file-contract' },
    { id: 'cobros', label: 'Cobros', icon: 'fa-money-bill-wave' },
    { id: 'configuracion', label: 'Configuración', icon: 'fa-cog' },
  ];

  // Fake user data
  const currentUser = {
    name: 'Juan Dueño',
    role: 'Agente Inmobiliario',
    avatar: 'JD',
    email: 'juan.dueno@inmolibertador.com'
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-50 transition-all duration-300 flex flex-col overflow-hidden ${
          isCollapsed ? 'w-20' : 'w-72'
        } ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center justify-between gap-2">
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-black text-slate-800 dark:text-white truncate">
                  {config.logoText}
                </h2>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">
                  Panel Admin
                </p>
              </div>
            )}
            
            {/* Collapse Toggle Button - Desktop only */}
            <button
              onClick={onToggleCollapse}
              className={`hidden md:flex w-8 h-8 items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              title={isCollapsed ? 'Expandir' : 'Contraer'}
            >
              <i className={`fa-solid ${isCollapsed ? 'fa-angles-right' : 'fa-angles-left'} text-sm`}></i>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onClose}
              className="md:hidden w-8 h-8 flex items-center justify-center text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 flex-1 overflow-y-auto overflow-x-hidden">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onTabChange(item.id);
                onClose();
              }}
              className={`w-full text-left px-4 py-3 rounded-xl mb-2 transition-all flex items-center gap-3 group relative ${
                activeTab === item.id
                  ? `${currentTheme.bgClass} text-white shadow-lg ${currentTheme.shadowClass}`
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? item.label : ''}
            >
              <i className={`fa-solid ${item.icon} text-lg`}></i>
              {!isCollapsed && <span className="font-bold">{item.label}</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </button>
          ))}
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex-shrink-0">
          {!isCollapsed ? (
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-12 h-12 rounded-full ${currentTheme.bgClass} flex items-center justify-center text-white font-bold text-lg shrink-0`}>
                  {currentUser.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    {currentUser.role}
                  </p>
                </div>
              </div>
              <button className="w-full px-3 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-900 rounded-lg transition-all flex items-center justify-center gap-2">
                <i className="fa-solid fa-right-from-bracket"></i>
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className={`w-12 h-12 rounded-full ${currentTheme.bgClass} flex items-center justify-center text-white font-bold text-lg cursor-pointer hover:scale-110 transition-transform group relative`}>
                {currentUser.avatar}
                <div className="absolute left-full ml-2 px-3 py-2 bg-slate-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                  {currentUser.name}
                </div>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
