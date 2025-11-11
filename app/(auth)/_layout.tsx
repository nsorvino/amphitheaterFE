import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="signup-personal-info" />
      <Stack.Screen name="signup-profile-picture" />
      <Stack.Screen name="signup-fields-titles" />
      <Stack.Screen name="signup-documents" />
      <Stack.Screen name="signup-verification" />
      <Stack.Screen name="signup-goals-bio" />
    </Stack>
  );
}
