import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
} from 'react-native';
import { IconButton, Card, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { API_BASE_URL } from '@/lib/api';
import { DEV_USER_ID } from '@/constants/devUser';

const USER_ID = DEV_USER_ID;

interface Document {
  id?: string;
  name: string;
  uri: string;
  type: 'resume' | 'portfolio';
  uploading?: boolean;
}

const Portfolio: React.FC = () => {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";

  const [resume, setResume] = useState<Document | null>(null);
  const [portfolio, setPortfolio] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchUserDocuments();
  }, []);

  const fetchUserDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/users/user/${USER_ID}`);
      if (!response.ok) throw new Error('Failed to fetch user documents');
      
      const data = await response.json();
      console.log('Fetched user data:', data);
      
      // Handle resume - could be object or string (URL)
      if (data.resume) {
        if (typeof data.resume === 'string') {
          // If it's just a URL string
          const fileName = data.resume.split('/').pop() || 'Resume.pdf';
          setResume({ 
            name: fileName,
            uri: data.resume, 
            type: 'resume' 
          });
        } else if (data.resume.name && data.resume.uri) {
          // If it's an object with name and uri
          setResume({ ...data.resume, type: 'resume' });
        }
      }
      
      // Handle portfolio - could be object or string (URL)
      if (data.portfolio) {
        if (typeof data.portfolio === 'string') {
          // If it's just a URL string
          const fileName = data.portfolio.split('/').pop() || 'Portfolio.pdf';
          setPortfolio({ 
            name: fileName,
            uri: data.portfolio, 
            type: 'portfolio' 
          });
        } else if (data.portfolio.name && data.portfolio.uri) {
          // If it's an object with name and uri
          setPortfolio({ ...data.portfolio, type: 'portfolio' });
        }
      }
      
      console.log('Documents loaded - Resume:', data.resume, 'Portfolio:', data.portfolio);
    } catch (error) {
      console.error('Error fetching documents:', error);
      Alert.alert('Error', 'Failed to load documents. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const uploadDocument = async (uri: string, name: string, type: 'resume' | 'portfolio') => {
    try {
      const formData = new FormData();
      
      // Get file extension
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      
      formData.append('document', {
        uri,
        type: `application/${fileType}`,
        name: `${name}.${fileType}`,
      } as any);

      const endpoint = `${API_BASE_URL}/users/user/${USER_ID}/${type}`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to upload document');
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  };

  const handleDocumentPicker = async (type: 'resume' | 'portfolio') => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setUploading(true);
        
        const asset = result.assets[0];
        const fileName = asset.name;
        const fileUri = asset.uri;
        
        // Update state with uploading document
        const newDoc: Document = {
          name: fileName,
          uri: fileUri,
          type,
          uploading: true,
        };

        if (type === 'resume') {
          setResume(newDoc);
        } else {
          setPortfolio(newDoc);
        }

        try {
          const uploadedData = await uploadDocument(fileUri, fileName, type);
          
          const updatedDoc: Document = {
            id: uploadedData.id,
            name: uploadedData.name || fileName,
            uri: uploadedData.uri || fileUri,
            type,
            uploading: false,
          };

          if (type === 'resume') {
            setResume(updatedDoc);
          } else {
            setPortfolio(updatedDoc);
          }

          Alert.alert('Success', `${type === 'resume' ? 'Resume' : 'Portfolio'} uploaded successfully!`);
        } catch (error) {
          if (type === 'resume') {
            setResume(null);
          } else {
            setPortfolio(null);
          }
          Alert.alert('Error', `Failed to upload ${type}. Please try again.`);
        } finally {
          setUploading(false);
        }
      }
    } catch (error) {
      console.error('Error picking document:', error);
      Alert.alert('Error', 'Failed to select document. Please try again.');
    }
  };

  const handleViewDocument = async (document: Document) => {
    try {
      if (document.uri.startsWith('http')) {
        // Open URL in browser or PDF viewer
        const supported = await Linking.canOpenURL(document.uri);
        if (supported) {
          await Linking.openURL(document.uri);
        } else {
          Alert.alert('Error', 'Cannot open this document.');
        }
      } else {
        // For local files, you might need to use expo-file-system or expo-sharing
        Alert.alert('Info', 'Viewing local files requires additional setup.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open document.');
    }
  };

  const handleDeleteDocument = async (type: 'resume' | 'portfolio') => {
    Alert.alert(
      `Delete ${type === 'resume' ? 'Resume' : 'Portfolio'}`,
      `Are you sure you want to delete your ${type}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const doc = type === 'resume' ? resume : portfolio;
              if (doc?.id) {
                const response = await fetch(
                  `${API_BASE_URL}/users/user/${USER_ID}/${type}/${doc.id}`,
                  { method: 'DELETE' }
                );
                if (!response.ok) throw new Error(`Failed to delete ${type}`);
              }

              if (type === 'resume') {
                setResume(null);
              } else {
                setPortfolio(null);
              }
            } catch (error) {
              Alert.alert('Error', `Failed to delete ${type}.`);
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
        <Text style={[styles.title, {color: Colors[theme].text}]}>Documents</Text>
        <View style={{width: 40}} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.container, { paddingBottom: tabBarHeight + 20 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Resume Section */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Resume</Text>
            <Text style={[styles.optionalText, {color: Colors[theme].textSecondary}]}>
              (optional)
            </Text>
          </View>

          {resume && !resume.uploading ? (
            <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
              <Card.Content style={styles.documentContent}>
                <IconButton 
                  icon="file-document" 
                  size={32} 
                  iconColor={Colors[theme].mainBlue} 
                />
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, {color: Colors[theme].text}]}>{resume.name}</Text>
                  <Text style={[styles.documentStatus, {color: Colors[theme].textSecondary}]}>
                    ✓ Uploaded
                  </Text>
                  {resume.uploading && (
                    <View style={styles.uploadingIndicator}>
                      <ActivityIndicator size="small" color={Colors[theme].mainBlue} />
                      <Text style={[styles.uploadingText, {color: Colors[theme].textSecondary}]}>
                        Uploading...
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.documentActions}>
                  <TouchableOpacity
                    onPress={() => handleViewDocument(resume)}
                    style={styles.actionIcon}
                    disabled={resume.uploading}
                  >
                    <Ionicons name="eye" size={24} color={Colors[theme].mainBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDocument('resume')}
                    style={styles.actionIcon}
                    disabled={resume.uploading}
                  >
                    <Ionicons name="trash" size={24} color="#ff0000" />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          ) : resume && resume.uploading ? (
            <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
              <Card.Content style={styles.documentContent}>
                <ActivityIndicator size="small" color={Colors[theme].mainBlue} />
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, {color: Colors[theme].text}]}>{resume.name}</Text>
                  <Text style={[styles.uploadingText, {color: Colors[theme].textSecondary}]}>
                    Uploading...
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <TouchableOpacity
              style={[styles.emptyDocumentBox, { borderColor: Colors[theme].silver }]}
              onPress={() => handleDocumentPicker('resume')}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={[styles.emptyDocumentText, {color: Colors[theme].textSecondary}]}>
                tap to add resume
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Portfolio Section */}
        <View style={styles.section}>
          <View style={styles.titleRow}>
            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Portfolio</Text>
            <Text style={[styles.optionalText, {color: Colors[theme].textSecondary}]}>
              (optional)
            </Text>
          </View>

          {portfolio && !portfolio.uploading ? (
            <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
              <Card.Content style={styles.documentContent}>
                <IconButton 
                  icon="briefcase" 
                  size={32} 
                  iconColor={Colors[theme].mainBlue} 
                />
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, {color: Colors[theme].text}]}>{portfolio.name}</Text>
                  <Text style={[styles.documentStatus, {color: Colors[theme].textSecondary}]}>
                    ✓ Uploaded
                  </Text>
                  {portfolio.uploading && (
                    <View style={styles.uploadingIndicator}>
                      <ActivityIndicator size="small" color={Colors[theme].mainBlue} />
                      <Text style={[styles.uploadingText, {color: Colors[theme].textSecondary}]}>
                        Uploading...
                      </Text>
                    </View>
                  )}
                </View>
                <View style={styles.documentActions}>
                  <TouchableOpacity
                    onPress={() => handleViewDocument(portfolio)}
                    style={styles.actionIcon}
                    disabled={portfolio.uploading}
                  >
                    <Ionicons name="eye" size={24} color={Colors[theme].mainBlue} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDeleteDocument('portfolio')}
                    style={styles.actionIcon}
                    disabled={portfolio.uploading}
                  >
                    <Ionicons name="trash" size={24} color="#ff0000" />
                  </TouchableOpacity>
                </View>
              </Card.Content>
            </Card>
          ) : portfolio && portfolio.uploading ? (
            <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
              <Card.Content style={styles.documentContent}>
                <ActivityIndicator size="small" color={Colors[theme].mainBlue} />
                <View style={styles.documentInfo}>
                  <Text style={[styles.documentName, {color: Colors[theme].text}]}>{portfolio.name}</Text>
                  <Text style={[styles.uploadingText, {color: Colors[theme].textSecondary}]}>
                    Uploading...
                  </Text>
                </View>
              </Card.Content>
            </Card>
          ) : (
            <TouchableOpacity
              style={[styles.emptyDocumentBox, { borderColor: Colors[theme].silver }]}
              onPress={() => handleDocumentPicker('portfolio')}
              disabled={uploading}
              activeOpacity={0.7}
            >
              <Text style={[styles.emptyDocumentText, {color: Colors[theme].textSecondary}]}>
                tap to add portfolio
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Portfolio;

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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'EBGaramond_700Bold',
  },
  optionalText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  documentCard: {
    borderRadius: 12,
    borderWidth: 1,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  documentContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  documentName: {
    fontSize: 16,
    fontFamily: 'EBGaramond_600SemiBold',
    marginBottom: 4,
  },
  documentStatus: {
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
  },
  uploadingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  uploadingText: {
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
  },
  emptyDocumentBox: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  emptyDocumentText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    textAlign: 'center',
  },
});

