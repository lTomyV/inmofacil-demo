/**
 * Initial Data for Development
 * Mock data for tenants, properties, contracts, and configuration
 */

import { Tenant, Property, TenantConfig, Contract } from '../types';

export const INITIAL_TENANT_CONFIG: TenantConfig = {
  name: "Inmobiliaria Libertador",
  themeId: "ocean",
  logoText: "🏠 InmoLibertador",
  whatsappNumber: "5493434123456",
  appearance: "system"
};

export const INITIAL_TENANTS: Tenant[] = [
  { 
    id: "t1", 
    name: "Mateo Gomez", 
    phone: "5493434111222", 
    status: "Al día", 
    debtAmount: 0, 
    daysLate: 0 
  },
  { 
    id: "t2", 
    name: "Lucia Fernandez", 
    phone: "5493434333444", 
    status: "Atrasado", 
    debtAmount: 45000, 
    daysLate: 5,
    avatar: "LF"
  },
  { 
    id: "t3", 
    name: "Carlos Rodriguez", 
    phone: "5493434555666", 
    status: "En Mora", 
    debtAmount: 125000, 
    daysLate: 15,
    avatar: "CR",
    guarantor: {
      name: "Roberto Rodriguez",
      phone: "5493434777888"
    }
  },
  { 
    id: "t4", 
    name: "Sofia Martinez", 
    phone: "5493434999000", 
    status: "Al día", 
    debtAmount: 0, 
    daysLate: 0 
  },
  { 
    id: "t5", 
    name: "Elena Paz", 
    phone: "5493434222333", 
    status: "En Mora", 
    debtAmount: 98000, 
    daysLate: 12,
    avatar: "EP",
    guarantor: {
      name: "Miguel Paz",
      phone: "5493434444555"
    }
  }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Monoambiente Estudiantil",
    price: 185000,
    address: "Calle Los Robles 450, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    description: "Ideal para estudiantes que buscan cercanía a la universidad. Muy luminoso, con cocina integrada y baño completo.",
    type: "alquiler",
    status: "alquilada",
    featured: true,
    tenantId: "t1",
    contractId: "c1"
  },
  {
    id: "p2",
    title: "Depto 2 Dormitorios Premium",
    price: 320000,
    address: "Av. San Martín 1200, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=800",
    description: "Luminoso con balcón terraza y vista abierta. Edificio con seguridad y SUM.",
    type: "alquiler",
    status: "disponible",
    featured: true
  },
  {
    id: "p3",
    title: "Casa Familiar Centro",
    price: 45000000,
    address: "25 de Mayo 88, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=800",
    description: "Casa amplia con patio, parrilla y cochera para dos autos.",
    type: "venta",
    status: "disponible",
    featured: false
  },
  {
    id: "p4",
    title: "Loft Moderno UAP",
    price: 210000,
    address: "Belgrano 120, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=800",
    description: "Perfecto para recién graduados. Diseño industrial con techos altos.",
    type: "alquiler",
    status: "disponible",
    featured: true
  },
  {
    id: "p5",
    title: "Residencia Universitaria",
    price: 150000,
    address: "Pueyrredón 34, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=800",
    description: "Ambiente tranquilo y seguro. Ideal para concentrarse en el estudio.",
    type: "alquiler",
    status: "alquilada",
    featured: false,
    tenantId: "t2",
    contractId: "c2"
  },
  {
    id: "p6",
    title: "Casa Quinta con Piscina",
    price: 85000000,
    address: "Ruta 11 Km 5, Libertador",
    bedrooms: 4,
    imageUrl: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800",
    description: "Increíble propiedad de descanso. Parque arbolado de 2000m2 y piscina.",
    type: "venta",
    status: "disponible",
    featured: true
  },
  {
    id: "p7",
    title: "Duplex Moderno Jardín",
    price: 280000,
    address: "Mitre 780, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    description: "Vivienda joven con patio propio. Planta alta con dormitorios amplios.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p8",
    title: "Penthouse Vista Rio",
    price: 550000,
    address: "Costanera 10, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    description: "La mejor vista de la ciudad. Piso exclusivo con terraza propia.",
    type: "alquiler",
    status: "disponible",
    featured: true
  },
  {
    id: "p9",
    title: "Depto Luminoso Av. Colón",
    price: 245000,
    address: "Av. Colón 450, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1499916156191-151247eceee3?auto=format&fit=crop&q=80&w=800",
    description: "Departamento moderno en el corazón comercial.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p10",
    title: "Cabaña de Madera",
    price: 35000000,
    address: "Barrio El Ombú, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1449156001935-d28bc3502f75?auto=format&fit=crop&q=80&w=800",
    description: "Cabaña acogedora ideal para inversión turística.",
    type: "venta",
    status: "disponible",
    featured: false
  },
  {
    id: "p11",
    title: "Oficina Corporativa",
    price: 120000,
    address: "Torre Central Piso 4, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    description: "Espacio profesional equipado con aire central.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p12",
    title: "Chalet Clasico",
    price: 52000000,
    address: "Sarmiento 12, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1472224371017-08207f84aaae?auto=format&fit=crop&q=80&w=800",
    description: "Propiedad sólida con jardín delantero y garage.",
    type: "venta",
    status: "disponible",
    featured: false
  },
  {
    id: "p13",
    title: "Monoambiente Paseo del Parque",
    price: 195000,
    address: "Moreno 1022, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    description: "Cerca de espacios verdes, ideal para deportistas.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p14",
    title: "Piso de Lujo Plaza Mayo",
    price: 650000,
    address: "Bolivar 2, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800",
    description: "Acabados en mármol y suite con vestidor.",
    type: "alquiler",
    status: "disponible",
    featured: true
  },
  {
    id: "p15",
    title: "Casa Minimalista",
    price: 78000000,
    address: "Barrio Cerrado Las Lilas, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    description: "Arquitectura moderna y espacios integrados.",
    type: "venta",
    status: "disponible",
    featured: true
  },
  {
    id: "p16",
    title: "Estudio Prof. Balcón",
    price: 230000,
    address: "Junín 45, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1536376074432-8f642462a630?auto=format&fit=crop&q=80&w=800",
    description: "Apto profesional, excelente iluminación natural.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p17",
    title: "Departamento Familiar",
    price: 380000,
    address: "Av. Alberdi 200, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=800",
    description: "Excelente estado, cerca de centros comerciales y transporte.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p18",
    title: "Casa de Campo",
    price: 95000000,
    address: "Afueras de Libertador",
    bedrooms: 4,
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800",
    description: "Paz y naturaleza a solo 15 minutos de la ciudad.",
    type: "venta",
    status: "disponible",
    featured: false
  },
  {
    id: "p19",
    title: "Duplex con Terraza",
    price: 290000,
    address: "Alvear 500, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&q=80&w=800",
    description: "Terraza amplia con deck y vista a la ciudad.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p20",
    title: "Monoambiente Vista Rio",
    price: 220000,
    address: "Costanera Sur, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=800",
    description: "Ubicación inmejorable, ideal inversión.",
    type: "alquiler",
    status: "disponible",
    featured: false
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  { 
    id: 'c1', 
    tenantId: 't1', 
    propertyId: 'p1', 
    startDate: '2024-01-01', 
    endDate: '2025-01-01', 
    monthlyAmount: 185000, 
    status: 'vigente',
    folioNumber: 'A30',
    guarantor: {
      name: 'Ricardo Gomez',
      phone: '5493434123456',
      dni: '20.123.456'
    },
    increases: 'Aumento semestral según ICL (Indice de Contratos de Locación)'
  },
  { 
    id: 'c2', 
    tenantId: 't2', 
    propertyId: 'p5', 
    startDate: '2023-06-01', 
    endDate: '2024-06-01', 
    monthlyAmount: 150000, 
    status: 'vigente',
    folioNumber: 'C48',
    guarantor: {
      name: 'Marta Fernandez',
      phone: '5493434654321',
      dni: '18.654.321'
    },
    increases: 'Aumento cuatrimestral del 25% fijo'
  },
];
