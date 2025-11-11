import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as ImagePicker from 'expo-image-picker';

const SignupVerification: React.FC = () => {
  const [verificationImage, setVerificationImage] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      if (cameraStatus !== 'granted') {
        Alert.alert('Permission required', 'We need camera permission to take your verification photo.');
        return false;
      }
    }
    return true;
  };

  const handleTakeVerificationPhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.9,
      });

      if (!result.canceled && result.assets[0]) {
        setVerificationImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take verification photo. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const handleContinue = () => {
    if (!verificationImage) {
      Alert.alert('Verification Photo Required', 'Please take a verification photo before continuing.');
      return;
    }
    // TODO: Save verification image
    console.log('Verification image:', verificationImage);
    router.push('/(auth)/signup-goals-bio');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>Verification Photo</Text>
          <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
            We need to verify your identity
          </Text>
        </View>

        <View style={styles.instructionBox}>
          <Text style={[styles.instructionTitle, { color: Colors[theme].text }]}>
            Instructions:
          </Text>
          <Text style={[styles.instructionText, { color: Colors[theme].textSecondary }]}>
            • Take a clear photo of your face{'\n'}
            • Make the hand gesture we ask you to make{'\n'}
            • Ensure your face is clearly visible{'\n'}
            • Use good lighting
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {verificationImage ? (
            <Image source={{ uri: verificationImage }} style={styles.verificationImage} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: Colors[theme].silver }]}>
              <Text style={[styles.placeholderText, { color: Colors[theme].textSecondary }]}>
                No Photo Taken
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.cameraButton} onPress={handleTakeVerificationPhoto}>
          <Text style={[styles.cameraButtonText, { color: Colors[theme].mainBlue }]}>
            📷 Take Verification Photo
          </Text>
        </TouchableOpacity>

        {verificationImage && (
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setVerificationImage(null)}
          >
            <Text style={[styles.retakeText, { color: '#ff0000' }]}>Retake Photo</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={handleContinue}>
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
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
    marginBottom: 30,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontFamily: 'EBGaramond_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    textAlign: 'center',
  },
  instructionBox: {
    backgroundColor: Colors.light.cream,
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: Colors.light.silver,
  },
  instructionTitle: {
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    lineHeight: 22,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  verificationImage: {
    width: 300,
    height: 400,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.light.mainBlue,
  },
  placeholder: {
    width: 300,
    height: 400,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.light.silver,
    borderStyle: 'dashed',
  },
  placeholderText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  cameraButton: {
    backgroundColor: Colors.light.cream,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.mainBlue,
    marginBottom: 15,
  },
  cameraButtonText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_600SemiBold',
  },
  retakeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  retakeText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_500Medium',
  },
  button: {
    backgroundColor: Colors.light.mainBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
  },
});

export default SignupVerification;
