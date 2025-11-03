import { Stack } from 'expo-router';

export default function ChatLayout() {
  return (
    <Stack
    screenOptions={{
      headerShown: false, // Hide all headers at this level
    }}>
      <Stack.Screen
        name="MyChats"
        options={{
          title: 'Chat',
          headerShown: false, // Hide header for the main chat
        }}
      />
      <Stack.Screen
        name="ActiveChat"
        options={{
          title: 'Active Chat',
          headerShown: false, // hide header for ActiveChat
        }}
      />
    </Stack>
  );
}