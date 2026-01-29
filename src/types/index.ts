/**
 * Types and Interfaces for InmoSimple Demo
 * Centralized type definitions for the entire application
 */

// ==================== ENUMS ====================
export type PaymentStatus = "Al día" | "Atrasado" | "En Mora";
export type PropertyType = "alquiler" | "venta";
export type PropertyStatus = "disponible" | "alquilada";
export type AppearanceMode = "light" | "dark" | "system";
export type TicketPriority = "alta" | "media" | "baja";
export type TicketStatus = "pendiente" | "en proceso" | "esperando presupuesto" | "resuelto";
export type TicketOrigin = "bot" | "manual";
export type ViewType = "public" | "admin" | "tenant";
export type PublicTab = "inicio" | "alquileres" | "ventas" | "contacto";
export type PaymentReceiptStatus = "pendiente" | "aprobado" | "rechazado";
export type PaymentMethod = "transferencia" | "efectivo" | "cheque" | "tarjeta" | "mercadopago";

// ==================== ENTITIES ====================
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
  increases: string;
}

export interface Ticket {
  id: string;
  title: string;
  priority: TicketPriority;
  status: TicketStatus;
  origin: TicketOrigin;
  date: string;
  resolvedBy?: 'tenant' | 'agent';
  resolvedDate?: string;
}

export interface PaymentReceipt {
  id: string;
  tenantId: string;
  tenantName: string;
  propertyAddress: string;
  amount: number;
  period: string;
  uploadDate: string;
  paymentDate: string;
  method: PaymentMethod;
  status: PaymentReceiptStatus;
  receiptUrl?: string;
  comments?: string;
  reviewedBy?: string;
  reviewDate?: string;
}

export interface ManualPayment {
  id: string;
  tenantId: string;
  amount: number;
  period: string;
  paymentDate: string;
  method: PaymentMethod;
  comments: string;
  createdBy: string;
  createdAt: string;
}

// ==================== CONFIGURATION ====================
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

// ==================== UI STATE ====================
export interface CollectionPulseData {
  totalExpected: number;
  totalCollected: number;
  percentage: number;
}

export interface TimelineData {
  thisMonth: { count: number; properties: string[] };
  nextMonth: { count: number; properties: string[] };
  future: { count: number; properties: string[] };
}

export interface PaymentHistoryItem {
  id: string;
  period: string;
  amount: number;
  date: string;
  status: string;
}

// ==================== COMPONENT PROPS ====================
export interface FilterState {
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  onlyAvailable: boolean;
}

export interface SearchState {
  property: string;
  tenant: string;
  contract: string;
}
