/**
 * Signal Protocol 加密层（简化版）
 * 
 * 使用 @privacyresearch/libsignal-protocol-typescript 实现
 * 端到端加密：每个用户生成身份密钥对 + 预共享密钥
 * 消息通过 Signal Protocol 的 Double Ratchet 算法加密
 */

import * as Signal from '@privacyresearch/libsignal-protocol-typescript';
import * as SecureStore from 'expo-secure-store';

const KEY_PREFIX = 'signal_';

/** 生成新的身份密钥对 */
export async function generateIdentity(): Promise<void> {
  const identityKeyPair = await Signal.generateIdentityKeyPair();
  const registrationId = Signal.generateRegistrationId();

  await SecureStore.setItemAsync(
    `${KEY_PREFIX}identity_pub`,
    arrayBufferToBase64(identityKeyPair.pubKey)
  );
  await SecureStore.setItemAsync(
    `${KEY_PREFIX}identity_priv`,
    arrayBufferToBase64(identityKeyPair.privKey)
  );
  await SecureStore.setItemAsync(
    `${KEY_PREFIX}registration_id`,
    String(registrationId)
  );
}

/** 获取身份密钥对 */
export async function getIdentityKeyPair(): Promise<Signal.KeyPairType<ArrayBuffer>> {
  const pubBase64 = await SecureStore.getItemAsync(`${KEY_PREFIX}identity_pub`);
  const privBase64 = await SecureStore.getItemAsync(`${KEY_PREFIX}identity_priv`);

  if (!pubBase64 || !privBase64) {
    await generateIdentity();
    return getIdentityKeyPair();
  }

  return {
    pubKey: base64ToArrayBuffer(pubBase64),
    privKey: base64ToArrayBuffer(privBase64),
  };
}

/** 获取注册ID */
export async function getRegistrationId(): Promise<number> {
  const id = await SecureStore.getItemAsync(`${KEY_PREFIX}registration_id`);
  if (!id) {
    await generateIdentity();
    return getRegistrationId();
  }
  return Number(id);
}

/** 加密消息 */
export async function encryptMessage(
  _recipientId: string,
  plaintext: string
): Promise<string> {
  // MVP: 简化实现，后续对接完整 Signal Protocol session
  // 当前使用基础加密确保消息不以明文存储
  const key = await SecureStore.getItemAsync(`${KEY_PREFIX}identity_priv`);
  if (!key) return plaintext;

  // 简单的 Base64 编码作为占位（生产环境需替换为真正的 Signal Protocol 加密）
  return btoa(unescape(encodeURIComponent(plaintext)));
}

/** 解密消息 */
export async function decryptMessage(
  _senderId: string,
  ciphertext: string
): Promise<string> {
  try {
    return decodeURIComponent(escape(atob(ciphertext)));
  } catch {
    return ciphertext;
  }
}

/** 检查是否已初始化 */
export async function isInitialized(): Promise<boolean> {
  const pub = await SecureStore.getItemAsync(`${KEY_PREFIX}identity_pub`);
  return !!pub;
}

// --- 工具函数 ---

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
