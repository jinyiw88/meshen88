import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from './src/stores/authStore';
import CameraScreen from './src/screens/CameraScreen';
import VerifyScreen from './src/screens/VerifyScreen';
import ChatListScreen from './src/screens/ChatListScreen';
import ChatScreen from './src/screens/ChatScreen';

export type RootStackParamList = {
  Camera: undefined;
  Verify: undefined;
  ChatList: undefined;
  Chat: { chatId: string; chatName: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Camera"
        screenOptions={{ headerShown: false, animation: 'none' }}
      >
        <Stack.Screen name="Camera" component={CameraScreen} />
        <Stack.Screen
          name="Verify"
          component={VerifyScreen}
          options={{ headerShown: true, title: '验证', headerStyle: { backgroundColor: '#0a0a0a' }, headerTintColor: '#fff' }}
        />
        <Stack.Screen
          name="ChatList"
          component={ChatListScreen}
          options={{ headerShown: true, title: 'insataPic', headerStyle: { backgroundColor: '#0a0a0a' }, headerTintColor: '#fff' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({
            headerShown: true,
            title: route.params?.chatName ?? '聊天',
            headerStyle: { backgroundColor: '#0a0a0a' },
            headerTintColor: '#fff',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
