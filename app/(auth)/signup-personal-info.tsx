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
import DateTimePicker from '@react-native-community/datetimepicker';

const SignupPersonalInfo: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    const age = new Date().getFullYear() - dateOfBirth.getFullYear();
    if (age < 18) {
      newErrors.dateOfBirth = 'You must be at least 18 years old';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validateForm()) {
      // TODO: Save personal info
      console.log('Personal info:', { firstName, lastName, dateOfBirth, password });
      router.push('/(auth)/signup-profile-picture');
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={[styles.title, { color: Colors[theme].text }]}>Personal Information</Text>
            <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
              Tell us a bit about yourself
            </Text>
          </View>

          <View style={styles.form}>
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.firstName ? Colors.light.silver : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.firstName}
            />
            {errors.firstName && (
              <Text style={styles.errorText}>{errors.firstName}</Text>
            )}

            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.lastName ? Colors.light.silver : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.lastName}
            />
            {errors.lastName && (
              <Text style={styles.errorText}>{errors.lastName}</Text>
            )}

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={[
                styles.dateButton,
                { borderColor: errors.dateOfBirth ? '#ff0000' : Colors[theme].silver },
              ]}
            >
              <Text style={[styles.dateButtonText, { color: Colors[theme].text }]}>
                {formatDate(dateOfBirth)}
              </Text>
              <Text style={[styles.dateLabel, { color: Colors[theme].textSecondary }]}>
                Date of Birth
              </Text>
            </TouchableOpacity>
            {errors.dateOfBirth && (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            )}

            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
                maximumDate={new Date()}
              />
            )}

            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!showPassword}
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.password ? Colors.light.silver : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.password}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                  iconColor={Colors[theme].silver}
                />
              }
            />
            {errors.password && (
              <Text style={styles.errorText}>{errors.password}</Text>
            )}

            <TextInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              mode="outlined"
              secureTextEntry={!showConfirmPassword}
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.confirmPassword ? Colors.light.silver : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.confirmPassword}
              right={
                <TextInput.Icon
                  icon={showConfirmPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  iconColor={Colors[theme].silver}
                />
              }
            />
            {errors.confirmPassword && (
              <Text style={styles.errorText}>{errors.confirmPassword}</Text>
            )}

            <TouchableOpacity style={styles.button} onPress={handleContinue}>
              <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 10,
    backgroundColor: 'transparent',
  },
  dateButton: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 16,
    marginBottom: 10,
    borderStyle: 'solid',
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
  },
  button: {
    backgroundColor: Colors.light.mainBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 10,
    marginLeft: 4,
  },
});

export default SignupPersonalInfo;
