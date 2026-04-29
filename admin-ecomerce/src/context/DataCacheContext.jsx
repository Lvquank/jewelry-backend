import { createContext, useContext, useRef, useCallback } from 'react';

/**
 * DataCacheContext — lưu dữ liệu fetch trong bộ nhớ React
 * Khi component unmount (chuyển trang), dữ liệu vẫn được giữ trong context.
 * Khi quay lại trang đó, dữ liệu được lấy ngay từ cache.
 * STALE_TIME: 5 phút — sau đó sẽ tự fetch lại (silent refresh).
 */

const STALE_TIME = 5 * 60 * 1000; // 5 phút

const DataCacheContext = createContext(null);

export function DataCacheProvider({ children }) {
  // cache = { [key]: { data, timestamp } }
  const cache = useRef({});

  /** Lấy dữ liệu từ cache. Trả về null nếu không có hoặc đã quá STALE_TIME */
  const getCache = useCallback((key) => {
    const entry = cache.current[key];
    if (!entry) return null;
    const isStale = Date.now() - entry.timestamp > STALE_TIME;
    return isStale ? null : entry.data;
  }, []);

  /** Kiểm tra có dữ liệu trong cache không (kể cả đã stale) — dùng để hiện data cũ khi đang refetch */
  const getCacheStale = useCallback((key) => {
    return cache.current[key]?.data ?? null;
  }, []);

  /** Ghi dữ liệu vào cache */
  const setCache = useCallback((key, data) => {
    cache.current[key] = { data, timestamp: Date.now() };
  }, []);

  /** Xóa một cache key (dùng sau khi mutate để force refetch) */
  const invalidate = useCallback((key) => {
    delete cache.current[key];
  }, []);

  /** Xóa nhiều cache keys */
  const invalidateAll = useCallback((...keys) => {
    keys.forEach(k => delete cache.current[k]);
  }, []);

  return (
    <DataCacheContext.Provider value={{ getCache, getCacheStale, setCache, invalidate, invalidateAll }}>
      {children}
    </DataCacheContext.Provider>
  );
}

export function useDataCache() {
  const ctx = useContext(DataCacheContext);
  if (!ctx) throw new Error('useDataCache must be used within DataCacheProvider');
  return ctx;
}

/**
 * Hook tiện lợi để fetch + cache dữ liệu
 * @param {string} key       - cache key duy nhất
 * @param {Function} fetcher - hàm async trả về data
 * @param {object} options   - { setData, setLoading, onError }
 *
 * Trả về: { fetchWithCache }
 * Gọi fetchWithCache() để load dữ liệu (dùng cache nếu còn fresh)
 */
export function useCachedFetch(key, fetcher, { setData, setLoading, onError } = {}) {
  const { getCache, getCacheStale, setCache } = useDataCache();

  const fetchWithCache = useCallback(async ({ force = false } = {}) => {
    // 1. Nếu không force và cache còn fresh → dùng cache ngay
    if (!force) {
      const cached = getCache(key);
      if (cached !== null) {
        setData?.(cached);
        setLoading?.(false);
        return cached;
      }
    }

    // 2. Có cache cũ (stale) → hiện data cũ trước, fetch ngầm
    const stale = getCacheStale(key);
    if (stale !== null && !force) {
      setData?.(stale);
      setLoading?.(false);
    } else {
      setLoading?.(true);
    }

    // 3. Fetch mới
    try {
      const data = await fetcher();
      setCache(key, data);
      setData?.(data);
      return data;
    } catch (err) {
      onError?.(err);
      return null;
    } finally {
      setLoading?.(false);
    }
  }, [key, fetcher, getCache, getCacheStale, setCache, setData, setLoading, onError]);

  return { fetchWithCache };
}
