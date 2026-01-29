
export type PaymentStatus = "Al día" | "Atrasado" | "En Mora";
export type PropertyType = "alquiler" | "venta";
export type PropertyStatus = "disponible" | "alquilada";
export type AppearanceMode = "light" | "dark" | "system";

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  status: PaymentStatus;
  debtAmount: number;
  daysLate: number;
  avatar?: string;
  guarantor?: {
    name: string;
    phone: string;
  };
}

export interface Property {
  id: string;
  title: string;
  price: number;
  address: string;
  bedrooms: number;
  imageUrl: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  featured: boolean;
  tenantId?: string;
  contractId?: string;
}

export interface Contract {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  status: "vigente" | "finalizado";
  folioNumber: string;
  guarantor: {
    name: string;
    phone: string;
    dni: string;
  };
  increases: string; // Descripción de los aumentos estipulados
}

export interface Ticket {
  id: string;
  title: string;
  priority: "alta" | "media" | "baja";
  status: "pendiente" | "en proceso" | "esperando presupuesto";
  origin: "bot" | "manual";
  date: string;
}

export interface Theme {
  id: string;
  name: string;
  primaryClass: string; 
  bgClass: string;      
  textClass: string;    
  shadowClass: string;  
  accentClass: string;  
}

export interface TenantConfig {
  name: string;
  themeId: string;
  logoText: string;
  whatsappNumber: string;
  appearance: AppearanceMode;
}
