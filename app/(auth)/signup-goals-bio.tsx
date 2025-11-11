import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const MAX_GOALS_WORDS = 300;
const MAX_BIO_WORDS = 500;

const SignupGoalsBio: React.FC = () => {
  const [goals, setGoals] = useState('');
  const [bio, setBio] = useState('');
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter((word) => word.length > 0).length;
  };

  const goalsWordCount = countWords(goals);
  const bioWordCount = countWords(bio);
  const goalsOverLimit = goalsWordCount > MAX_GOALS_WORDS;
  const bioOverLimit = bioWordCount > MAX_BIO_WORDS;

  const handleFinish = () => {
    if (goalsOverLimit || bioOverLimit) {
      alert('Please ensure your text is within the word limits.');
      return;
    }
    // TODO: Save goals and bio, then complete signup
    console.log('Goals:', goals);
    console.log('Bio:', bio);
    // Navigate to main app
    router.replace('/(tabs)/ProfileQueue');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>Goals & Bio</Text>
          <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
            Tell us about your goals and yourself
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: Colors[theme].text }]}>Goals</Text>
            <Text
              style={[
                styles.wordCount,
                { color: goalsOverLimit ? '#ff0000' : Colors[theme].textSecondary },
              ]}
            >
              {goalsWordCount} / {MAX_GOALS_WORDS} words
            </Text>
          </View>
          <TextInput
            value={goals}
            onChangeText={setGoals}
            placeholder="Describe your goals and what you're looking for..."
            placeholderTextColor={Colors[theme].textSecondary}
            style={[
              styles.textArea,
              {
                color: Colors[theme].text,
                borderColor: goalsOverLimit ? '#ff0000' : Colors[theme].silver,
                backgroundColor: Colors[theme].background,
              },
            ]}
            multiline
            numberOfLines={8}
            textAlignVertical="top"
          />
          {goalsOverLimit && (
            <Text style={styles.errorText}>
              Goals must be {MAX_GOALS_WORDS} words or less
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.labelContainer}>
            <Text style={[styles.label, { color: Colors[theme].text }]}>Bio</Text>
            <Text
              style={[
                styles.wordCount,
                { color: bioOverLimit ? '#ff0000' : Colors[theme].textSecondary },
              ]}
            >
              {bioWordCount} / {MAX_BIO_WORDS} words
            </Text>
          </View>
          <TextInput
            value={bio}
            onChangeText={setBio}
            placeholder="Tell us about yourself, your experience, and what makes you unique..."
            placeholderTextColor={Colors[theme].textSecondary}
            style={[
              styles.textArea,
              {
                color: Colors[theme].text,
                borderColor: bioOverLimit ? '#ff0000' : Colors[theme].silver,
                backgroundColor: Colors[theme].background,
              },
            ]}
            multiline
            numberOfLines={10}
            textAlignVertical="top"
          />
          {bioOverLimit && (
            <Text style={styles.errorText}>Bio must be {MAX_BIO_WORDS} words or less</Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            (goalsOverLimit || bioOverLimit) && styles.buttonDisabled,
          ]}
          onPress={handleFinish}
          disabled={goalsOverLimit || bioOverLimit}
        >
          <Text style={styles.buttonText}>Complete Profile</Text>
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
    marginBottom: 30,
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
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
    minHeight: 120,
    maxHeight: 200,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    fontFamily: 'EBGaramond_400Regular',
    marginTop: 4,
  },
  button: {
    backgroundColor: Colors.light.mainBlue,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: Colors.light.silver,
    opacity: 0.5,
  },
  buttonText: {
    color: Colors.light.white,
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
  },
});

export default SignupGoalsBio;
