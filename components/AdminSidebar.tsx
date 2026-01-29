
import React from 'react';
import { TenantConfig, Theme } from '../types';
import { THEMES } from '../constants';

interface AdminSidebarProps {
  config: TenantConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ config, activeTab, onTabChange, isOpen, onClose }) => {
  const currentTheme = THEMES.find(t => t.id === config.themeId) || THEMES[0];
  
  const menuItems = [
    { id: "dashboard", icon: "fa-chart-line", label: "Dashboard" },
    { id: "propiedades", icon: "fa-house", label: "Propiedades" },
    { id: "inquilinos", icon: "fa-users", label: "Inquilinos" },
    { id: "contratos", icon: "fa-file-invoice-dollar", label: "Contratos" },
    { id: "configuracion", icon: "fa-gear", label: "Configuración" },
  ];

  const handleTabClick = (id: string) => {
    onTabChange(id);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}

      <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 z-50 transition-transform duration-300 md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold flex items-center gap-2">
               <span className={currentTheme.textClass}>{config.logoText}</span>
            </h1>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest mt-1">Administración</p>
          </div>
          <button onClick={onClose} className="md:hidden text-slate-400 hover:text-slate-800 dark:hover:text-white p-2">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => handleTabClick(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? `${currentTheme.accentClass} dark:bg-slate-800 ${currentTheme.textClass} font-bold shadow-sm` 
                  : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-white"
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5`}></i>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl flex items-center gap-3 transition-colors">
            <div className={`w-10 h-10 rounded-full ${currentTheme.bgClass} flex items-center justify-center text-white font-bold shrink-0`}>
              JD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">Juan Dueño</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Agente Inmo</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
