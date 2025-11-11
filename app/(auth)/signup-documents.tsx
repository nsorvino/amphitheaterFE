import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import * as DocumentPicker from 'expo-document-picker';

const SignupDocuments: React.FC = () => {
  const [resume, setResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [portfolio, setPortfolio] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [headshots, setHeadshots] = useState<DocumentPicker.DocumentPickerAsset[]>([]);
  const [isActorModel, setIsActorModel] = useState(false);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const pickResume = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setResume(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick resume. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const pickPortfolio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setPortfolio(result.assets[0]);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick portfolio. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const pickHeadshots = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['image/*'],
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        setHeadshots(result.assets);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick headshots. Please try again.');
      console.error('Document picker error:', error);
    }
  };

  const handleContinue = () => {
    if (isActorModel && headshots.length === 0) {
      Alert.alert('Headshots Required', 'Headshots are required for actors and models.');
      return;
    }
    // TODO: Save documents
    console.log('Resume:', resume);
    console.log('Portfolio:', portfolio);
    console.log('Headshots:', headshots);
    router.push('/(auth)/signup-verification');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>Documents</Text>
          <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
            Upload your resume, portfolio, and headshots
          </Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              { borderColor: isActorModel ? Colors[theme].mainBlue : Colors[theme].silver },
            ]}
            onPress={() => setIsActorModel(!isActorModel)}
          >
            <View
              style={[
                styles.checkboxInner,
                {
                  backgroundColor: isActorModel ? Colors[theme].mainBlue : 'transparent',
                },
              ]}
            />
          </TouchableOpacity>
          <Text style={[styles.checkboxLabel, { color: Colors[theme].text }]}>
            I am an Actor or Model
          </Text>
        </View>

        <View style={styles.documentSection}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Resume</Text>
          <Text style={[styles.sectionSubtitle, { color: Colors[theme].textSecondary }]}>
            Optional but encouraged (PDF or DOC)
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickResume}>
            <Text style={[styles.uploadText, { color: Colors[theme].mainBlue }]}>
              {resume ? `✓ ${resume.name}` : '+ Upload Resume'}
            </Text>
          </TouchableOpacity>
          {resume && (
            <TouchableOpacity onPress={() => setResume(null)}>
              <Text style={[styles.removeText, { color: '#ff0000' }]}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.documentSection}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Portfolio</Text>
          <Text style={[styles.sectionSubtitle, { color: Colors[theme].textSecondary }]}>
            Optional but encouraged (PDF or DOC)
          </Text>
          <TouchableOpacity style={styles.uploadButton} onPress={pickPortfolio}>
            <Text style={[styles.uploadText, { color: Colors[theme].mainBlue }]}>
              {portfolio ? `✓ ${portfolio.name}` : '+ Upload Portfolio'}
            </Text>
          </TouchableOpacity>
          {portfolio && (
            <TouchableOpacity onPress={() => setPortfolio(null)}>
              <Text style={[styles.removeText, { color: '#ff0000' }]}>Remove</Text>
            </TouchableOpacity>
          )}
        </View>

        {isActorModel && (
          <View style={styles.documentSection}>
            <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Headshots</Text>
            <Text style={[styles.sectionSubtitle, { color: Colors[theme].textSecondary }]}>
              Required for actors/models (Images)
            </Text>
            <TouchableOpacity style={styles.uploadButton} onPress={pickHeadshots}>
              <Text style={[styles.uploadText, { color: Colors[theme].mainBlue }]}>
                + Upload Headshots ({headshots.length} selected)
              </Text>
            </TouchableOpacity>
            {headshots.length > 0 && (
              <TouchableOpacity onPress={() => setHeadshots([])}>
                <Text style={[styles.removeText, { color: '#ff0000' }]}>Remove All</Text>
              </TouchableOpacity>
            )}
          </View>
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
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderRadius: 4,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 16,
    height: 16,
    borderRadius: 2,
  },
  checkboxLabel: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  documentSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'EBGaramond_600SemiBold',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 12,
  },
  uploadButton: {
    backgroundColor: Colors.light.cream,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.silver,
    borderStyle: 'dashed',
  },
  uploadText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  removeText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_500Medium',
    marginTop: 8,
    textAlign: 'center',
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
});

export default SignupDocuments;
