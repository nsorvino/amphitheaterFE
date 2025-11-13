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
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { api, BackendUser } from '@/lib/api';
import { DEV_USER_ID } from '@/constants/devUser';

const USER_ID = DEV_USER_ID;

const FIELDS = ['Film', 'T.V.', 'Video', 'Music'];
const TITLES_BY_FIELD: Record<string, string[]> = {
  Film: ['Director', 'Producer', 'Cinematographer', 'Editor', 'Actor', 'Actress'],
  'T.V.': ['Showrunner', 'Producer', 'Director', 'Writer', 'Actor', 'Actress'],
  Video: ['Director', 'Producer', 'Editor', 'Videographer', 'Colorist'],
  Music: ['Producer', 'Engineer', 'Artist', 'Composer', 'Musician', 'Songwriter'],
};

const EditFieldsTitles: React.FC = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";

  // Fields & Titles State
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const [backendUser, setBackendUser] = useState<BackendUser | null>(null);

  // UI State
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const [userResult, filtersResult] = await Promise.all([
        api.getUser(USER_ID),
        api.getFilters(USER_ID),
      ]);

      const user = userResult.user;
      const filters = filtersResult;

      setBackendUser(user);
      const parsedTitles = user.role
        ? user.role.split(',').map((title) => title.trim()).filter(Boolean)
        : [];
      const parsedFields = filters.filter_roles
        ? filters.filter_roles.split(',').map((field) => field.trim()).filter(Boolean)
        : [];

      setSelectedFields(parsedFields);
      setSelectedTitles(parsedTitles);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Alert.alert('Error', 'Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (selectedFields.length === 0) {
      newErrors.fields = 'Please select at least one field';
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
      const currentUser = backendUser;

      if (!currentUser) {
        throw new Error('Missing user data');
      }

      const updatedTitles = selectedTitles.join(', ');
      await api.updateUser(USER_ID, {
        name: currentUser.name || 'Unnamed User',
        role: updatedTitles || currentUser.role || '',
        location: currentUser.location || 'Unknown',
      });

      await api.updateFilters(USER_ID, {
        filter_roles: selectedFields.length > 0 ? selectedFields.join(', ') : null,
      });

      Alert.alert('Success', 'Fields and titles updated successfully!', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error('Error saving profile:', error);
      Alert.alert('Error', 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const toggleField = (field: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        // Remove field and its titles
        const newTitles = selectedTitles.filter((title) => {
          const fieldTitles = TITLES_BY_FIELD[field] || [];
          return !fieldTitles.includes(title);
        });
        setSelectedTitles(newTitles);
        return prev.filter((f) => f !== field);
      } else {
        return [...prev, field];
      }
    });
  };

  const toggleTitle = (title: string) => {
    setSelectedTitles((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const getAvailableTitles = () => {
    const allTitles = selectedFields.flatMap((field) => TITLES_BY_FIELD[field] || []);
    // Remove duplicates
    return Array.from(new Set(allTitles));
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

  const availableTitles = getAvailableTitles();

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
        <Text style={[styles.title, {color: Colors[theme].text}]}>Fields & Titles</Text>
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
          {/* Fields Section */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Fields</Text>
            {errors.fields && <Text style={styles.errorText}>{errors.fields}</Text>}
            <View style={styles.tagsContainer}>
              {FIELDS.map((field) => {
                const isSelected = selectedFields.includes(field);
                return (
                  <TouchableOpacity
                    key={field}
                    style={[
                      styles.tag,
                      {
                        backgroundColor: Colors[theme].cream,
                        borderColor: isSelected
                          ? Colors[theme].mainBlue
                          : Colors[theme].silver,
                        borderWidth: 1,
                      },
                    ]}
                    onPress={() => toggleField(field)}
                  >
                    <Text
                      style={[
                        styles.tagText,
                        { color: isSelected ? Colors[theme].mainBlue : Colors[theme].text },
                      ]}
                    >
                      {field}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Titles Section */}
          {selectedFields.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Titles</Text>
              {availableTitles.length > 0 ? (
                <>
                  <Text style={[styles.sectionDescription, {color: Colors[theme].textSecondary}]}>
                    Select your professional titles (you can choose multiple)
                  </Text>
                  <View style={styles.tagsContainer}>
                    {availableTitles.map((title) => {
                      const isSelected = selectedTitles.includes(title);
                      return (
                        <TouchableOpacity
                          key={title}
                          style={[
                            styles.tag,
                            {
                              backgroundColor: isSelected
                                ? Colors[theme].mainBlue
                                : Colors[theme].cream,
                              borderColor: isSelected
                                ? Colors[theme].mainBlue
                                : Colors[theme].mainBlue,
                              borderWidth: 1,
                            },
                          ]}
                          onPress={() => toggleTitle(title)}
                        >
                          <Text
                            style={[
                              styles.tagText,
                              { color: isSelected ? Colors.light.white : Colors[theme].mainBlue },
                            ]}
                          >
                            {title}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              ) : (
                <Text style={[styles.sectionDescription, {color: Colors[theme].textSecondary}]}>
                  No titles available for selected fields
                </Text>
              )}
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditFieldsTitles;

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
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  tagText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_500Medium',
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginTop: 4,
    marginBottom: 10,
  },
});
