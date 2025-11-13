import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { api } from '@/lib/api';

const Preferences: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = (colorScheme ?? "light") as "light" | "dark";
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();
    const [loggingOut, setLoggingOut] = useState(false);

    const handleLogout = async () => {
        if (loggingOut) return;

        try {
            setLoggingOut(true);
            await api.logout();
        } catch (error) {
            console.error('Logout failed', error);
            Alert.alert('Logout', 'Unable to contact server. Ending session locally.');
        } finally {
            setLoggingOut(false);
            router.replace('/(auth)/login');
        }
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}>
        <ScrollView contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].background, paddingBottom: tabBarHeight + 20 }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <IconButton 
                        icon="arrow-left" 
                        size={24} 
                        iconColor={Colors[theme].text}
                    />
                </TouchableOpacity>
                <Text style={[styles.title, {color: Colors[theme].text}]}>Preferences</Text>
                <View style={{width: 40}} />
            </View>

            <View style={styles.content}>
                <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Settings</Text>
                <Text style={[styles.description, {color: Colors[theme].textSecondary}]}>
                    Your preferences and settings will appear here.
                </Text>

                <View style={styles.divider} />

                <TouchableOpacity
                    onPress={handleLogout}
                    style={[styles.logoutButton, { backgroundColor: Colors[theme].mainBlue }]}
                    activeOpacity={0.85}
                    disabled={loggingOut}
                >
                    {loggingOut ? (
                        <ActivityIndicator color={Colors.light.white} />
                    ) : (
                        <Text style={styles.logoutText}>Log Out</Text>
                    )}
                </TouchableOpacity>
                <Text style={[styles.logoutHint, { color: Colors[theme].textSecondary }]}>
                    Logging out will return you to the sign-in screen.
                </Text>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default Preferences;

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
    divider: {
        height: 1,
        backgroundColor: 'rgba(0,0,0,0.08)',
        marginVertical: 24,
    },
    logoutButton: {
        width: '100%',
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoutText: {
        fontSize: 18,
        fontFamily: 'EBGaramond_600SemiBold',
        color: Colors.light.white,
        
    },
    logoutHint: {
        marginTop: 12,
        fontSize: 13,
        fontFamily: 'EBGaramond_400Regular',
        textAlign: 'center',
    },
});

