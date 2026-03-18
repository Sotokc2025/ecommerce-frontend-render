
// Claves utilizadas para guardar datos en localStorage
export const STORAGE_KEYS = {
  addresses: "shippingAddresses", // Direcciones de envío
  payments: "paymentMethods",    // Métodos de pago
  orders: "orders",              // Órdenes
};

// Función auxiliar para normalizar banderas booleanas
const parseBooleanFlag = (primary, secondary) => {
  if (typeof primary === "boolean") return primary;
  if (typeof secondary === "boolean") return secondary;
  return false;
};

// Lee y parsea un objeto JSON desde localStorage
export const readLocalJSON = (key) => {
  const rawValue = localStorage.getItem(key); // Obtiene el valor crudo
  if (!rawValue) {
    return null; // Si no existe, retorna null
  }
  try {
    return JSON.parse(rawValue); // Intenta parsear el JSON
  } catch (error) {
    console.warn(`No se pudo parsear ${key} desde localStorage`, error);
    return null; // Si falla el parseo, retorna null
  }
};

// Escribe un objeto JSON en localStorage
export const writeLocalJSON = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value)); // Guarda el valor como string
};

// Normaliza una dirección para asegurar estructura consistente
export const normalizeAddress = (addr, idx = 0) => {
  if (!addr) {
    return null; // Si no hay dirección, retorna null
  }
  const generatedId = `addr-${Date.now()}-${idx}`; // Genera un ID único
  const id = addr.id || addr._id || generatedId; // Usa el ID existente o genera uno
  const isDefault = parseBooleanFlag(addr.default, addr.isDefault); // Normaliza bandera default

  return {
    name: addr.name || "", // Nombre
    address1: addr.address1 || "", // Calle principal
    address2: addr.address2 || "", // Calle secundaria
    postalCode: addr.postalCode || "", // Código postal
    city: addr.city || "", // Ciudad
    country: addr.country || "", // País
    reference: addr.reference || "", // Referencia
    ...addr, // Resto de propiedades originales
    id, // ID normalizado
    default: isDefault, // Bandera default
    isDefault, // Bandera default duplicada para compatibilidad
  };
};

// Normaliza un método de pago para asegurar estructura consistente
export const normalizePayment = (pay, idx = 0) => {
  if (!pay) {
    return null; // Si no hay método, retorna null
  }
  const generatedId = `pay-${Date.now()}-${idx}`; // Genera un ID único
  const id = pay.id || pay._id || generatedId; // Usa el ID existente o genera uno
  const cardNumber = pay.cardNumber || ""; // Número de tarjeta
  const alias = pay.alias || `Tarjeta ****${cardNumber.slice(-4)}`; // Alias
  const cardHolderName =
    pay.cardHolderName || pay.placeHolder || pay.cardHolder || ""; // Titular
  const expireDate = pay.expireDate || pay.expiryDate || ""; // Fecha de expiración
  const isDefault = parseBooleanFlag(pay.isDefault, pay.default); // Normaliza bandera default

  return {
    ...pay, // Resto de propiedades originales
    id, // ID normalizado
    alias, // Alias
    cardNumber, // Número de tarjeta
    cardHolderName, // Titular
    expireDate, // Fecha de expiración
    isDefault, // Bandera default
    default: isDefault, // Bandera default duplicada para compatibilidad
  };
};

// Exporta las claves de almacenamiento para uso global
export const STORAGE = STORAGE_KEYS;
