
export type PaymentStatus = "Al día" | "Atrasado" | "En Mora";
export type PropertyType = "alquiler" | "venta";
export type PropertyStatus = "disponible" | "alquilada";

export interface Tenant {
  id: string;
  name: string;
  phone: string;
  status: PaymentStatus;
  debtAmount: number;
  daysLate: number;
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
  tenantId?: string; // Link to Tenant
  contractId?: string; // Link to Contract
}

export interface Contract {
  id: string;
  tenantId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyAmount: number;
  status: "vigente" | "finalizado";
}

export interface TenantConfig {
  name: string;
  primaryColor: string;
  logoText: string;
  whatsappNumber: string;
}
