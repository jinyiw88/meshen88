import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../../App';
import { useAuthStore } from '../stores/authStore';

type Props = { navigation: NativeStackNavigationProp<RootStackParamList, 'Verify'> };

export default function VerifyScreen({ navigation }: Props) {
  const { verify, setVerified } = useAuthStore();
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<TextInput>(null);

  const handlePinChange = (text: string) => {
    const clean = text.replace(/[^0-9]/g, '').slice(0, 6);
    setPin(clean);
    setError('');

    if (clean.length === 6) {
      if (verify(clean)) {
        setVerified(true);
        navigation.replace('ChatList');
      } else {
        setError('PIN码错误');
        setPin('');
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← 返回</Text>
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.lockIcon}>🔐</Text>
        <Text style={styles.title}>身份验证</Text>
        <Text style={styles.subtitle}>请输入PIN码以继续</Text>
        <View style={styles.pinRow}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} style={[styles.pinDot, i < pin.length && styles.pinDotFilled]} />
          ))}
        </View>
        <TextInput
          ref={inputRef}
          style={styles.hiddenInput}
          value={pin}
          onChangeText={handlePinChange}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity
          style={styles.bioBtn}
          onPress={() => { setVerified(true); navigation.replace('ChatList'); }}
        >
          <Text style={styles.bioIcon}>👆</Text>
          <Text style={styles.bioText}>使用生物识别</Text>
        </TouchableOpacity>
        <Text style={styles.hint}>默认PIN: 123456</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  backBtn: { paddingTop: 20, paddingLeft: 20 },
  backText: { color: '#888', fontSize: 16 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  lockIcon: { fontSize: 56, marginBottom: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: '#888', fontSize: 15, marginBottom: 40 },
  pinRow: { flexDirection: 'row', gap: 16, marginBottom: 16 },
  pinDot: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: '#555' },
  pinDotFilled: { backgroundColor: '#FF6B35', borderColor: '#FF6B35' },
  hiddenInput: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  errorText: { color: '#ff4444', fontSize: 14, marginTop: 8 },
  bioBtn: { marginTop: 40, alignItems: 'center' },
  bioIcon: { fontSize: 32, marginBottom: 8 },
  bioText: { color: '#FF6B35', fontSize: 15 },
  hint: { color: '#444', fontSize: 12, marginTop: 30 },
});
