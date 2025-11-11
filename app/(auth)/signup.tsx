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
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const Signup: React.FC = () => {
  const [step, setStep] = useState<'contact' | 'verify-phone' | 'verify-email'>('contact');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const handleSendPhoneCode = () => {
    // TODO: Implement SMS verification
    console.log('Sending SMS code to:', phoneNumber);
    setStep('verify-phone');
  };

  const handleVerifyPhone = () => {
    // TODO: Verify phone code
    console.log('Verifying phone code:', phoneCode);
    setStep('verify-email');
  };

  const handleSendEmailCode = () => {
    // TODO: Implement email verification link
    console.log('Sending email verification to:', email);
  };

  const handleContinue = () => {
    // Move to next step of signup
    router.push('/(auth)/signup-personal-info');
  };

  if (step === 'verify-phone') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity onPress={() => setStep('contact')} style={styles.backButton}>
              <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={[styles.title, { color: Colors[theme].text }]}>Verify Phone</Text>
              <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
                Enter the code sent to {phoneNumber}
              </Text>
            </View>

            <View style={styles.form}>
              <TextInput
                label="Verification Code"
                value={phoneCode}
                onChangeText={setPhoneCode}
                mode="outlined"
                style={styles.input}
                contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
                outlineColor={Colors[theme].silver}
                activeOutlineColor={Colors[theme].mainBlue}
                textColor={Colors[theme].text}
                keyboardType="number-pad"
                maxLength={6}
              />

              <TouchableOpacity style={styles.button} onPress={handleVerifyPhone}>
                <Text style={styles.buttonText}>Verify</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendButton}>
                <Text style={[styles.resendText, { color: Colors[theme].mainBlue }]}>
                  Resend Code
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  if (step === 'verify-email') {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView contentContainerStyle={styles.scrollContent}>
            <TouchableOpacity onPress={() => setStep('contact')} style={styles.backButton}>
              <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
            </TouchableOpacity>

            <View style={styles.header}>
              <Text style={[styles.title, { color: Colors[theme].text }]}>Verify Email</Text>
              <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
                Check your email at {email} for a verification link
              </Text>
            </View>

            <View style={styles.form}>
              <TouchableOpacity style={styles.button} onPress={handleContinue}>
                <Text style={styles.buttonText}>Continue</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.resendButton} onPress={handleSendEmailCode}>
                <Text style={[styles.resendText, { color: Colors[theme].mainBlue }]}>
                  Resend Email
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors[theme].text }]}>Create Account</Text>
            <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
              We'll need to verify your contact information
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="Phone Number"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              keyboardType="phone-pad"
              placeholder="+1 (555) 123-4567"
            />

            <TouchableOpacity style={styles.button} onPress={handleSendPhoneCode}>
              <Text style={styles.buttonText}>Send Verification Code</Text>
            </TouchableOpacity>

            <Text style={[styles.divider, { color: Colors[theme].textSecondary }]}>OR</Text>

            <TextInput
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="your.email@example.com"
            />

            <TouchableOpacity style={styles.button} onPress={handleSendEmailCode}>
              <Text style={styles.buttonText}>Send Verification Email</Text>
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
    paddingTop: 20,
    paddingBottom: 40,
  },
  backButton: {
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  header: {
    marginBottom: 40,
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
  button: {
    backgroundColor: Colors.light.mainBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
  },
  divider: {
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    marginVertical: 20,
  },
  resendButton: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
});

export default Signup;
