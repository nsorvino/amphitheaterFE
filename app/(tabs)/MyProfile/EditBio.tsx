import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput as RNTextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { api } from '@/lib/api';
import { DEV_USER_ID } from '@/constants/devUser';

const USER_ID = DEV_USER_ID;

const MAX_BIO_WORDS = 500;

const EditBio: React.FC = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";

  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const profileSettings = await api.getProfileSettings(USER_ID).catch(() => undefined);
      setBio(profileSettings?.bio ?? '');
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const bioWordCount = countWords(bio);
    if (bioWordCount > MAX_BIO_WORDS) {
      newErrors.bio = `Bio must be ${MAX_BIO_WORDS} words or less`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fix the errors before saving.');
      return;
    }

    try {
      setSaving(true);
      await api.updateFilters(USER_ID, { bio });

      Alert.alert('Success', 'Bio updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const bioWordCount = countWords(bio);

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
        <Text style={[styles.title, {color: Colors[theme].text}]}>Bio</Text>
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
          <View style={styles.section}>
            <View style={styles.labelContainer}>
              <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Bio</Text>
              <Text
                style={[
                  styles.wordCount,
                  { color: bioWordCount > MAX_BIO_WORDS ? '#ff0000' : Colors[theme].textSecondary },
                ]}
              >
                {bioWordCount} / {MAX_BIO_WORDS} words
              </Text>
            </View>
            <RNTextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell us about yourself, your experience, and what makes you unique..."
              placeholderTextColor={Colors[theme].textSecondary}
              style={[
                styles.textArea,
                {
                  color: Colors[theme].text,
                  borderColor: errors.bio || bioWordCount > MAX_BIO_WORDS ? '#ff0000' : Colors[theme].silver,
                  backgroundColor: Colors[theme].background,
                },
              ]}
              multiline
              numberOfLines={14}
              textAlignVertical="top"
            />
            {errors.bio && <Text style={styles.errorText}>{errors.bio}</Text>}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditBio;

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
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  wordCount: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
  },
  textArea: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    minHeight: 250,
    maxHeight: 500,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginTop: 4,
    marginBottom: 10,
  },
});
