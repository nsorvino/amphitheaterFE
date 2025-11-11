import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const API_BASE_URL = 'http://localhost:3000';

// Dev profile credentials
const DEV_EMAIL = 'dev@amphitheater.com';
const DEV_PASSWORD = 'dev123456';
const DEV_USER_ID = '41f7f9da-dc0a-4657-a1a5-d70c062bc627';

const Login: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const handleLogin = async () => {
    if (!emailOrPhone.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both email/phone and password');
      return;
    }

    try {
      setLoading(true);
      // TODO: Replace with actual login API endpoint
      // For now, we'll do a simple check and navigate
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailOrPhone: emailOrPhone.trim(),
          password: password.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // TODO: Store auth token and user ID
        console.log('Login successful:', data);
        router.replace('/(tabs)/ProfileQueue');
      } else {
        // For dev: allow login with any credentials or dev credentials
        if (emailOrPhone.trim() === DEV_EMAIL && password.trim() === DEV_PASSWORD) {
          console.log('Dev login successful');
          router.replace('/(tabs)/ProfileQueue');
        } else {
          Alert.alert('Login Failed', 'Invalid credentials. Use dev@amphitheater.com / dev123456 for dev login.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      // Fallback to dev login for development
      if (emailOrPhone.trim() === DEV_EMAIL && password.trim() === DEV_PASSWORD) {
        console.log('Dev login successful (offline mode)');
        router.replace('/(tabs)/ProfileQueue');
      } else {
        Alert.alert('Connection Error', 'Could not connect to server. Use Dev Login button or try dev@amphitheater.com / dev123456');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    setEmailOrPhone(DEV_EMAIL);
    setPassword(DEV_PASSWORD);
    // Auto-login after setting credentials
    setTimeout(() => {
      handleLogin();
    }, 100);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors[theme].text }]}>Welcome Back</Text>
            <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
              Sign in to continue
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Email or Phone Number"
              value={emailOrPhone}
              onChangeText={setEmailOrPhone}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  color={Colors[theme].silver}
                />
              }
            />

            <TouchableOpacity 
              style={styles.loginButton} 
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={Colors.light.white} />
              ) : (
                <Text style={styles.loginButtonText}>Sign In</Text>
              )}
            </TouchableOpacity>

            {/* Dev Login Button */}
            <TouchableOpacity 
              style={[styles.devLoginButton, { borderColor: Colors[theme].mainBlue }]} 
              onPress={handleDevLogin}
              disabled={loading}
            >
              <Text style={[styles.devLoginButtonText, { color: Colors[theme].mainBlue }]}>
                Dev Login (Quick Access)
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupLink}
              onPress={() => router.push('/(auth)/signup')}
            >
              <Text style={[styles.signupLinkText, { color: Colors[theme].mainBlue }]}>
                Don't have an account? Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'EBGaramond_700Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  form: {
    width: '100%',
  },
  input: {
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  loginButton: {
    backgroundColor: Colors.light.mainBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  loginButtonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
  },
  devLoginButton: {
    borderWidth: 2,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  devLoginButtonText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  signupLink: {
    alignItems: 'center',
  },
  signupLinkText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
});

export default Login;
