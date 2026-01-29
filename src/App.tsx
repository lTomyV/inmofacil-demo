
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_TENANT_CONFIG, INITIAL_PROPERTIES, INITIAL_TENANTS, INITIAL_CONTRACTS, INITIAL_PAYMENT_RECEIPTS, THEMES } from './constants';
import { PropertyCard } from './components/properties';
import { AdminSidebar } from './components/layout';
import { StatCard } from './components/shared';
import { CollectionPulse, DelinquentTable, ContractTimeline, TicketList } from './components/dashboard';
import { AuthModal } from './components/auth';
import { PaymentsManager } from './components/payments';
import { TenantPaymentHistory, UploadReceipt, ReportIssue, TenantTickets } from './components/tenant';
import { Tenant, TenantConfig, Property, Contract, Theme, Ticket, AppearanceMode, PaymentReceipt } from './types';
import { useLocalStorage, useDarkMode } from './hooks';
import { openWhatsApp, getPropertyInquiryMessage } from './utils';

const App: React.FC = () => {
  const [view, setView] = useState<'public' | 'admin' | 'tenant'>('public');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [publicTab, setPublicTab] = useState<'inicio' | 'alquileres' | 'ventas' | 'contacto'>('inicio');
  
  // Use custom hooks for localStorage
  const [config, setConfig] = useLocalStorage<TenantConfig>('config', INITIAL_TENANT_CONFIG);
  const [properties, setProperties] = useLocalStorage<Property[]>('properties', INITIAL_PROPERTIES);
  const [tenants, setTenants] = useLocalStorage<Tenant[]>('tenants', INITIAL_TENANTS);
  const [contracts, setContracts] = useLocalStorage<Contract[]>('contracts', INITIAL_CONTRACTS);
  const [paymentReceipts, setPaymentReceipts] = useLocalStorage<PaymentReceipt[]>('paymentReceipts', INITIAL_PAYMENT_RECEIPTS);
  const [tickets, setTickets] = useLocalStorage<Ticket[]>('tickets', [
    { id: 'tk1', title: 'Filtración en el baño principal', priority: 'alta', status: 'pendiente', origin: 'bot', date: 'Hace 2h' },
    { id: 'tk2', title: 'Cambio de foco pasillo común', priority: 'baja', status: 'en proceso', origin: 'manual', date: 'Ayer' },
    { id: 'tk3', title: 'Persiana trabada en Living', priority: 'media', status: 'esperando presupuesto', origin: 'bot', date: 'Hace 5h' },
  ]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState<'login' | 'register'>('login');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showUploadReceipt, setShowUploadReceipt] = useState(false);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  
  // --- FILTROS PÚBLICOS ---
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(true);

  // --- BUSCADORES ADMIN ---
  const [adminSearchProperty, setAdminSearchProperty] = useState('');
  const [adminSearchTenant, setAdminSearchTenant] = useState('');
  const [adminSearchContract, setAdminSearchContract] = useState('');

  // Use custom dark mode hook
  const isDark = useDarkMode(config.appearance);

  const toggleAppearance = () => {
    const nextMode: AppearanceMode = isDark ? 'light' : 'dark';
    setConfig(prev => ({ ...prev, appearance: nextMode }));
  };

  // --- MOCK DATA PARA DASHBOARD ---
  const collectionPulse = {
    totalExpected: 5000000,
    totalCollected: 3250000,
    percentage: 65
  };

  const contractTimeline = {
    thisMonth: {
      count: 2,
      properties: ['Monoambiente Los Robles 450', 'Duplex Jardín Mitre 780']
    },
    nextMonth: {
      count: 5,
      properties: ['Loft UAP Belgrano 120', 'Depto Premium San Martín 1200', 'Penthouse Costanera 10', 'Oficina Torre Central', 'Studio Balcón Junín 45']
    },
    future: {
      count: 12,
      properties: ['Casa Centro 25 de Mayo 88', 'Residencia Pueyrredón 34', 'Casa Quinta Ruta 11', 'Depto Luminoso Av. Colón', 'Cabaña El Ombú', 'Chalet Sarmiento 12', 'Y 6 más...']
    }
  };

  const delinquentTenants = tenants.filter(t => t.status !== 'Al día');

  const currentTheme = useMemo(() => THEMES.find(t => t.id === config.themeId) || THEMES[0], [config.themeId]);
  const currentTenant = useMemo(() => tenants[0], [tenants]);
  const currentTenantContract = useMemo(() => 
    contracts.find(c => c.tenantId === currentTenant?.id && c.status === 'vigente'),
    [contracts, currentTenant]
  );
  const currentTenantProperty = useMemo(() => 
    properties.find(p => p.id === currentTenantContract?.propertyId),
    [properties, currentTenantContract]
  );

  const nextPaymentDate = useMemo(() => {
    const today = new Date();
    const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 8);
    return nextMonth.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
  }, []);

  const paymentHistory = [
    { id: 'h1', period: 'Enero 2026', amount: 185000, date: '2026-01-08', status: 'Pagado' },
    { id: 'h2', period: 'Diciembre 2025', amount: 185000, date: '2025-12-08', status: 'Pagado' },
    { id: 'h3', period: 'Noviembre 2025', amount: 185000, date: '2025-11-10', status: 'Pagado' },
    { id: 'h4', period: 'Octubre 2025', amount: 185000, date: '2025-10-08', status: 'Pagado' },
  ];

  // Filter tickets for current tenant
  const tenantTickets = tickets.filter(t => t.id === 'tk1' || t.id === 'tk3'); // Mock: showing some tickets for tenant

  const filteredRentals = useMemo(() => {
    return properties.filter(p => {
      if (p.type !== 'alquiler') return false;
      if (filterOnlyAvailable && p.status !== 'disponible') return false;
      if (filterBedrooms !== 'all' && p.bedrooms.toString() !== filterBedrooms) return false;
      if (minPrice && p.price < parseInt(minPrice)) return false;
      if (maxPrice && p.price > parseInt(maxPrice)) return false;
      return true;
    });
  }, [properties, filterOnlyAvailable, filterBedrooms, minPrice, maxPrice]);

  // --- FILTROS ADMIN ---
  const filteredAdminProperties = useMemo(() => {
    return properties.filter(p => 
      p.title.toLowerCase().includes(adminSearchProperty.toLowerCase()) || 
      p.address.toLowerCase().includes(adminSearchProperty.toLowerCase()) ||
      p.id.toLowerCase().includes(adminSearchProperty.toLowerCase())
    );
  }, [properties, adminSearchProperty]);

  const filteredAdminTenants = useMemo(() => {
    return tenants.filter(t => 
      t.name.toLowerCase().includes(adminSearchTenant.toLowerCase()) ||
      t.phone.toLowerCase().includes(adminSearchTenant.toLowerCase())
    );
  }, [tenants, adminSearchTenant]);

  const filteredAdminContracts = useMemo(() => {
    return contracts.filter(c => {
      const tenant = tenants.find(t => t.id === c.tenantId);
      const prop = properties.find(p => p.id === c.propertyId);
      const search = adminSearchContract.toLowerCase();
      return (
        c.id.toLowerCase().includes(search) ||
        c.folioNumber.toLowerCase().includes(search) ||
        tenant?.name.toLowerCase().includes(search) ||
        prop?.title.toLowerCase().includes(search)
      );
    });
  }, [contracts, tenants, properties, adminSearchContract]);

  // --- HANDLERS ---
  const handleResolveTicket = (ticketId: string) => {
    setTickets(prev => prev.map(t => 
      t.id === ticketId 
        ? { 
            ...t, 
            status: 'resuelto' as const,
            resolvedBy: view === 'tenant' ? 'tenant' : 'agent',
            resolvedDate: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })
          }
        : t
    ));
  };

  const handleUpdateProperty = (updatedProperty: Property) => {
    setProperties(prev => prev.map(p => 
      p.id === updatedProperty.id ? updatedProperty : p
    ));
    setEditingProperty(null);
  };

  const resetData = () => {
    if (confirm("¿Restablecer base de datos? Se perderán todos tus cambios.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const PropertyDetailModal = () => {
    if (!selectedProperty) return null;
    const images = [
      selectedProperty.imageUrl,
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800"
    ];

    const handleShareProperty = async () => {
      const shareText = `${selectedProperty.title} - ${selectedProperty.address} | ${formatCurrency(selectedProperty.price)}`;
      const shareUrl = window.location.href;

      if (navigator.share) {
        try {
          await navigator.share({ title: selectedProperty.title, text: shareText, url: shareUrl });
        } catch {
          // User cancelled share
        }
        return;
      }

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} - ${shareUrl}`);
        alert('Enlace copiado para compartir.');
        return;
      }

      alert(`${shareText} - ${shareUrl}`);
    };

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedProperty(null)}></div>
        <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col transition-all animate-in zoom-in-95 duration-200">
          <button onClick={() => setSelectedProperty(null)} className="absolute top-6 right-6 w-10 h-10 bg-white/50 dark:bg-black/50 backdrop-blur-md rounded-full text-slate-800 dark:text-white flex items-center justify-center hover:scale-110 transition-transform z-50">
            <i className="fa-solid fa-xmark text-xl"></i>
          </button>
          
          <div className="flex-1 overflow-y-auto">
            <div className="relative h-64 md:h-[400px]">
              <img src={selectedProperty.imageUrl} className="w-full h-full object-cover" alt={selectedProperty.title} />
              <div className="absolute bottom-6 left-6 flex gap-2">
                <span className={`${selectedProperty.type === 'alquiler' ? 'bg-blue-600' : 'bg-orange-600'} text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase shadow-lg`}>
                  {selectedProperty.type === 'alquiler' ? 'Alquiler' : 'Venta'}
                </span>
                <span className={`${selectedProperty.status === 'disponible' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-1.5 rounded-full font-bold text-xs uppercase shadow-lg`}>
                  {selectedProperty.status}
                </span>
              </div>
            </div>

            <div className="p-6 md:p-10">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white mb-2 leading-tight">{selectedProperty.title}</h2>
                  <p className="text-slate-500 dark:text-slate-400 flex items-center text-lg">
                    <i className="fa-solid fa-location-dot mr-2 text-rose-500"></i> {selectedProperty.address}
                  </p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Precio</span>
                  <span className={`text-3xl md:text-5xl font-black ${currentTheme.textClass}`}>
                    ${selectedProperty.price.toLocaleString('es-AR')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i className="fa-solid fa-bed text-blue-500 mb-2"></i>
                  <p className="text-[10px] font-black uppercase text-slate-400">Dormitorios</p>
                  <p className="font-bold text-slate-800 dark:text-white">{selectedProperty.bedrooms}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i className="fa-solid fa-bath text-indigo-500 mb-2"></i>
                  <p className="text-[10px] font-black uppercase text-slate-400">Baños</p>
                  <p className="font-bold text-slate-800 dark:text-white">1 (Propio)</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i className="fa-solid fa-ruler-combined text-emerald-500 mb-2"></i>
                  <p className="text-[10px] font-black uppercase text-slate-400">Superficie</p>
                  <p className="font-bold text-slate-800 dark:text-white">-- m²</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <i className="fa-solid fa-hashtag text-slate-400 mb-2"></i>
                  <p className="text-[10px] font-black uppercase text-slate-400">Referencia</p>
                  <p className="font-bold text-slate-800 dark:text-white">#{selectedProperty.id}</p>
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-lg font-black text-slate-800 dark:text-white mb-4">Galería de Imágenes</h4>
                <div className="grid grid-cols-4 gap-2 md:gap-4">
                  {images.map((img, i) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <img src={img} className="w-full h-full object-cover" alt="Gallery" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-10">
                <h4 className="text-lg font-black text-slate-800 dark:text-white mb-4">Descripción</h4>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
                  {selectedProperty.description}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4">
                {selectedProperty.status === 'disponible' && (
                  <button 
                    onClick={() => openWhatsApp(config.whatsappNumber, `Hola, estoy interesado en ${selectedProperty.title}`)}
                    className={`flex-1 ${currentTheme.bgClass} text-white font-black py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 text-xl`}
                  >
                    <i className="fa-brands fa-whatsapp text-2xl"></i> Consultar Disponibilidad
                  </button>
                )}
                <button
                  onClick={handleShareProperty}
                  className="flex-1 bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all flex items-center justify-center gap-3 text-xl"
                >
                  <i className="fa-solid fa-share-nodes text-2xl"></i> Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const EditPropertyModal = () => {
    const [formData, setFormData] = useState<Property | null>(editingProperty);

    useEffect(() => {
      setFormData(editingProperty);
    }, [editingProperty]);

    if (!formData) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      handleUpdateProperty(formData);
    };

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setEditingProperty(null)}></div>
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col transition-all animate-in zoom-in-95 duration-200">
          <div className={`p-6 ${currentTheme.bgClass} text-white flex justify-between items-center`}>
            <div>
              <h2 className="text-2xl font-black">Editar Propiedad</h2>
              <p className="text-sm opacity-90 mt-1">Actualiza la información de la propiedad</p>
            </div>
            <button onClick={() => setEditingProperty(null)} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Título</label>
                <input 
                  type="text" 
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Referencia</label>
                <input 
                  type="text" 
                  value={`#${formData.id}`}
                  className="w-full p-3 bg-slate-100 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-500 dark:text-slate-400"
                  disabled
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Precio</label>
                <input 
                  type="number" 
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseInt(e.target.value)})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Dirección</label>
                <input 
                  type="text" 
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Dormitorios</label>
                <input 
                  type="number" 
                  value={formData.bedrooms}
                  onChange={e => setFormData({...formData, bedrooms: parseInt(e.target.value)})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                  required
                  min="1"
                />
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Destacada</label>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                  className={`w-full h-[46px] rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 transition-colors ${formData.featured ? `${currentTheme.bgClass} text-white` : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}
                >
                  <span className="text-sm font-bold">{formData.featured ? 'Sí, destacar' : 'No destacar'}</span>
                  <div className={`w-12 h-6 rounded-full relative ${formData.featured ? 'bg-white/30' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.featured ? 'translate-x-7' : 'translate-x-1'}`}></div>
                  </div>
                </button>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Tipo</label>
                <select 
                  value={formData.type}
                  onChange={e => setFormData({...formData, type: e.target.value as 'alquiler' | 'venta'})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                >
                  <option value="alquiler">Alquiler</option>
                  <option value="venta">Venta</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Estado</label>
                <select 
                  value={formData.status}
                  onChange={e => setFormData({...formData, status: e.target.value as 'disponible' | 'alquilada'})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                >
                  <option value="disponible">Disponible</option>
                  <option value="alquilada">Alquilada</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">URL de Imagen</label>
                <input 
                  type="url" 
                  value={formData.imageUrl}
                  onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-xs font-black uppercase text-slate-400 dark:text-slate-500 mb-2 block">Descripción</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white resize-none"
                  required
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => setEditingProperty(null)}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className={`flex-1 px-6 py-3 ${currentTheme.bgClass} text-white rounded-xl font-bold shadow-lg hover:brightness-110 transition-all`}
              >
                Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const ContractDetailModal = () => {
    if (!selectedContract) return null;
    const tenant = tenants.find(t => t.id === selectedContract.tenantId);
    const property = properties.find(p => p.id === selectedContract.propertyId);

    return (
      <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedContract(null)}></div>
        <div className="bg-white dark:bg-slate-900 w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl overflow-hidden relative z-10 flex flex-col animate-in zoom-in-95 duration-200">
          <div className={`p-8 ${currentTheme.bgClass} text-white flex justify-between items-start`}>
             <div>
                <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">Contrato de Locación</p>
                <h2 className="text-3xl font-black">Folio #{selectedContract.folioNumber}</h2>
             </div>
             <button onClick={() => setSelectedContract(null)} className="w-10 h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/40 transition-colors">
                <i className="fa-solid fa-xmark text-xl"></i>
             </button>
          </div>
          
          <div className="p-8 overflow-y-auto space-y-8 text-slate-800 dark:text-white">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Inquilino</h4>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500">
                    {tenant?.name[0]}
                   </div>
                   <div>
                    <p className="font-bold">{tenant?.name}</p>
                    <p className="text-xs text-slate-500">{tenant?.phone}</p>
                   </div>
                </div>
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Propiedad</h4>
                <p className="font-bold">{property?.title}</p>
                <p className="text-xs text-slate-500">{property?.address}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Vigencia</h4>
                  <p className="text-sm font-bold flex items-center gap-2">
                    <i className="fa-solid fa-calendar-alt text-blue-500"></i>
                    Desde: {selectedContract.startDate}
                  </p>
                  <p className="text-sm font-bold flex items-center gap-2 mt-1">
                    <i className="fa-solid fa-calendar-check text-rose-500"></i>
                    Hasta: {selectedContract.endDate}
                  </p>
               </div>
               <div>
                  <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Monto Actual</h4>
                  <p className={`text-2xl font-black ${currentTheme.textClass}`}>
                    ${selectedContract.monthlyAmount.toLocaleString('es-AR')}
                  </p>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Datos del Garante</h4>
               <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Nombre</p>
                    <p className="text-sm font-bold">{selectedContract.guarantor.name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">DNI</p>
                    <p className="text-sm font-bold">{selectedContract.guarantor.dni}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold">Teléfono</p>
                    <p className="text-sm font-bold">{selectedContract.guarantor.phone}</p>
                  </div>
               </div>
            </div>

            <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
               <h4 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Aumentos Estipulados</h4>
               <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 italic">
                "{selectedContract.increases}"
               </p>
            </div>
          </div>
          <div className="p-8 bg-slate-50 dark:bg-slate-800 flex gap-4">
             <button className="flex-1 py-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-all">Editar Contrato</button>
             <button className={`flex-1 py-3 ${currentTheme.bgClass} text-white rounded-xl font-bold text-sm shadow-lg hover:brightness-110 transition-all`}>Generar Recibo</button>
          </div>
        </div>
      </div>
    );
  };

  const PublicView = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-20 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xl md:text-2xl font-black tracking-tight cursor-pointer" onClick={() => setPublicTab('inicio')}>
             <span className={currentTheme.textClass}>{config.logoText}</span>
          </div>
          <nav className="hidden lg:flex gap-8 font-medium text-slate-600 dark:text-slate-400">
            {['inicio', 'alquileres', 'ventas', 'contacto'].map((t) => (
              <button key={t} onClick={() => setPublicTab(t as any)} className={`capitalize transition-colors ${publicTab === t ? `${currentTheme.textClass} font-bold` : 'hover:text-slate-900 dark:hover:text-white'}`}>{t}</button>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:gap-4">
            <button onClick={toggleAppearance} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
            </button>
            <button onClick={() => setIsLoginOpen(true)} className={`${currentTheme.bgClass} text-white px-5 md:px-6 py-2 md:py-2.5 rounded-full text-sm md:text-base font-bold shadow-lg ${currentTheme.shadowClass} hover:scale-105 transition-all`}>
              Acceder
            </button>
          </div>
        </div>
      </header>
      
      {publicTab === 'inicio' && (
        <>
          <section className="relative h-[350px] md:h-[450px] flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 z-1" />
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
            <div className="relative z-10 max-w-2xl px-4">
              <h2 className="text-3xl md:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">Tu nuevo hogar en {config.name.replace('Inmobiliaria ', '')}</h2>
              <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-xl mx-auto">
                <input type="text" placeholder="¿Qué estás buscando?" className="flex-1 px-4 py-3 bg-transparent outline-none border-none text-slate-800 dark:text-white font-medium" />
                <button onClick={() => setPublicTab('alquileres')} className={`${currentTheme.bgClass} text-white px-8 py-3 rounded-xl font-bold hover:brightness-110 active:scale-95 transition-all`}>Buscar</button>
              </div>
            </div>
          </section>
          <main className="max-w-7xl mx-auto px-4 mt-12 md:mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white">Unidades Destacadas</h3>
              <i className="fa-solid fa-star text-amber-400"></i>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {properties.filter(p => p.featured && p.status === 'disponible').map(prop => (
                <PropertyCard key={prop.id} property={prop} config={config} onClick={setSelectedProperty} />
              ))}
            </div>
          </main>
        </>
      )}

      {publicTab === 'alquileres' && (
        <main className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white capitalize mb-2">Alquileres</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base mb-8">Explora las mejores opciones para vivir hoy mismo.</p>
            
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-colors">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Precio Mínimo</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                   <input type="number" value={minPrice} onChange={e => setMinPrice(e.target.value)} placeholder="Desde" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white font-bold" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Precio Máximo</label>
                <div className="relative">
                   <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                   <input type="number" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} placeholder="Hasta" className="w-full pl-8 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white font-bold" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest">Dormitorios</label>
                <select value={filterBedrooms} onChange={e => setFilterBedrooms(e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl outline-none text-slate-800 dark:text-white font-bold appearance-none">
                  <option value="all">Cualquiera</option>
                  <option value="1">1 Dormitorio</option>
                  <option value="2">2 Dormitorios</option>
                  <option value="3">3 Dormitorios</option>
                  <option value="4">4+ Dormitorios</option>
                </select>
              </div>
              <div className="flex items-center justify-between sm:justify-center sm:gap-6 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">Solo disponibles</span>
                <button onClick={() => setFilterOnlyAvailable(!filterOnlyAvailable)} className={`w-12 h-6 rounded-full relative transition-colors ${filterOnlyAvailable ? currentTheme.bgClass : 'bg-slate-300 dark:bg-slate-600'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${filterOnlyAvailable ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {filteredRentals.length > 0 ? (
              filteredRentals.map(prop => (
                <PropertyCard key={prop.id} property={prop} config={config} onClick={setSelectedProperty} />
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <i className="fa-solid fa-house-chimney-crack text-4xl text-slate-300 mb-4 block"></i>
                <p className="text-slate-500 dark:text-slate-400 font-bold">No encontramos propiedades que coincidan con tus filtros.</p>
                <button onClick={() => {setMinPrice(''); setMaxPrice(''); setFilterBedrooms('all'); setFilterOnlyAvailable(true);}} className="mt-4 text-blue-600 font-bold underline">Limpiar filtros</button>
              </div>
            )}
          </div>
        </main>
      )}

      {publicTab === 'ventas' && (
        <main className="max-w-7xl mx-auto px-4 mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="mb-8">
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white capitalize">Ventas</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm md:text-base">Tu próxima inversión está aquí.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
            {properties.filter(p => p.type === 'venta' && p.status === 'disponible').map(prop => (
              <PropertyCard key={prop.id} property={prop} config={config} onClick={setSelectedProperty} />
            ))}
          </div>
        </main>
      )}

      {PropertyDetailModal()}
    </div>
  );

  const AdminView = (
    <div className={`min-h-screen bg-slate-50 dark:bg-slate-950 transition-all duration-300 ${isSidebarCollapsed ? 'md:pl-20' : 'md:pl-72'}`}>
      <AdminSidebar 
        config={config} 
        activeTab={adminTab} 
        onTabChange={setAdminTab} 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 h-16 flex items-center justify-between sticky top-0 z-30 transition-colors">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600 dark:text-slate-400"><i className="fa-solid fa-bars text-xl"></i></button>
        <span className="font-bold text-slate-800 dark:text-white">{config.logoText}</span>
        <div className={`w-8 h-8 rounded-full ${currentTheme.bgClass} flex items-center justify-center text-white text-xs font-bold`}>JD</div>
      </div>
      
      <main className="p-4 md:p-10 animate-in fade-in duration-500 text-slate-800 dark:text-white">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">¡Hola de nuevo, Juan Dueño! 👋</h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm">Tu inmobiliaria está bajo control hoy.</p>
          </div>
          <div className="flex gap-2">
             <button onClick={toggleAppearance} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shadow-sm">
              <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'}`}></i>
             </button>
             <button className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-800 dark:hover:text-white transition-colors shadow-sm"><i className="fa-solid fa-bell"></i></button>
          </div>
        </header>

        {adminTab === 'dashboard' && (
          <div className="space-y-8 pb-10">
            {/* Pulso de Cobranza Mensual */}
            <CollectionPulse 
              totalExpected={collectionPulse.totalExpected}
              totalCollected={collectionPulse.totalCollected}
              percentage={collectionPulse.percentage}
            />

            {/* Tabla de Morosos Críticos */}
            <DelinquentTable tenants={delinquentTenants} />

            {/* Semáforo de Vencimientos */}
            <ContractTimeline data={contractTimeline} />

            {/* Gestión de Tickets */}
            <TicketList tickets={tickets} />

            {/* Stats Cards Adicionales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard 
                label="Propiedades Activas" 
                value={properties.filter(p => p.status === 'alquilada').length.toString()} 
                icon="fa-building" 
                trend="+2 este mes"
                color="blue-600" 
              />
              <StatCard 
                label="Tasa de Ocupación" 
                value="87%" 
                icon="fa-chart-pie" 
                trend="+5% vs mes anterior"
                color="emerald-600" 
              />
              <StatCard 
                label="Tickets Abiertos" 
                value={tickets.filter(t => t.status !== 'en proceso').length.toString()} 
                icon="fa-wrench" 
                color="purple-600" 
              />
            </div>
          </div>
        )}

        {adminTab === 'propiedades' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <h3 className="font-bold text-xl dark:text-white">Propiedades</h3>
              <div className="flex-1 max-w-md relative">
                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                 <input 
                  type="text" 
                  value={adminSearchProperty}
                  onChange={(e) => setAdminSearchProperty(e.target.value)}
                  placeholder="Buscar por título, dirección o ID..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                 />
              </div>
              <button className={`${currentTheme.bgClass} text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md shrink-0`}>+ Nueva</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAdminProperties.map(p => (
                <div key={p.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors group">
                  <div className="relative h-32">
                    <img src={p.imageUrl} className="w-full h-full object-cover" alt={p.title} />
                    <div className="absolute top-2 right-2">
                       <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase shadow-sm ${p.status === 'disponible' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold truncate text-sm mb-1 dark:text-white">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate mb-3">{p.address}</p>
                    <div className="flex justify-between items-center pt-3 border-t border-slate-50 dark:border-slate-800">
                       <span className={`font-bold text-xs ${currentTheme.textClass}`}>{p.price.toLocaleString()}</span>
                       <button 
                         onClick={() => setEditingProperty(p)}
                         className={`${currentTheme.textClass} hover:scale-110 transition-transform`}
                         title="Editar propiedad"
                       >
                         <i className="fa-solid fa-pen-to-square"></i>
                       </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'inquilinos' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
              <h3 className="font-bold text-xl dark:text-white">Base de Inquilinos</h3>
              <div className="flex-1 max-w-md relative">
                 <i className="fa-solid fa-magnifying-glass absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                 <input 
                  type="text" 
                  value={adminSearchTenant}
                  onChange={(e) => setAdminSearchTenant(e.target.value)}
                  placeholder="Buscar por nombre o teléfono..." 
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20"
                 />
              </div>
              <button className="text-sm font-bold text-blue-600 dark:text-blue-400 shrink-0">+ Agregar Inquilino</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">
                  <tr><th className="px-6 py-4">Nombre</th><th className="px-6 py-4">Status Pago</th><th className="px-6 py-4">Deuda</th><th className="px-6 py-4 text-right">Contacto</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredAdminTenants.map(t => (
                    <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-sm">
                      <td className="px-6 py-4 font-bold dark:text-white">{t.name}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${t.status === 'Al día' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{t.status}</span>
                      </td>
                      <td className="px-6 py-4 font-black dark:text-slate-300">${t.debtAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-emerald-500 p-2 hover:scale-110 transition-transform"><i className="fa-brands fa-whatsapp text-lg"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'contratos' && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
               <h3 className="font-bold text-xl dark:text-white">Contratos</h3>
               <div className="flex-1 max-w-md relative">
                  <i className="fa-solid fa-file-contract absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"></i>
                  <input 
                    type="text" 
                    value={adminSearchContract}
                    onChange={(e) => setAdminSearchContract(e.target.value)}
                    placeholder="Buscar por folio, inquilino o propiedad..." 
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none"
                  />
               </div>
               <button className={`${currentTheme.bgClass} text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md`}>+ Nuevo Contrato</button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm transition-colors">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-colors">
                    <tr>
                      <th className="px-6 py-4">Folio</th>
                      <th className="px-6 py-4">Inquilino / Propiedad</th>
                      <th className="px-6 py-4">Vencimiento</th>
                      <th className="px-6 py-4">Monto</th>
                      <th className="px-6 py-4 text-right">Ver</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredAdminContracts.map(c => {
                      const tenant = tenants.find(t => t.id === c.tenantId);
                      const prop = properties.find(p => p.id === c.propertyId);
                      return (
                        <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-all" onClick={() => setSelectedContract(c)}>
                          <td className="px-6 py-4">
                             <span className="font-black text-blue-600 dark:text-blue-400">{c.folioNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="min-w-0">
                               <p className="text-sm font-bold dark:text-white truncate">{tenant?.name}</p>
                               <p className="text-[10px] text-slate-500 truncate">{prop?.title}</p>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400">
                            {c.endDate}
                          </td>
                          <td className="px-6 py-4">
                             <span className="text-sm font-black text-slate-800 dark:text-white">${c.monthlyAmount.toLocaleString()}</span>
                          </td>
                          <td className="px-6 py-4 text-right">
                             <button className="text-slate-400 hover:text-blue-500"><i className="fa-solid fa-circle-info text-lg"></i></button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {adminTab === 'cobros' && (
          <PaymentsManager
            receipts={paymentReceipts}
            onApproveReceipt={(receiptId) => {
              setPaymentReceipts(prev => prev.map(r => 
                r.id === receiptId 
                  ? { ...r, status: 'aprobado', reviewedBy: 'Juan Dueño', reviewDate: new Date().toISOString() }
                  : r
              ));
            }}
            onRejectReceipt={(receiptId, reason) => {
              setPaymentReceipts(prev => prev.map(r => 
                r.id === receiptId 
                  ? { ...r, status: 'rechazado', comments: reason, reviewedBy: 'Juan Dueño', reviewDate: new Date().toISOString() }
                  : r
              ));
            }}
            onCreateManualPayment={(payment) => {
              const newReceipt: PaymentReceipt = {
                id: `pr${Date.now()}`,
                tenantId: payment.tenantId,
                tenantName: tenants.find(t => t.id === payment.tenantId)?.name || 'Desconocido',
                propertyAddress: 'Pago Manual',
                amount: payment.amount,
                period: payment.period,
                uploadDate: new Date().toISOString(),
                paymentDate: payment.paymentDate,
                method: payment.method,
                status: 'aprobado',
                comments: payment.comments,
                reviewedBy: 'Juan Dueño',
                reviewDate: new Date().toISOString()
              };
              setPaymentReceipts(prev => [...prev, newReceipt]);
            }}
            theme={currentTheme}
            isDark={isDark}
          />
        )}

        {adminTab === 'configuracion' && (
          <div className="max-w-2xl space-y-6 text-slate-800 dark:text-slate-200">
            <div className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800 transition-colors">
              <h3 className="text-xl font-bold mb-6">Identidad de la Inmobiliaria</h3>
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-3 block tracking-widest">Tema de Colores</label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">Selecciona los colores característicos de tu inmobiliaria</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {THEMES.map((theme) => (
                      <button 
                        key={theme.id} 
                        onClick={() => setConfig({...config, themeId: theme.id})}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${
                          config.themeId === theme.id 
                            ? `${theme.bgClass} border-transparent text-white shadow-lg scale-105` 
                            : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 rounded-xl ${theme.bgClass} flex items-center justify-center ${config.themeId === theme.id ? 'bg-white/20' : ''}`}>
                            <i className={`fa-solid fa-palette text-xl ${config.themeId === theme.id ? 'text-white' : 'text-white'}`}></i>
                          </div>
                          <div>
                            <p className={`font-bold ${config.themeId === theme.id ? 'text-white' : 'text-slate-800 dark:text-white'}`}>
                              {theme.name}
                            </p>
                            <p className={`text-xs ${config.themeId === theme.id ? 'text-white/80' : 'text-slate-500 dark:text-slate-400'}`}>
                              {theme.id === 'ocean' && 'Profesional y confiable'}
                              {theme.id === 'nature' && 'Fresco y natural'}
                              {theme.id === 'midnight' && 'Elegante y moderno'}
                              {theme.id === 'sunset' && 'Cálido y acogedor'}
                              {theme.id === 'ruby' && 'Dinámico y enérgico'}
                              {theme.id === 'violet' && 'Sofisticado y premium'}
                              {theme.id === 'teal' && 'Innovador y tech'}
                              {theme.id === 'amber' && 'Prestigioso y dorado'}
                              {theme.id === 'rose' && 'Delicado y chic'}
                              {theme.id === 'slate' && 'Neutro y corporativo'}
                            </p>
                          </div>
                          {config.themeId === theme.id && (
                            <i className="fa-solid fa-check ml-auto text-xl text-white"></i>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 mb-1 block">Nombre Comercial</label>
                  <input type="text" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full p-3 md:p-4 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl outline-none text-slate-800 dark:text-white" />
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-rose-100 dark:border-rose-900/30 transition-colors">
              <h3 className="text-xl font-bold mb-4 text-rose-600">Mantenimiento</h3>
              <button onClick={resetData} className="w-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 font-bold py-4 rounded-2xl border border-rose-100 dark:border-rose-900/30 hover:bg-rose-100 transition-colors shadow-sm">Limpiar Caché y Reiniciar Base de Datos</button>
            </div>
          </div>
        )}
      </main>
      {ContractDetailModal()}
      {EditPropertyModal()}
    </div>
  );

  const TenantView = (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 px-4 h-20 flex items-center justify-between transition-colors">
        <span className={currentTheme.textClass + " font-black text-xl"}>{config.logoText}</span>
        <div className="flex items-center gap-4">
          <button onClick={toggleAppearance} className="w-10 h-10 flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
            <i className={`fa-solid ${isDark ? 'fa-sun' : 'fa-moon'} text-lg`}></i>
          </button>
          <div className={`w-10 h-10 rounded-full ${currentTheme.bgClass} flex items-center justify-center text-white font-bold`}>{currentTenant?.name[0] || 'U'}</div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 text-slate-800 dark:text-white animate-in fade-in duration-500">
        {/* Welcome Section */}
        <section>
          <h2 className="text-3xl font-black mb-2">Hola, {currentTenant?.name}! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Gestiona tu alquiler de forma simple y rápida</p>
        </section>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => setShowUploadReceipt(true)}
            className={`${currentTheme.bgClass} text-white p-6 rounded-2xl shadow-lg hover:scale-105 transition-all text-left`}
          >
            <i className="fa-solid fa-upload text-3xl mb-3"></i>
            <h3 className="font-black text-lg">Subir Comprobante</h3>
            <p className="text-sm opacity-90 mt-1">Informa tu pago del mes</p>
          </button>

          <button
            onClick={() => setShowReportIssue(true)}
            className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all text-left"
          >
            <i className="fa-solid fa-wrench text-3xl mb-3 text-orange-500"></i>
            <h3 className="font-black text-lg">Reportar Problema</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Mantenimiento de tu propiedad</p>
          </button>

          <button
            onClick={() => openWhatsApp(config.whatsappNumber, '¡Hola! Necesito ayuda con mi alquiler.')}
            className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white p-6 rounded-2xl shadow-sm hover:shadow-lg hover:scale-105 transition-all text-left"
          >
            <i className="fa-brands fa-whatsapp text-3xl mb-3 text-green-500"></i>
            <h3 className="font-black text-lg">Contactar</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Hablar con la inmobiliaria</p>
          </button>
        </div>

        {/* Payment Card & Property */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-6 rounded-3xl shadow-lg text-white">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm opacity-90 mb-1">Próximo Vencimiento</p>
                <h3 className="text-2xl font-black">{nextPaymentDate}</h3>
              </div>
              <i className="fa-solid fa-calendar-days text-3xl opacity-50"></i>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 mt-4">
              <p className="text-sm opacity-90 mb-1">Monto a pagar</p>
              <p className="text-3xl font-black">${currentTenantContract?.monthlyAmount.toLocaleString()}</p>
            </div>
          </div>

          {currentTenantProperty ? (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col transition-colors">
              <img src={currentTenantProperty.imageUrl} className="h-40 w-full object-cover" alt="Propiedad" />
              <div className="p-6 flex flex-col flex-1">
                <h4 className="font-black text-lg mb-2 dark:text-white">{currentTenantProperty.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 flex items-center mb-4">
                  <i className="fa-solid fa-location-dot mr-2"></i>
                  {currentTenantProperty.address}
                </p>
                <button 
                  onClick={() => setSelectedProperty(currentTenantProperty)} 
                  className={`mt-auto ${currentTheme.bgClass} text-white py-3 rounded-xl font-bold hover:brightness-110 transition-all`}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-center text-center">
              <p className="text-slate-400 font-bold">No tienes un contrato activo.</p>
            </div>
          )}
        </div>

        {/* Payment History */}
        <TenantPaymentHistory
          paymentHistory={paymentHistory}
          theme={currentTheme}
          onUploadReceipt={() => setShowUploadReceipt(true)}
        />

        {/* Tickets */}
        <TenantTickets
          tickets={tenantTickets}
          theme={currentTheme}
          onReportIssue={() => setShowReportIssue(true)}
          onResolveTicket={handleResolveTicket}
        />

        {/* Contract Details */}
        {currentTenantContract && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 transition-colors">
            <h3 className="text-xl font-black mb-4 text-slate-800 dark:text-white">Detalles del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Folio</p>
                <p className="font-bold text-slate-800 dark:text-white">{currentTenantContract.folioNumber}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Inicio</p>
                <p className="font-bold text-slate-800 dark:text-white">{new Date(currentTenantContract.startDate).toLocaleDateString('es-ES')}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Vencimiento</p>
                <p className="font-bold text-slate-800 dark:text-white">{new Date(currentTenantContract.endDate).toLocaleDateString('es-ES')}</p>
              </div>
              <div className="md:col-span-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Aumentos</p>
                <p className="text-slate-700 dark:text-slate-300">{currentTenantContract.increases}</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <UploadReceipt
        isOpen={showUploadReceipt}
        onClose={() => setShowUploadReceipt(false)}
        onUpload={(receipt) => {
          const newReceipt: PaymentReceipt = {
            id: `pr${Date.now()}`,
            tenantId: currentTenant.id,
            tenantName: currentTenant.name,
            propertyAddress: currentTenantProperty?.address || 'N/A',
            amount: receipt.amount,
            period: receipt.period,
            uploadDate: new Date().toISOString(),
            paymentDate: receipt.paymentDate,
            method: receipt.method,
            status: 'pendiente',
            comments: receipt.comments
          };
          setPaymentReceipts(prev => [...prev, newReceipt]);
          alert('¡Comprobante subido exitosamente! Será revisado pronto.');
        }}
        theme={currentTheme}
        suggestedAmount={currentTenantContract?.monthlyAmount}
        suggestedPeriod="Enero 2026"
      />

      <ReportIssue
        isOpen={showReportIssue}
        onClose={() => setShowReportIssue(false)}
        onSubmit={(issue) => {
          console.log('New issue reported:', issue);
          alert('¡Problema reportado exitosamente! Nos contactaremos pronto.');
        }}
        theme={currentTheme}
        whatsappNumber={config.whatsappNumber}
      />

      {PropertyDetailModal()}
    </div>
  );

  return (
    <>
      {view === 'public' && PublicView}
      {view === 'admin' && AdminView}
      {view === 'tenant' && TenantView}

      {/* Auth Modal */}
      <AuthModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        activeTab={loginTab}
        onTabChange={setLoginTab}
        theme={currentTheme}
        isDark={isDark}
      />

      <div className="fixed bottom-6 right-6 z-[100] group flex flex-col items-end">
        <div className="flex flex-col items-end gap-3 pb-4 pointer-events-none group-hover:pointer-events-auto opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
          {view !== 'admin' && <button onClick={() => setView('admin')} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 font-bold text-xs flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"><i className="fa-solid fa-user-tie text-blue-600"></i> Panel de Agente</button>}
          {view !== 'tenant' && <button onClick={() => setView('tenant')} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 font-bold text-xs flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"><i className="fa-solid fa-user-graduate text-emerald-600"></i> Panel de Inquilino</button>}
          {view !== 'public' && <button onClick={() => setView('public')} className="bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-800 font-bold text-xs flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"><i className="fa-solid fa-globe text-indigo-600"></i> Sitio Público</button>}
        </div>
        <div className="relative">
          <button className="demo-button text-white w-14 h-14 md:w-16 md:h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95">
            <i className="fa-solid fa-eye text-lg md:text-xl"></i>
          </button>
          <span className="demo-badge absolute -top-1 -right-1 bg-rose-500 text-white text-[7px] md:text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow-lg ring-2 ring-white dark:ring-slate-900">Demo</span>
        </div>
      </div>
    </>
  );
};

export default App;
