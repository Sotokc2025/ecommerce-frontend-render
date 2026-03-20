/**
 * Simple in-memory cache for API requests.
 */
const cache = new Map();

/**
 * Fetches data with a simple TTL-based cache.
 * @param {string} url - The URL to fetch.
 * @param {object} options - Fetch options.
 * @param {number} ttl - Time To Live in milliseconds (default: 5 minutes).
 */
export const fetchWithCache = async (url, options = {}, ttl = 300000) => {
  const key = `${url}-${JSON.stringify(options)}`;
  const cached = cache.get(key);

  if (cached && Date.now() - cached.timestamp < ttl) {
    console.log(`[Cache Hit] ${url}`);
    return cached.data;
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.status}`);
  }

  const data = await response.json();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
};

export const clearCache = () => cache.clear();
