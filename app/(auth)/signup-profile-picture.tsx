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

const SignupProfilePicture: React.FC = () => {
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const requestPermissions = async () => {
    if (Platform.OS !== 'web') {
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (cameraStatus !== 'granted' || libraryStatus !== 'granted') {
        Alert.alert('Permission required', 'We need camera and photo library permissions to set your profile picture.');
        return false;
      }
    }
    return true;
  };

  const handleTakePicture = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take picture. Please try again.');
      console.error('Camera error:', error);
    }
  };

  const handleChooseFromGallery = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
      console.error('Image picker error:', error);
    }
  };

  const handleChooseFromFiles = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        setProfilePicture(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select file. Please try again.');
      console.error('File picker error:', error);
    }
  };

  const handleContinue = () => {
    if (!profilePicture) {
      Alert.alert('Profile Picture Required', 'Please add a profile picture before continuing.');
      return;
    }
    // TODO: Save profile picture
    console.log('Profile picture:', profilePicture);
    router.push('/(auth)/signup-fields-titles');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>Profile Picture</Text>
          <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
            Please upload a clear photo of your face. This will be used for verification.
          </Text>
        </View>

        <View style={styles.imageContainer}>
          {profilePicture ? (
            <Image source={{ uri: profilePicture }} style={styles.profileImage} />
          ) : (
            <View style={[styles.placeholder, { backgroundColor: Colors[theme].silver }]}>
              <Text style={[styles.placeholderText, { color: Colors[theme].textSecondary }]}>
                No Image
              </Text>
            </View>
          )}
        </View>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionButton} onPress={handleTakePicture}>
            <Text style={[styles.optionText, { color: Colors[theme].mainBlue }]}>
              📷 Take Picture
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleChooseFromGallery}>
            <Text style={[styles.optionText, { color: Colors[theme].mainBlue }]}>
              🖼️ Choose from Gallery
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionButton} onPress={handleChooseFromFiles}>
            <Text style={[styles.optionText, { color: Colors[theme].mainBlue }]}>
              📁 Choose from Files
            </Text>
          </TouchableOpacity>

          {profilePicture && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setProfilePicture(null)}
            >
              <Text style={[styles.removeText, { color: '#ff0000' }]}>Remove Image</Text>
            </TouchableOpacity>
          )}
        </View>

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
    marginBottom: 40,
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
  imageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 3,
    borderColor: Colors.light.mainBlue,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
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
  optionsContainer: {
    width: '100%',
    marginBottom: 30,
  },
  optionButton: {
    backgroundColor: Colors.light.cream,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.light.silver,
  },
  optionText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  removeButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  removeText: {
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

export default SignupProfilePicture;
