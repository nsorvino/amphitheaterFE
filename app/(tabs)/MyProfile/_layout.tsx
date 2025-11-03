import { Stack } from 'expo-router';

export default function MyProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Profile',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Preferences"
        options={{
          title: 'Preferences',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditPhotos"
        options={{
          title: 'Edit Photos',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="EditInfo"
        options={{
          title: 'Edit Info',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Portfolio"
        options={{
          title: 'Portfolio',
          headerShown: false,
        }}
      />
    </Stack>
  );
}

