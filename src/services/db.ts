/**
 * 数据库服务
 * 使用 @react-native-async-storage/async-storage + 内存缓存
 * 所有数据持久化到设备本地
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryCache = new Map<string, string>();

export const DB = {
  /** 读取数据 */
  async get<T>(key: string): Promise<T | null> {
    // 先查内存缓存
    const cached = memoryCache.get(key);
    if (cached) {
      try { return JSON.parse(cached); } catch { return cached as unknown as T; }
    }

    // 再查 AsyncStorage
    const raw = await AsyncStorage.getItem(key);
    if (!raw) return null;

    memoryCache.set(key, raw);
    try { return JSON.parse(raw); } catch { return raw as unknown as T; }
  },

  /** 写入数据 */
  async set<T>(key: string, value: T): Promise<void> {
    const raw = typeof value === 'string' ? value : JSON.stringify(value);
    memoryCache.set(key, raw);
    await AsyncStorage.setItem(key, raw);
  },

  /** 删除数据 */
  async delete(key: string): Promise<void> {
    memoryCache.delete(key);
    await AsyncStorage.removeItem(key);
  },

  /** 获取所有键 */
  async getAllKeys(): Promise<string[]> {
    return AsyncStorage.getAllKeys();
  },

  /** 批量写入 */
  async multiSet(pairs: [string, unknown][]): Promise<void> {
    const entries = pairs.map(([k, v]) => {
      const raw = typeof v === 'string' ? v : JSON.stringify(v);
      memoryCache.set(k, raw);
      return [k, raw] as [string, string];
    });
    await AsyncStorage.multiSet(entries);
  },
};
