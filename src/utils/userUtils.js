// @ts-check
/**
 * @typedef {Object} UserData
 * @property {string} [displayName]
 * @property {string} [name]
 * @property {string} [email]
*/
/**
 * Genera las iniciales del usuario para el avatar.
 * @param {UserData | null} userData
 * @returns {string}
*/
export const getUserInitials = (userData) => {
  if (!userData) return "U";
  const name = userData.displayName || userData.name || userData.email || "Usuario";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};
/**
 * Obtiene el nombre a mostrar del usuario.
 * @param {UserData | null} userData
 * @returns {string}
*/
export const getDisplayName = (userData) => {
  if (!userData) return "Usuario";
  return userData.displayName || userData.name || userData.email || "Usuario";
};