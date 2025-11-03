import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient'; // ensure 'expo-linear-gradient' is installed

const Premium: React.FC = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
    <LinearGradient
      colors={['#0f1154', '#f2ebc4']} // Main blue to cream gradient
      style={styles.gradientContainer}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Go Premium</Text>
        <Text style={styles.subtitle}>Unlock all the benefits and elevate your experience</Text>

        {/* Benefits Card */}
        <View style={styles.benefitsCard}>
          <Text style={styles.cardTitle}>Why Go Premium?</Text>
          <Text style={styles.benefitItem}>• Unlimited Access to Profiles</Text>
          <Text style={styles.benefitItem}>• Exclusive Creative Content</Text>
          <Text style={styles.benefitItem}>• Priority Support</Text>
          <Text style={styles.benefitItem}>• Early Access to New Features</Text>
        </View>

        <TouchableOpacity style={styles.ctaButton}>
          <Text style={styles.ctaButtonText}>Upgrade Now</Text>
        </TouchableOpacity>

        <Text style={styles.footerNote}>
          Cancel anytime. No hidden fees.
        </Text>
      </View>
    </LinearGradient>
    </SafeAreaView>
  );
};

export default Premium;

interface Styles {
  gradientContainer: ViewStyle;
  container: ViewStyle;
  title: TextStyle;
  subtitle: TextStyle;
  benefitsCard: ViewStyle;
  cardTitle: TextStyle;
  benefitItem: TextStyle;
  ctaButton: ViewStyle;
  ctaButtonText: TextStyle;
  footerNote: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  safeArea: {
    flex: 1,
  },
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 36,
    fontFamily: 'EBGaramond_700Bold',
    color: '#fff',
    marginBottom: 10,
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'EBGaramond_400Regular',
    color: '#f3e5f5',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 24,
  },
  benefitsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
  },
  cardTitle: {
    fontSize: 22,
    fontFamily: 'EBGaramond_700Bold',
    marginBottom: 15,
    color: '#0f1154',
  },
  benefitItem: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    color: '#444',
    marginBottom: 5,
  },
  ctaButton: {
    backgroundColor: '#0f1154',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  ctaButtonText: {
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
    color: '#fff',
    textAlign: 'center',
  },
  footerNote: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    color: '#f3e5f5',
    textAlign: 'center',
    opacity: 0.9,
  },
});
