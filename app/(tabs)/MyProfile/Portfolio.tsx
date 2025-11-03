import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const Portfolio: React.FC = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].background, paddingBottom: tabBarHeight + 20 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconButton 
                        icon="arrow-left" 
                        size={24} 
                        iconColor={Colors[colorScheme ?? "light"].text}
                    />
                </TouchableOpacity>
                <Text style={[styles.title, {color: Colors[colorScheme ?? "light"].text}]}>Portfolio</Text>
                <View style={{width: 40}} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, {color: Colors[colorScheme ?? "light"].text}]}>Your Portfolio</Text>
                <Text style={[styles.description, {color: Colors[colorScheme ?? "light"].textSecondary}]}>
                    Showcase your creative work and projects here.
                </Text>
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
    container: {
        flex: 1,
        paddingTop: 20,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontFamily: 'EBGaramond_700Bold',
    },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontFamily: 'EBGaramond_600SemiBold',
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        fontFamily: 'EBGaramond_400Regular',
        lineHeight: 20,
    },
});

