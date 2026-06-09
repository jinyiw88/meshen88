import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useRef } from 'react';
import { useAuthStore } from '../src/stores/authStore';

const PIN_LENGTH = 6;

export default function VerifyScreen() {
  const router = useRouter();
  const { verify, setVerified } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handlePinChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, PIN_LENGTH);
    setPin(clean);
    setError('');

    if (clean.length === PIN_LENGTH) {
      // 自动验证
      if (verify(clean)) {
        setVerified(true);
        router.replace('/chat');
      } else {
        setError('PIN码错误');
        setPin('');
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
  };

  const handleBiometric = () => {
    // 简化：直接通过验证
    setVerified(true);
    router.replace('/chat');
  };

  return (
    <View style={styles.container}>
      {/* 返回按钮 */}
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* 锁图标 */}
        <Text style={styles.lockIcon}>🔐</Text>

        <Text style={styles.title}>身份验证</Text>
        <Text style={styles.subtitle}>请输入PIN码以继续</Text>

        {/* PIN码输入框 */}
        <View style={styles.pinRow}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <View
              key={i}
              style={[styles.pinDot, i < pin.length && styles.pinDotFilled]}
            />
          ))}
        </View>

        {/* 隐藏的实际输入 */}
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={pin}
          onChangeText={handlePinChange}
          keyboardType="number-pad"
          maxLength={PIN_LENGTH}
          autoFocus
        />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {/* 生物识别按钮 */}
        <TouchableOpacity style={styles.bioBtn} onPress={handleBiometric}>
          <Text style={styles.bioIcon}>👆</Text>
          <Text style={styles.bioText}>使用生物识别</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>默认PIN: 123456</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  backBtn: {
    paddingTop: 60,
    paddingLeft: 20,
  },
  backText: {
    color: '#888',
    fontSize: 16,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  lockIcon: {
    fontSize: 56,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    marginBottom: 40,
  },
  pinRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  pinDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#555',
  },
  pinDotFilled: {
    backgroundColor: '#FF6B35',
    borderColor: '#FF6B35',
  },
  hiddenInput: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
  errorText: {
    color: '#ff4444',
    fontSize: 14,
    marginTop: 8,
  },
  bioBtn: {
    marginTop: 40,
    alignItems: 'center',
  },
  bioIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  bioText: {
    color: '#FF6B35',
    fontSize: 15,
  },
  hint: {
    color: '#444',
    fontSize: 12,
    marginTop: 30,
  },
});
