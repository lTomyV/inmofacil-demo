
import React from 'react';
import { Property, TenantConfig, Theme } from '../types';
import { THEMES } from '../constants';

interface PropertyCardProps {
  property: Property;
  config: TenantConfig;
  onClick?: (property: Property) => void;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, config, onClick }) => {
  const currentTheme = THEMES.find(t => t.id === config.themeId) || THEMES[0];

  return (
    <div 
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md transition-all group relative cursor-pointer"
      onClick={() => onClick?.(property)}
    >
      {property.featured && (
        <div className={`absolute top-4 right-4 ${currentTheme.bgClass} text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg z-10 shadow-lg`}>
          Destacada
        </div>
      )}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={property.imageUrl} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 dark:text-white shadow-sm w-fit transition-colors">
            {property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}
          </div>
          <div className={`${property.status === 'disponible' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm w-fit`}>
            {property.status}
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{property.title}</h3>
        </div>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 flex items-center">
          <i className="fa-solid fa-location-dot mr-2"></i> {property.address}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 dark:text-slate-500 block uppercase font-bold tracking-wider">Precio</span>
            <span className={`text-xl font-bold ${currentTheme.textClass}`}>
              ${property.price.toLocaleString('es-AR')}
            </span>
          </div>
          <button 
            disabled={property.status === 'alquilada' && property.type === 'alquiler'}
            className={`${currentTheme.bgClass} text-white px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={(e) => {
              e.stopPropagation();
              window.open(`https://wa.me/${config.whatsappNumber}?text=Hola, estoy interesado en ${property.title}`);
            }}
          >
            {property.status === 'alquilada' && property.type === 'alquiler' ? 'Ocupado' : 'Consultar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
