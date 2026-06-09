import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import { useChatStore } from '../stores/chatStore';
import dayjs from 'dayjs';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Chat'>;
  route: RouteProp<RootStackParamList, 'Chat'>;
};

interface Message {
  id: string;
  text: string;
  time: string;
  isMine: boolean;
}

export default function ChatScreen({ route }: Props) {
  const { chatId } = route.params;
  const addMessage = useChatStore((s) => s.addMessage);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: '端到端加密已建立 🔒', time: dayjs().format('HH:mm'), isMine: false },
  ]);
  const flatRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const msg: Message = { id: `msg_${Date.now()}`, text: input.trim(), time: dayjs().format('HH:mm'), isMine: true };
    setMessages((prev) => [...prev, msg]);
    addMessage(chatId, input.trim());
    setInput('');
    setTimeout(() => {
      setMessages((prev) => [...prev, { id: `msg_${Date.now()}_r`, text: '消息已加密发送 ✓', time: dayjs().format('HH:mm'), isMine: false }]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.msgRow, item.isMine ? styles.msgRowMine : styles.msgRowOther]}>
      <View style={[styles.msgBubble, item.isMine ? styles.bubbleMine : styles.bubbleOther]}>
        <Text style={[styles.msgText, item.isMine && styles.msgTextMine]}>{item.text}</Text>
        <Text style={styles.msgTime}>{item.time}</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <FlatList ref={flatRef} data={messages} keyExtractor={(item) => item.id} renderItem={renderMessage}
        contentContainerStyle={styles.msgList} onContentSizeChange={() => flatRef.current?.scrollToEnd({ animated: true })} />
      <View style={styles.inputBar}>
        <TouchableOpacity style={styles.attachBtn}><Text style={styles.attachIcon}>📎</Text></TouchableOpacity>
        <TextInput style={styles.input} value={input} onChangeText={setInput} placeholder="输入消息..." placeholderTextColor="#666" multiline maxLength={2000} />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}><Text style={styles.sendIcon}>➤</Text></TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  msgList: { paddingVertical: 12, paddingHorizontal: 16 },
  msgRow: { marginBottom: 8, flexDirection: 'row' },
  msgRowMine: { justifyContent: 'flex-end' },
  msgRowOther: { justifyContent: 'flex-start' },
  msgBubble: { maxWidth: '75%', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMine: { backgroundColor: '#FF6B35', borderBottomRightRadius: 4 },
  bubbleOther: { backgroundColor: '#1a1a1a', borderBottomLeftRadius: 4 },
  msgText: { color: '#fff', fontSize: 15, lineHeight: 20 },
  msgTextMine: { color: '#fff' },
  msgTime: { color: 'rgba(255,255,255,0.4)', fontSize: 11, marginTop: 4, textAlign: 'right' },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#1a1a1a', backgroundColor: '#0f0f0f' },
  attachBtn: { padding: 8 },
  attachIcon: { fontSize: 20 },
  input: { flex: 1, color: '#fff', fontSize: 15, maxHeight: 100, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, backgroundColor: '#1a1a1a' },
  sendBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FF6B35', justifyContent: 'center', alignItems: 'center', marginLeft: 8 },
  sendIcon: { color: '#fff', fontSize: 18, marginLeft: 2 },
});
