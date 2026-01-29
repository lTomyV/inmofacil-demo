/**
 * WhatsApp Utilities
 * Functions for handling WhatsApp integrations
 */

/**
 * Opens WhatsApp with a pre-filled message
 * @param phoneNumber - Phone number in international format (e.g., 5493434123456)
 * @param message - Pre-filled message text
 */
export const openWhatsApp = (phoneNumber: string, message: string): void => {
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
};

/**
 * Generates a tenant reminder message
 */
export const getTenantReminderMessage = (name: string, debtAmount: number): string => {
  return `Hola ${name}, te recordamos que tenés un pago pendiente de $${debtAmount.toLocaleString('es-AR')}.`;
};

/**
 * Generates a guarantor alert message
 */
export const getGuarantorAlertMessage = (guarantorName: string, tenantName: string, daysLate: number): string => {
  return `Hola ${guarantorName}, te contactamos porque ${tenantName} tiene una mora de ${daysLate} días.`;
};

/**
 * Generates a property inquiry message
 */
export const getPropertyInquiryMessage = (propertyTitle: string): string => {
  return `Hola, estoy interesado en ${propertyTitle}`;
};
