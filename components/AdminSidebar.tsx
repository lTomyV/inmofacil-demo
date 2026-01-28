
import React from 'react';
import { TenantConfig } from '../types';

interface AdminSidebarProps {
  config: TenantConfig;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ config, activeTab, onTabChange }) => {
  const menuItems = [
    { id: "dashboard", icon: "fa-chart-line", label: "Dashboard" },
    { id: "propiedades", icon: "fa-house", label: "Propiedades" },
    { id: "inquilinos", icon: "fa-users", label: "Inquilinos" },
    { id: "contratos", icon: "fa-file-invoice-dollar", label: "Contratos" },
    { id: "configuracion", icon: "fa-gear", label: "Configuración" },
  ];

  return (
    <aside className="w-64 bg-white h-screen border-r border-slate-200 fixed left-0 top-0 hidden md:flex flex-col z-20">
      <div className="p-6 border-b border-slate-100">
        <h1 className="text-xl font-bold flex items-center gap-2">
           <span className={`text-${config.primaryColor}`}>{config.logoText}</span>
        </h1>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">Panel Administrador</p>
      </div>
      
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
              activeTab === item.id 
                ? `bg-${config.primaryColor}/10 text-${config.primaryColor} font-bold shadow-sm` 
                : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
            }`}
          >
            <i className={`fa-solid ${item.icon} w-5`}></i>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full bg-${config.primaryColor} flex items-center justify-center text-white font-bold`}>
            JD
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-800 truncate">Juan Dueño</p>
            <p className="text-xs text-slate-500">Agente Inmo</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
