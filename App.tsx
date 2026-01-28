
import React, { useState, useMemo, useEffect } from 'react';
import { INITIAL_TENANT_CONFIG, INITIAL_PROPERTIES, INITIAL_TENANTS, INITIAL_CONTRACTS } from './constants';
import PropertyCard from './components/PropertyCard';
import AdminSidebar from './components/AdminSidebar';
import StatCard from './components/StatCard';
import { Tenant, TenantConfig, Property, Contract } from './types';

const App: React.FC = () => {
  // --- PERSISTENCE HELPERS ---
  const getInitialData = <T,>(key: string, fallback: T): T => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback;
  };

  // --- GLOBAL STATES ---
  const [view, setView] = useState<'public' | 'admin' | 'tenant'>('public');
  const [adminTab, setAdminTab] = useState<string>('dashboard');
  const [publicTab, setPublicTab] = useState<'inicio' | 'alquileres' | 'ventas' | 'contacto'>('inicio');
  const [config, setConfig] = useState<TenantConfig>(() => getInitialData('inmo_config', INITIAL_TENANT_CONFIG));
  
  // --- ENTITY STATES ---
  const [properties, setProperties] = useState<Property[]>(() => getInitialData('inmo_properties', INITIAL_PROPERTIES));
  const [tenants, setTenants] = useState<Tenant[]>(() => getInitialData('inmo_tenants', INITIAL_TENANTS));
  const [contracts, setContracts] = useState<Contract[]>(() => getInitialData('inmo_contracts', INITIAL_CONTRACTS));

  // Simulación de inquilino logueado (Mateo Gomez por defecto)
  const currentTenant = useMemo(() => tenants[0], [tenants]);
  const currentTenantContract = useMemo(() => 
    contracts.find(c => c.tenantId === currentTenant?.id && c.status === 'vigente'),
    [contracts, currentTenant]
  );
  const currentTenantProperty = useMemo(() => 
    properties.find(p => p.id === currentTenantContract?.propertyId),
    [properties, currentTenantContract]
  );

  // --- SYNC TO LOCALSTORAGE ---
  useEffect(() => {
    localStorage.setItem('inmo_config', JSON.stringify(config));
    localStorage.setItem('inmo_properties', JSON.stringify(properties));
    localStorage.setItem('inmo_tenants', JSON.stringify(tenants));
    localStorage.setItem('inmo_contracts', JSON.stringify(contracts));
  }, [config, properties, tenants, contracts]);

  // --- UI & FILTERS ---
  const [filterBedrooms, setFilterBedrooms] = useState<string>('all');
  const [filterMaxPrice, setFilterMaxPrice] = useState<number>(1000000);
  const [filterOnlyAvailable, setFilterOnlyAvailable] = useState<boolean>(true);
  const [showAddProperty, setShowAddProperty] = useState(false);
  const [showAddTenant, setShowAddTenant] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [newProp, setNewProp] = useState<Partial<Property>>({ type: 'alquiler', bedrooms: 1, featured: false, status: 'disponible' });
  const [newTenant, setNewTenant] = useState<Partial<Tenant>>({ status: 'Al día', debtAmount: 0, daysLate: 0 });

  // --- LOGIC ---
  const stats = useMemo(() => {
    const totalTenants = tenants.length;
    const delinquentTenants = tenants.filter(t => t.status !== "Al día").length;
    const collectionRate = totalTenants > 0 ? ((totalTenants - delinquentTenants) / totalTenants * 100).toFixed(0) : "0";
    const totalActiveRent = contracts.filter(c => c.status === 'vigente').reduce((acc, curr) => acc + curr.monthlyAmount, 0);
    return {
      delinquentCount: delinquentTenants,
      collectionRate: `${collectionRate}%`,
      totalActiveRent: `$${totalActiveRent.toLocaleString('es-AR')}`,
    };
  }, [tenants, contracts]);

  const handleWhatsApp = (number: string, message: string) => {
    const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const resetData = () => {
    if (confirm("¿Restablecer base de datos? Se perderán todos tus cambios.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const addProperty = () => {
    if (!newProp.title || !newProp.price) {
      alert("Completa título y precio");
      return;
    }
    const property: Property = {
      id: `p-${Date.now()}`,
      title: newProp.title || '',
      price: Number(newProp.price) || 0,
      address: newProp.address || 'Libertador San Martín',
      bedrooms: Number(newProp.bedrooms) || 1,
      imageUrl: newProp.imageUrl || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=400',
      description: newProp.description || '',
      type: (newProp.type as any) || 'alquiler',
      status: 'disponible',
      featured: newProp.featured || false
    };
    setProperties(prev => [...prev, property]);
    setShowAddProperty(false);
    setNewProp({ type: 'alquiler', bedrooms: 1, featured: false, status: 'disponible' });
  };

  const addTenant = () => {
    if (!newTenant.name || !newTenant.phone) {
      alert("Completa nombre y teléfono");
      return;
    }
    const tenant: Tenant = {
      id: `t-${Date.now()}`,
      name: newTenant.name || '',
      phone: newTenant.phone || '',
      status: 'Al día',
      debtAmount: 0,
      daysLate: 0,
      guarantor: newTenant.guarantor?.name ? newTenant.guarantor : undefined
    };
    setTenants(prev => [...prev, tenant]);
    setShowAddTenant(false);
    setNewTenant({ status: 'Al día', debtAmount: 0, daysLate: 0 });
  };

  const rentProperty = (propertyId: string, tenantId: string) => {
    const prop = properties.find(p => p.id === propertyId);
    if (!prop) return;
    const newContractId = `c-${Date.now()}`;
    const newContract: Contract = {
      id: newContractId,
      propertyId,
      tenantId,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      monthlyAmount: prop.price,
      status: 'vigente'
    };
    setContracts(prev => [...prev, newContract]);
    setProperties(prev => prev.map(p => p.id === propertyId ? { ...p, status: 'alquilada', tenantId, contractId: newContractId } : p));
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditingProperty(null);
  };

  // --- RENDER CONTENT BLOCKS ---
  const featuredProps = properties.filter(p => p.featured && p.status === 'disponible');
  const filteredRentals = properties.filter(p => {
    if (p.type !== 'alquiler') return false;
    if (filterBedrooms !== 'all' && p.bedrooms.toString() !== filterBedrooms) return false;
    if (p.price > filterMaxPrice) return false;
    if (filterOnlyAvailable && p.status !== 'disponible') return false;
    return true;
  });

  // --- VIEW COMPONENTS (Flat to avoid focus bug) ---
  
  const PublicView = (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight cursor-pointer" onClick={() => setPublicTab('inicio')}>
             <span className={`text-${config.primaryColor}`}>{config.logoText}</span>
          </div>
          <nav className="hidden md:flex gap-8 font-medium text-slate-600">
            {['inicio', 'alquileres', 'ventas', 'contacto'].map((t) => (
              <button key={t} onClick={() => setPublicTab(t as any)} className={`capitalize transition-colors ${publicTab === t ? `text-${config.primaryColor} font-bold` : 'hover:text-slate-900'}`}>{t}</button>
            ))}
          </nav>
          <button onClick={() => setView('tenant')} className={`bg-${config.primaryColor} text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-${config.primaryColor}/20 hover:scale-105 transition-all`}>Entrar Mi Inmo</button>
        </div>
      </header>

      {publicTab === 'inicio' && (
        <>
          <section className="relative h-[450px] flex items-center justify-center text-center overflow-hidden">
            <div className="absolute inset-0 bg-slate-900/40 z-1" />
            <img src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&q=80&w=1200" className="absolute inset-0 w-full h-full object-cover" alt="Banner" />
            <div className="relative z-10 max-w-2xl px-4">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6 drop-shadow-lg leading-tight">Tu nuevo hogar en {config.name.replace('Inmobiliaria ', '')}</h2>
              <div className="bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 max-w-xl mx-auto">
                <input type="text" placeholder="¿Barrio o calle?" className="flex-1 px-4 py-3 bg-transparent outline-none border-none text-slate-800" />
                <button onClick={() => setPublicTab('alquileres')} className={`bg-${config.primaryColor} text-white px-8 py-3 rounded-xl font-bold`}>Buscar</button>
              </div>
            </div>
          </section>
          <main className="max-w-7xl mx-auto px-4 mt-20">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold text-slate-800">Unidades Destacadas</h3>
              <i className="fa-solid fa-star text-amber-400"></i>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProps.map(prop => <PropertyCard key={prop.id} property={prop} config={config} />)}
            </div>
          </main>
        </>
      )}

      {publicTab === 'alquileres' && (
        <main className="max-w-7xl mx-auto px-4 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
              <h2 className="text-4xl font-black text-slate-900 capitalize mb-2">Alquileres</h2>
              <p className="text-slate-500 font-medium">{filteredRentals.length} propiedades</p>
            </div>
            <div className="bg-white p-4 rounded-3xl shadow-sm border border-slate-200 flex flex-wrap items-center gap-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Dormitorios</label>
                <select value={filterBedrooms} onChange={e => setFilterBedrooms(e.target.value)} className="bg-transparent font-bold text-slate-700 outline-none">
                  <option value="all">Cualquiera</option>
                  <option value="1">1 Dormitorio</option>
                  <option value="2">2 Dormitorios</option>
                </select>
              </div>
              <div className="flex items-center gap-3 border-l border-slate-100 pl-6">
                <span className="text-xs font-bold text-slate-600">Solo disponibles</span>
                <button onClick={() => setFilterOnlyAvailable(!filterOnlyAvailable)} className={`w-12 h-6 rounded-full relative transition-colors ${filterOnlyAvailable ? `bg-${config.primaryColor}` : 'bg-slate-200'}`}>
                  <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${filterOnlyAvailable ? 'translate-x-7' : 'translate-x-1'}`}></div>
                </button>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRentals.map(prop => <PropertyCard key={prop.id} property={prop} config={config} />)}
          </div>
        </main>
      )}
    </div>
  );

  const AdminView = (
    <div className="min-h-screen bg-slate-50 md:pl-64">
      <AdminSidebar config={config} activeTab={adminTab} onTabChange={setAdminTab} />
      <main className="p-6 md:p-10 animate-in fade-in duration-500">
        <header className="mb-10">
          <h2 className="text-3xl font-black text-slate-800 capitalize">{adminTab}</h2>
          <p className="text-slate-500 font-medium">Panel de Gestión - Datos guardados localmente</p>
        </header>

        {adminTab === 'dashboard' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <StatCard label="Cobranza" value={stats.collectionRate} icon="fa-sack-dollar" color="emerald-600" />
              <StatCard label="Morosos" value={stats.delinquentCount.toString()} icon="fa-user-clock" color="rose-600" />
              <StatCard label="Ocupadas" value={properties.filter(p => p.status === 'alquilada').length.toString()} icon="fa-house-lock" color="blue-600" />
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100"><h4 className="text-lg font-bold">Alertas de Cobro</h4></div>
              <table className="w-full text-left">
                <tbody className="divide-y divide-slate-100">
                  {tenants.filter(t => t.debtAmount > 0).map(t => (
                    <tr key={t.id} className="hover:bg-rose-50/30">
                      <td className="px-6 py-4 font-bold">{t.name}</td>
                      <td className="px-6 py-4 text-rose-600 font-bold">${t.debtAmount.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button onClick={() => handleWhatsApp(t.phone, `Hola ${t.name}, recordamos deuda.`)} className="text-emerald-500"><i className="fa-brands fa-whatsapp text-2xl"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {adminTab === 'propiedades' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-xl">Gestión de Inmuebles</h3>
              <button onClick={() => setShowAddProperty(true)} className={`bg-${config.primaryColor} text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-all`}>
                <i className="fa-solid fa-plus"></i> Nueva Propiedad
              </button>
            </div>

            {showAddProperty && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-2xl w-full">
                  <h3 className="text-2xl font-black mb-6">Nueva Propiedad</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Título</label>
                      <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newProp.title || ''} onChange={e => setNewProp({...newProp, title: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Precio ($)</label>
                      <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newProp.price || ''} onChange={e => setNewProp({...newProp, price: Number(e.target.value)})} />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase text-slate-400 mb-1 block">Dormitorios</label>
                      <input type="number" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={newProp.bedrooms || 1} onChange={e => setNewProp({...newProp, bedrooms: Number(e.target.value)})} />
                    </div>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={addProperty} className={`flex-1 bg-${config.primaryColor} text-white py-4 rounded-2xl font-bold`}>Guardar</button>
                    <button onClick={() => setShowAddProperty(false)} className="px-8 bg-slate-100 py-4 rounded-2xl font-bold">Cerrar</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black">
                  <tr><th className="px-6 py-4">Status</th><th className="px-6 py-4">Inmueble</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${p.status === 'disponible' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>{p.status}</span>
                      </td>
                      <td className="px-6 py-4 font-bold">{p.title}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => setEditingProperty(p)} className="p-2 text-slate-400 hover:text-slate-800"><i className="fa-solid fa-gear"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'inquilinos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <h3 className="font-bold text-xl">Directorio de Inquilinos</h3>
              <button onClick={() => setShowAddTenant(true)} className={`bg-${config.primaryColor} text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg`}>
                <i className="fa-solid fa-user-plus"></i> Nuevo Inquilino
              </button>
            </div>

            {showAddTenant && (
              <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-md w-full">
                  <h3 className="text-2xl font-black mb-6">Datos de Inquilino</h3>
                  <div className="space-y-4">
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Nombre completo" value={newTenant.name || ''} onChange={e => setNewTenant({...newTenant, name: e.target.value})} />
                    <input type="text" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none" placeholder="Teléfono 549..." value={newTenant.phone || ''} onChange={e => setNewTenant({...newTenant, phone: e.target.value})} />
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button onClick={addTenant} className={`flex-1 bg-${config.primaryColor} text-white py-4 rounded-2xl font-bold`}>Registrar</button>
                    <button onClick={() => setShowAddTenant(false)} className="px-8 bg-slate-100 py-4 rounded-2xl font-bold">Cancelar</button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-black tracking-widest">
                  <tr><th className="px-6 py-4">Nombre</th><th className="px-6 py-4">Teléfono</th><th className="px-6 py-4 text-right">Acciones</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenants.map(t => (
                    <tr key={t.id}>
                      <td className="px-6 py-4 font-bold">{t.name}</td>
                      <td className="px-6 py-4 text-slate-500">{t.phone}</td>
                      <td className="px-6 py-4 text-right">
                         <button onClick={() => handleWhatsApp(t.phone, "Hola!")} className="bg-emerald-500 text-white w-8 h-8 rounded-lg shadow-md"><i className="fa-brands fa-whatsapp"></i></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === 'configuracion' && (
          <div className="max-w-xl bg-white p-8 rounded-3xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-bold mb-6">Ajustes White Label</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">NOMBRE COMERCIAL</label>
                <input type="text" value={config.name} onChange={e => setConfig({...config, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 mb-1 block">COLOR PRINCIPAL</label>
                <select value={config.primaryColor} onChange={e => setConfig({...config, primaryColor: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none">
                  <option value="blue-600">Azul Ocean</option>
                  <option value="emerald-600">Verde Nature</option>
                  <option value="indigo-600">Indigo Modern</option>
                </select>
              </div>
              <div className="pt-8 border-t">
                <button onClick={resetData} className="w-full bg-rose-50 text-rose-600 font-bold py-4 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-colors">Limpiar Base de Datos</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );

  const TenantView = (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-2xl font-black tracking-tight">
             <span className={`text-${config.primaryColor}`}>{config.logoText}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-bold text-slate-500 hidden sm:block">Hola, {currentTenant?.name}</span>
            <button onClick={() => setView('public')} className="text-slate-400 hover:text-rose-600 transition-colors font-bold text-sm">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-10">
          <h2 className="text-3xl font-black text-slate-900 mb-2">Mi Portal de Inquilino</h2>
          <p className="text-slate-500 font-medium">Gestiona tus pagos y revisa tu contrato activo.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Columna Izquierda: Contrato e Inmueble */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-slate-800">Detalles del Contrato</h3>
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase px-2 py-1 rounded-lg">Vigente</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${config.primaryColor}/10 flex items-center justify-center text-${config.primaryColor}`}>
                    <i className="fa-solid fa-house-user text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Propiedad</p>
                    <p className="font-bold text-slate-800">{currentTenantProperty?.title || 'No asignada'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${config.primaryColor}/10 flex items-center justify-center text-${config.primaryColor}`}>
                    <i className="fa-solid fa-calendar-check text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Próximo Vencimiento</p>
                    <p className="font-bold text-slate-800">10 de {new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date())}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${config.primaryColor}/10 flex items-center justify-center text-${config.primaryColor}`}>
                    <i className="fa-solid fa-money-bill-wave text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Alquiler Mensual</p>
                    <p className="font-bold text-slate-800">${currentTenantContract?.monthlyAmount.toLocaleString() || '0'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl bg-${config.primaryColor}/10 flex items-center justify-center text-${config.primaryColor}`}>
                    <i className="fa-solid fa-file-contract text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase text-slate-400">Fecha de Inicio</p>
                    <p className="font-bold text-slate-800">{currentTenantContract?.startDate || '—'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Subir Comprobante */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Subir Comprobante de Pago</h3>
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-10 flex flex-col items-center justify-center text-center group hover:border-blue-400 hover:bg-blue-50/30 transition-all cursor-pointer">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                  <i className="fa-solid fa-cloud-arrow-up text-2xl text-slate-400"></i>
                </div>
                <p className="font-bold text-slate-700 mb-1">Haz clic para subir o arrastra aquí</p>
                <p className="text-sm text-slate-400">Formatos permitidos: JPG, PNG, PDF (Máx. 5MB)</p>
                <input type="file" className="hidden" />
              </div>
              <button className={`w-full mt-6 bg-${config.primaryColor} text-white font-bold py-4 rounded-2xl shadow-xl hover:brightness-110 transition-all`}>
                Informar Pago
              </button>
            </div>
          </div>

          {/* Columna Derecha: Estado de Cuenta y Datos Pago */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative">
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${config.primaryColor}/5 -mr-16 -mt-16 rounded-full`}></div>
              <h3 className="text-xl font-bold text-slate-800 mb-6">Estado de Cuenta</h3>
              <div className="mb-4">
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1">Tu Saldo Actual</p>
                <p className={`text-4xl font-black ${currentTenant?.debtAmount > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  ${currentTenant?.debtAmount.toLocaleString() || '0'}
                </p>
              </div>
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${currentTenant?.debtAmount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                <i className={`fa-solid ${currentTenant?.debtAmount > 0 ? 'fa-circle-exclamation' : 'fa-circle-check'}`}></i>
                {currentTenant?.debtAmount > 0 ? 'Pago Pendiente' : 'Al día'}
              </div>
            </div>

            <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-4 right-4 text-white/10 text-6xl opacity-20">
                <i className="fa-solid fa-landmark"></i>
              </div>
              <h3 className="text-xl font-bold mb-6">Datos para Transferir</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Alias CBU</p>
                  <p className="font-mono text-lg font-bold">INMO.LIBERTADOR.UAP</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Banco</p>
                  <p className="font-bold">Banco Macro</p>
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500">Titular</p>
                  <p className="font-bold">{config.name}</p>
                </div>
              </div>
              <button className="w-full mt-8 bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl border border-white/20 transition-all text-sm">
                Copiar Alias
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <>
      {view === 'public' && PublicView}
      {view === 'admin' && AdminView}
      {view === 'tenant' && TenantView}

      {/* Menú de Cambio de Vista Flotante */}
      <div className="fixed bottom-8 right-8 z-[100] group">
        {/* Opciones del Menú (Aparecen al hacer hover sobre el botón principal) */}
        <div className="absolute bottom-full right-0 mb-4 flex flex-col items-end gap-3 pointer-events-none group-hover:pointer-events-auto">
          {view !== 'admin' && (
            <button 
              onClick={() => setView('admin')}
              className="bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 font-bold text-xs flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-75 hover:bg-slate-50 whitespace-nowrap"
            >
              <i className="fa-solid fa-user-tie text-blue-600"></i> Panel de Agente
            </button>
          )}
          {view !== 'tenant' && (
            <button 
              onClick={() => setView('tenant')}
              className="bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 font-bold text-xs flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-150 hover:bg-slate-50 whitespace-nowrap"
            >
              <i className="fa-solid fa-user-graduate text-emerald-600"></i> Panel de Inquilino
            </button>
          )}
          {view !== 'public' && (
            <button 
              onClick={() => setView('public')}
              className="bg-white text-slate-800 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 font-bold text-xs flex items-center gap-3 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 delay-225 hover:bg-slate-50 whitespace-nowrap"
            >
              <i className="fa-solid fa-globe text-indigo-600"></i> Sitio Público
            </button>
          )}
        </div>

        {/* Botón Principal (El "Ojo") */}
        <button 
          className="bg-slate-900 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95"
        >
          <i className="fa-solid fa-eye text-xl"></i>
          {/* Badge de vista actual */}
          <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase">Demo</span>
        </button>
      </div>
    </>
  );
};

export default App;
