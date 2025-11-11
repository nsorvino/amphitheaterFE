import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  StatusBar,
} from 'react-native';
import { IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const API_BASE_URL = 'http://localhost:3000';
const USER_ID = "41f7f9da-dc0a-4657-a1a5-d70c062bc627"; // TODO: Get from auth context

const SCREEN_WIDTH = Dimensions.get('window').width;

interface Headshot {
  id?: string;
  uri: string;
  uploading?: boolean;
}

const EditPhotos: React.FC = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";

  const [headshots, setHeadshots] = useState<Headshot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHeadshot, setSelectedHeadshot] = useState<string | null>(null);

  useEffect(() => {
    requestPermissions();
    fetchUserPhotos();
  }, []);

  const requestPermissions = async () => {
    const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
    const { status: mediaStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (cameraStatus !== 'granted' || mediaStatus !== 'granted') {
      Alert.alert('Permission Required', 'Camera and media library permissions are needed to upload photos.');
    }
  };

  const fetchUserPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/user/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch user photos');
      
      const data = await response.json();
      // Use API data if available, otherwise fall back to mock data for development
      if (data.headshots && data.headshots.length > 0) {
        setHeadshots(data.headshots);
      } else {
        // Mock data fallback for development
        const MOCK_HEADSHOTS = [
          { uri: 'https://picsum.photos/seed/headshot1/400/500' },
          { uri: 'https://picsum.photos/seed/headshot2/400/500' },
        ];
        setHeadshots(MOCK_HEADSHOTS);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
      // Use mock data as fallback for development
      const MOCK_HEADSHOTS = [
        { uri: 'https://picsum.photos/seed/headshot1/400/500' },
        { uri: 'https://picsum.photos/seed/headshot2/400/500' },
      ];
      setHeadshots(MOCK_HEADSHOTS);
    } finally {
      setLoading(false);
    }
  };

  const uploadImage = async (uri: string) => {
    try {
      const formData = new FormData();
      
      // Get file extension
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('image', {
        uri,
        type: `image/${fileType}`,
        name: `photo.${fileType}`,
      } as any);

      const endpoint = `${API_BASE_URL}/users/user/${USER_ID}/headshots`;

      const response = await fetch(endpoint, {
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

  const handleHeadshotPicker = async (source: 'camera' | 'library') => {
    try {
      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [2, 3], // Typical headshot ratio
        quality: 0.8,
      };

      let result: ImagePicker.ImagePickerResult;
      if (source === 'camera') {
        result = await ImagePicker.launchCameraAsync(options);
      } else {
        result = await ImagePicker.launchImageLibraryAsync(options);
      }

      if (!result.canceled && result.assets && result.assets[0]) {
        const assetUri = result.assets[0].uri;
        const newHeadshot: Headshot = { uri: assetUri, uploading: true };
        setHeadshots((prev) => [...prev, newHeadshot]);

        try {
          const uploadedData = await uploadImage(assetUri);
          setHeadshots((prev) =>
            prev.map((h) =>
              h.uri === assetUri
                ? { ...h, uri: uploadedData.url || assetUri, id: uploadedData.id, uploading: false }
                : h
            )
          );
        } catch (error) {
          setHeadshots((prev) => prev.filter((h) => h.uri !== assetUri));
          Alert.alert('Error', 'Failed to upload headshot. Please try again.');
        }
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select headshot. Please try again.');
    }
  };

  const handleDeleteHeadshot = async (index: number, headshot: Headshot) => {
    Alert.alert(
      'Delete Headshot',
      'Are you sure you want to delete this headshot?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (headshot.id) {
                const response = await fetch(
                  `${API_BASE_URL}/users/user/${USER_ID}/headshots/${headshot.id}`,
                  { method: 'DELETE' }
                );
                if (!response.ok) throw new Error('Failed to delete headshot');
              }
              setHeadshots((prev) => prev.filter((_, i) => i !== index));
            } catch (error) {
              Alert.alert('Error', 'Failed to delete headshot.');
            }
          },
        },
      ]
    );
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
        <Text style={[styles.title, {color: Colors[theme].text}]}>Headshots</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Headshots Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>
            Headshots <Text style={[styles.sectionSubtitle, {color: Colors[theme].textSecondary}]}>(required for actors/models)</Text>
          </Text>

          {headshots.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.headshotsScroll}
              contentContainerStyle={styles.headshotsContent}
            >
              {headshots.map((headshot, index) => (
                <View key={index} style={styles.headshotWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setSelectedHeadshot(headshot.uri)}
                  >
                    <Image 
                      source={{ uri: headshot.uri }} 
                      style={[styles.headshotImage, { borderColor: Colors[theme].silver }]}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  {headshot.uploading && (
                    <View style={styles.uploadOverlay}>
                      <ActivityIndicator size="large" color={Colors.light.white} />
                    </View>
                  )}
                  <TouchableOpacity
                    style={styles.deleteHeadshotButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteHeadshot(index, headshot);
                    }}
                  >
                    <Ionicons name="close" size={18} color={Colors[theme].mainBlue} />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={[styles.emptyHeadshotBox, { borderColor: Colors[theme].silver }]}>
              <Text style={[styles.emptyHeadshotText, {color: Colors[theme].textSecondary}]}>
                no headshots here...
              </Text>
            </View>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors[theme].cream, borderColor: Colors[theme].mainBlue }]}
              onPress={() => handleHeadshotPicker('camera')}
            >
              <Ionicons name="camera" size={20} color={Colors[theme].mainBlue} />
              <Text style={[styles.actionButtonText, { color: Colors[theme].mainBlue }]}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, { backgroundColor: Colors[theme].cream, borderColor: Colors[theme].mainBlue }]}
              onPress={() => handleHeadshotPicker('library')}
            >
              <Ionicons name="image" size={20} color={Colors[theme].mainBlue} />
              <Text style={[styles.actionButtonText, { color: Colors[theme].mainBlue }]}>Photo Library</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Fullscreen Image Viewer Modal */}
      <Modal
        visible={selectedHeadshot !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedHeadshot(null)}
      >
        <StatusBar hidden={true} />
        <View style={styles.fullscreenModal}>
          <TouchableOpacity
            style={styles.fullscreenModalBackground}
            activeOpacity={1}
            onPress={() => setSelectedHeadshot(null)}
          />
          <TouchableOpacity
            style={[styles.fullscreenCloseButton, { top: insets.top + 20 }]}
            onPress={() => setSelectedHeadshot(null)}
            activeOpacity={0.7}
          >
            <Ionicons name="close" size={32} color={Colors.light.white} />
          </TouchableOpacity>
          {selectedHeadshot && (
            <Image
              source={{ uri: selectedHeadshot }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EditPhotos;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
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
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'EBGaramond_700Bold',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontFamily: 'EBGaramond_400Regular',
    fontWeight: 'normal',
  },
  sectionDescription: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 16,
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
  headshotsScroll: {
    marginBottom: 20,
    paddingLeft: 8,
    paddingRight: 8,
  },
  headshotsContent: {
    paddingRight: 12,
  },
  emptyHeadshotBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 150,
    marginBottom: 20,
  },
  emptyHeadshotText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    textAlign: 'center',
  },
  fullscreenModal: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenModalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  fullscreenImage: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    zIndex: 1,
  },
  fullscreenCloseButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1000,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headshotWrapper: {
    position: 'relative',
    marginRight: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  headshotImage: {
    width: 120,
    height: 180,
    borderRadius: 12,
    borderWidth: 2,
  },
  deleteHeadshotButton: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: Colors.light.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

