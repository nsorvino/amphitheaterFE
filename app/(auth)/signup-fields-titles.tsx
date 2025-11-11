import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const FIELDS = ['Film', 'T.V.', 'Video', 'Music'];
const TITLES_BY_FIELD: Record<string, string[]> = {
  Film: ['Director', 'Producer', 'Cinematographer', 'Editor', 'Actor', 'Actress'],
  'T.V.': ['Showrunner', 'Producer', 'Director', 'Writer', 'Actor', 'Actress'],
  Video: ['Director', 'Producer', 'Editor', 'Videographer', 'Colorist'],
  Music: ['Producer', 'Engineer', 'Artist', 'Composer', 'Musician', 'Songwriter'],
};

const SignupFieldsTitles: React.FC = () => {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  const [selectedTitles, setSelectedTitles] = useState<string[]>([]);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const theme = (colorScheme ?? 'light') as 'light' | 'dark';

  const toggleField = (field: string) => {
    setSelectedFields((prev) => {
      if (prev.includes(field)) {
        // Remove field and its titles
        const newTitles = prev
          .filter((f) => f !== field)
          .flatMap((f) => TITLES_BY_FIELD[f] || [])
          .filter((title) => selectedTitles.includes(title));
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
    return selectedFields.flatMap((field) => TITLES_BY_FIELD[field] || []);
  };

  const handleContinue = () => {
    if (selectedFields.length === 0) {
      alert('Please select at least one field.');
      return;
    }
    // TODO: Save fields and titles
    console.log('Fields:', selectedFields);
    console.log('Titles:', selectedTitles);
    router.push('/(auth)/signup-documents');
  };

  const availableTitles = getAvailableTitles();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: Colors[theme].background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backText, { color: Colors[theme].mainBlue }]}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={[styles.title, { color: Colors[theme].text }]}>Your Field & Titles</Text>
          <Text style={[styles.subtitle, { color: Colors[theme].textSecondary }]}>
            Select the fields you work in and your professional titles
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Fields</Text>
          <View style={styles.fieldContainer}>
            {FIELDS.map((field) => {
              const isSelected = selectedFields.includes(field);
              return (
                <TouchableOpacity
                  key={field}
                  style={[
                    styles.fieldButton,
                    {
                      backgroundColor: isSelected
                        ? Colors[theme].mainBlue
                        : Colors[theme].cream,
                      borderColor: isSelected
                        ? Colors[theme].mainBlue
                        : Colors[theme].silver,
                    },
                  ]}
                  onPress={() => toggleField(field)}
                >
                  <Text
                    style={[
                      styles.fieldText,
                      { color: isSelected ? Colors.light.white : Colors[theme].text },
                    ]}
                  >
                    {field}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {selectedFields.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: Colors[theme].text }]}>Titles</Text>
            <Text style={[styles.sectionSubtitle, { color: Colors[theme].textSecondary }]}>
              Select your professional titles (you can choose multiple)
            </Text>
            <View style={styles.titleContainer}>
              {availableTitles.map((title) => {
                const isSelected = selectedTitles.includes(title);
                return (
                  <TouchableOpacity
                    key={title}
                    style={[
                      styles.titleButton,
                      {
                        backgroundColor: isSelected
                          ? Colors[theme].mainBlue
                          : Colors[theme].cream,
                        borderColor: isSelected
                          ? Colors[theme].mainBlue
                          : Colors[theme].silver,
                      },
                    ]}
                    onPress={() => toggleTitle(title)}
                  >
                    <Text
                      style={[
                        styles.titleText,
                        { color: isSelected ? Colors.light.white : Colors[theme].text },
                      ]}
                    >
                      {title}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
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
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'EBGaramond_600SemiBold',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    marginBottom: 15,
  },
  fieldContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  fieldButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 2,
    marginBottom: 10,
  },
  fieldText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_500Medium',
  },
  titleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  titleButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 10,
  },
  titleText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_500Medium',
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

export default SignupFieldsTitles;
