// @ts-check
import { http } from '../services/http';

/**
 * Simple in-memory cache for API requests.
 */
const cache = new Map();

/**
 * Fetches data with a simple TTL-based cache.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options (axios config now).
 * @param {number} ttl - Time To Live in milliseconds (default: 5 minutes).
 */
export const fetchWithCache = async (url, options = {}, ttl = 300000) => {
  const key = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`[Cache Hit] ${url}`);
    return cached.data;
  }

  // Use http.get since fetchWithCache is only used for GET requests
  const response = await http.get(url, options);

  const data = response.data;
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const clearCache = () => cache.clear();
