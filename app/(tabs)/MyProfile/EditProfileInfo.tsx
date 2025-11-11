import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Image,
  Dimensions,
} from 'react-native';
import { IconButton, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_BASE_URL = 'http://localhost:3000';
const USER_ID = "41f7f9da-dc0a-4657-a1a5-d70c062bc627"; // TODO: Get from auth context

const SCREEN_WIDTH = Dimensions.get('window').width;

const EditProfileInfo: React.FC = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";

  // Personal Info State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState<Date>(new Date(2000, 0, 1));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    requestPermissions();
    fetchUserData();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and media library permissions are needed to upload photos.');
    }
  };

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/user/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch user data');
      
      const data = await response.json();
      
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      if (data.dateOfBirth) {
        setDateOfBirth(new Date(data.dateOfBirth));
      }
      setProfilePicture(data.profilePicture || null);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const uploadProfilePicture = async (uri: string) => {
    try {
      const formData = new FormData();
      
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('image', {
        uri,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      } as any);

      const response = await fetch(`${API_BASE_URL}/users/user/${USER_ID}/profile-picture`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleProfilePicturePicker = async (source: 'camera' | 'library') => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      };

      let result;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        setUploading(true);
        try {
          const uploadedData = await uploadProfilePicture(result.assets[0].uri);
          setProfilePicture(uploadedData.url || result.assets[0].uri);
          Alert.alert('Success', 'Profile picture updated!');
        } catch (error) {
          Alert.alert('Error', 'Failed to upload profile picture. Please try again.');
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleDeleteProfilePicture = async () => {
    Alert.alert(
      'Delete Profile Picture',
      'Are you sure you want to delete your profile picture?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${API_BASE_URL}/users/user/${USER_ID}/profile-picture`,
                { method: 'DELETE' }
              );
              if (!response.ok) throw new Error('Failed to delete profile picture');
              setProfilePicture(null);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete profile picture.');
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    try {
      setSaving(true);
      const response = await fetch(`${API_BASE_URL}/users/user/${USER_ID}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          dateOfBirth: dateOfBirth.toISOString(),
        }),
      });

      if (!response.ok) throw new Error('Failed to save profile');

      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors[theme].mainBlue} />
          <Text style={[styles.loadingText, { color: Colors[theme].text }]}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}>
      <View style={[styles.header, { paddingTop: Math.min(insets.top || 0, 15) }]}>
        <TouchableOpacity onPress={() => router.back()}>
          <IconButton 
            icon="arrow-left" 
            size={24} 
            iconColor={Colors[theme].text}
          />
        </TouchableOpacity>
        <Text style={[styles.title, {color: Colors[theme].text}]}>Profile Info</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={Colors[theme].mainBlue} />
          ) : (
            <Text style={[styles.saveButton, {color: Colors[theme].mainBlue}]}>Save</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView 
          contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 40 }]}
          showsVerticalScrollIndicator={true}
          keyboardShouldPersistTaps="handled"
          nestedScrollEnabled={true}
        >
          {/* Profile Picture Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Profile Picture</Text>
            
            <View style={styles.profilePictureContainer}>
              {profilePicture ? (
                <View style={styles.imageWrapper}>
                  <Image
                    source={{ uri: profilePicture }}
                    style={[styles.profileImage, { borderColor: Colors[theme].mainBlue }]}
                    resizeMode="cover"
                  />
                  {uploading && (
                    <View style={styles.uploadOverlay}>
                      <ActivityIndicator size="large" color={Colors.light.white} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={[styles.deleteButton, { backgroundColor: Colors[theme].mainBlue }]}
                    onPress={handleDeleteProfilePicture}
                  >
                    <Ionicons name="trash" size={20} color={Colors.light.white} />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={[styles.placeholder, { borderColor: Colors[theme].silver }]}>
                  <Ionicons name="person" size={60} color={Colors[theme].silver} />
                </View>
              )}
            </View>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors[theme].cream, borderColor: Colors[theme].mainBlue }]}
                onPress={() => handleProfilePicturePicker('camera')}
                disabled={uploading}
              >
                <Ionicons name="camera" size={20} color={Colors[theme].mainBlue} />
                <Text style={[styles.actionButtonText, { color: Colors[theme].mainBlue }]}>Take Photo</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: Colors[theme].cream, borderColor: Colors[theme].mainBlue }]}
                onPress={() => handleProfilePicturePicker('library')}
                disabled={uploading}
              >
                <Ionicons name="image" size={20} color={Colors[theme].mainBlue} />
                <Text style={[styles.actionButtonText, { color: Colors[theme].mainBlue }]}>Photo Library</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Personal Information</Text>
            
            <TextInput
              label="First Name"
              value={firstName}
              onChangeText={setFirstName}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.firstName ? '#ff0000' : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.firstName}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

            <TextInput
              label="Last Name"
              value={lastName}
              onChangeText={setLastName}
              mode="outlined"
              style={styles.input}
              contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
              outlineColor={errors.lastName ? '#ff0000' : Colors[theme].silver}
              activeOutlineColor={Colors[theme].mainBlue}
              textColor={Colors[theme].text}
              error={!!errors.lastName}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

            <TouchableOpacity
              style={[styles.dateButton, { borderColor: Colors[theme].silver }]}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={[styles.dateLabel, {color: Colors[theme].textSecondary}]}>Date of Birth</Text>
              <Text style={[styles.dateButtonText, {color: Colors[theme].text}]}>
                {formatDate(dateOfBirth)}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={dateOfBirth}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowDatePicker(Platform.OS === 'ios');
                  if (selectedDate) {
                    setDateOfBirth(selectedDate);
                  }
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfileInfo;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  keyboardView: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  title: {
    fontSize: 20,
    fontFamily: 'EBGaramond_700Bold',
  },
  saveButton: {
    fontSize: 16,
    fontFamily: 'EBGaramond_600SemiBold',
    paddingHorizontal: 10,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'EBGaramond_700Bold',
    marginBottom: 12,
  },
  profilePictureContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
  },
  profileImage: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.2,
    borderWidth: 4,
  },
  placeholder: {
    width: SCREEN_WIDTH * 0.4,
    height: SCREEN_WIDTH * 0.4,
    borderRadius: SCREEN_WIDTH * 0.2,
    borderWidth: 2,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: SCREEN_WIDTH * 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButton: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.white,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
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
  },
  dateLabel: {
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginTop: 4,
    marginBottom: 10,
  },
});
