
import React from 'react';
import { Property, TenantConfig } from '../types';

interface PropertyCardProps {
  property: Property;
  config: TenantConfig;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, config }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group relative">
      {property.featured && (
        <div className={`absolute top-4 right-4 bg-${config.primaryColor} text-white text-[10px] font-black uppercase px-2 py-1 rounded-lg z-10 shadow-lg`}>
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
          <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-slate-800 shadow-sm w-fit">
            {property.bedrooms} Dormitorio{property.bedrooms > 1 ? 's' : ''}
          </div>
          <div className={`${property.status === 'disponible' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase shadow-sm w-fit`}>
            {property.status}
          </div>
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-slate-800 mb-1 leading-tight">{property.title}</h3>
        <p className="text-slate-500 text-sm mb-4 flex items-center">
          <i className="fa-solid fa-location-dot mr-2"></i> {property.address}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xs text-slate-400 block uppercase font-bold tracking-wider">Precio</span>
            <span className={`text-xl font-bold text-${config.primaryColor}`}>
              ${property.price.toLocaleString('es-AR')}
            </span>
          </div>
          <button 
            disabled={property.status === 'alquilada' && property.type === 'alquiler'}
            className={`bg-${config.primaryColor} text-white px-4 py-2 rounded-xl text-sm font-bold hover:brightness-110 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
            onClick={() => window.open(`https://wa.me/${config.whatsappNumber}?text=Hola, estoy interesado en ${property.title}`)}
          >
            {property.status === 'alquilada' && property.type === 'alquiler' ? 'Ocupado' : 'Consultar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
