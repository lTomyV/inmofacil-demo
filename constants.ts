
import { Tenant, Property, TenantConfig, Contract } from './types';

export const INITIAL_TENANT_CONFIG: TenantConfig = {
  name: "Inmobiliaria Libertador",
  primaryColor: "blue-600",
  logoText: "🏠 InmoLibertador",
  whatsappNumber: "5493434123456"
};

export const INITIAL_TENANTS: Tenant[] = [
  { id: "t1", name: "Mateo Gomez", phone: "5493434111222", status: "Al día", debtAmount: 0, daysLate: 0 },
  { id: "t2", name: "Lucia Fernandez", phone: "5493434333444", status: "Atrasado", debtAmount: 45000, daysLate: 5 },
  { id: "t3", name: "Carlos Rodriguez", phone: "5493434555666", status: "En Mora", debtAmount: 125000, daysLate: 15, guarantor: { name: "Juan Rodriguez", phone: "5493434777888" } },
  { id: "t4", name: "Sofia Martinez", phone: "5493434999000", status: "Al día", debtAmount: 0, daysLate: 0 },
  { id: "t5", name: "Elena Paz", phone: "5493434222333", status: "En Mora", debtAmount: 98000, daysLate: 12, guarantor: { name: "Ricardo Paz", phone: "5493434444555" } }
];

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p1",
    title: "Monoambiente Estudiantil",
    price: 185000,
    address: "Calle Los Robles 450, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
    description: "Ideal para estudiantes.",
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
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=400",
    description: "Luminoso con balcón.",
    type: "alquiler",
    status: "disponible",
    featured: true
  },
  {
    id: "p3",
    title: "Casa Familiar Centro",
    price: 450000,
    address: "25 de Mayo 88, Libertador",
    bedrooms: 3,
    imageUrl: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09?auto=format&fit=crop&q=80&w=400",
    description: "Casa amplia con patio.",
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
    imageUrl: "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&q=80&w=400",
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
    imageUrl: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=400",
    description: "Ambiente tranquilo.",
    type: "alquiler",
    status: "alquilada",
    featured: false,
    tenantId: "t2",
    contractId: "c2"
  },
  {
    id: "p6",
    title: "Estudio Minimalista San Martín",
    price: 195000,
    address: "Av. San Martín 850, Libertador",
    bedrooms: 1,
    imageUrl: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=400",
    description: "Excelente ubicación céntrica, ideal para una persona.",
    type: "alquiler",
    status: "disponible",
    featured: false
  },
  {
    id: "p7",
    title: "Chalet Las Acacias",
    price: 850000,
    address: "Ruta 131 Km 32, Libertador",
    bedrooms: 4,
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=400",
    description: "Gran propiedad con piscina y jardín parquizado.",
    type: "venta",
    status: "disponible",
    featured: true
  },
  {
    id: "p8",
    title: "Duplex Los Sauces",
    price: 280000,
    address: "Los Sauces 12, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&q=80&w=400",
    description: "Cómodo duplex con entrada de auto.",
    type: "alquiler",
    status: "alquilada",
    featured: false,
    tenantId: "t4",
    contractId: "c3"
  },
  {
    id: "p9",
    title: "Apartamento Vista Panorámica",
    price: 380000,
    address: "Torre Alvear 9B, Libertador",
    bedrooms: 2,
    imageUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&q=80&w=400",
    description: "Piso alto con vistas increíbles a la ciudad.",
    type: "alquiler",
    status: "disponible",
    featured: true
  }
];

export const INITIAL_CONTRACTS: Contract[] = [
  { id: 'c1', tenantId: 't1', propertyId: 'p1', startDate: '2024-01-01', endDate: '2025-01-01', monthlyAmount: 185000, status: 'vigente' },
  { id: 'c2', tenantId: 't2', propertyId: 'p5', startDate: '2023-06-01', endDate: '2024-06-01', monthlyAmount: 150000, status: 'vigente' },
  { id: 'c3', tenantId: 't4', propertyId: 'p8', startDate: '2024-02-01', endDate: '2025-02-01', monthlyAmount: 280000, status: 'vigente' },
];
