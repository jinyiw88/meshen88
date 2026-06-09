/**
 * 密钥存储服务
 * 使用 expo-secure-store 安全存储敏感数据
 */

import * as SecureStore from 'expo-secure-store';

const PREFIX = 'ks_';

export const KeyStore = {
  /** 存储密钥 */
  async set(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(`${PREFIX}${key}`, value);
  },

  /** 读取密钥 */
  async get(key: string): Promise<string | null> {
    return SecureStore.getItemAsync(`${PREFIX}${key}`);
  },

  /** 删除密钥 */
  async delete(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(`${PREFIX}${key}`);
  },

  /** 检查密钥是否存在 */
  async has(key: string): Promise<boolean> {
    const value = await SecureStore.getItemAsync(`${PREFIX}${key}`);
    return value !== null;
  },
};
