import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Dimensions, Image } from 'react-native';
import { Avatar, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const SCREEN_WIDTH = Dimensions.get('window').width;

const MyProfile: React.FC = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
        <ScrollView 
          contentContainerStyle={[styles.container, { backgroundColor: Colors[colorScheme ?? "light"].background, paddingBottom: tabBarHeight + 20 }]}
        >
            {/* Avatar Section */}
            <View style={styles.avatarSection}>
                <View style={styles.imageContainer}>
                    <Image 
                        source={{ uri: 'https://i.pravatar.cc/300?img=12' }} 
                        style={styles.largeAvatar}
                        resizeMode="cover"
                    />
                </View>
                <View style={styles.textSection}>
                    <Text style={[styles.name, {color: Colors[colorScheme ?? "light"].text} ]}>Sally Davidson</Text>
                    <Text style={[styles.info, {color: Colors[colorScheme ?? "light"].textSecondary}]}>24</Text>
                    <Text style={[styles.info, {color: Colors[colorScheme ?? "light"].textSecondary}]}>Creative</Text>
                </View>
            </View>

            {/* Semi-circle Button Layout */}
            <View style={styles.buttonContainer}>
                {/* Button 1 - Left */}
                <View style={[styles.buttonWrapper, styles.buttonPosition1]}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/MyProfile/Preferences')}
                        style={[styles.iconButton, {backgroundColor: Colors[colorScheme ?? "light"].silver}]}
                    >
                        <IconButton 
                            icon="cog" 
                            size={24} 
                            iconColor={Colors[colorScheme ?? "light"].mainBlue}
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                        <Text style={[styles.label, {color: Colors[colorScheme ?? "light"].mainBlue}]}>Settings</Text>
                </View>

                {/* Button 2 - Top Left */}
                <View style={[styles.buttonWrapper, styles.buttonPosition2]}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/MyProfile/EditPhotos')}
                        style={[styles.iconButton, {backgroundColor: Colors[colorScheme ?? "light"].silver}]}
                    >
                        <IconButton 
                            icon="image" 
                            size={24} 
                            iconColor={Colors[colorScheme ?? "light"].mainBlue} 
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.label, {color: Colors[colorScheme ?? "light"].mainBlue}]}>Edit Photos</Text>
                </View>

                {/* Button 3 - Top Right */}
                <View style={[styles.buttonWrapper, styles.buttonPosition3]}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/MyProfile/EditInfo')}
                        style={[styles.iconButton, {backgroundColor: Colors[colorScheme ?? "light"].silver}]}
                    >
                        <IconButton 
                            icon="pencil" 
                            size={24} 
                            iconColor={Colors[colorScheme ?? "light"].mainBlue} 
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.label, {color: Colors[colorScheme ?? "light"].mainBlue}]}>Edit Info</Text>
                </View>

                {/* Button 4 - Right */}
                <View style={[styles.buttonWrapper, styles.buttonPosition4]}>
                    <TouchableOpacity
                        onPress={() => router.push('/(tabs)/MyProfile/Portfolio')}
                        style={[styles.iconButton, {backgroundColor: Colors[colorScheme ?? "light"].silver}]}
                    >
                        <IconButton 
                            icon="briefcase" 
                            size={24} 
                            iconColor={Colors[colorScheme ?? "light"].mainBlue} 
                            style={styles.iconStyle}
                        />
                    </TouchableOpacity>
                    <Text style={[styles.label, {color: Colors[colorScheme ?? "light"].mainBlue}]}>Portfolio</Text>
                </View>
            </View>
        </ScrollView>
        </SafeAreaView>
    );
};

export default MyProfile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: '100%',
    },
    container: {
        width: '100%',
        minHeight: '100%',
        alignItems: 'center',
        paddingTop: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
        paddingTop: 20,
    },
    imageContainer: {
        width: SCREEN_WIDTH * 0.5,
        height: SCREEN_WIDTH * 0.5,
        marginBottom: 10,
        borderRadius: SCREEN_WIDTH * 0.25,
        overflow: 'hidden',
        borderWidth: 4,
        borderColor: Colors.light.mainBlue,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    largeAvatar: {
        width: '100%',
        height: '100%',
        borderRadius: SCREEN_WIDTH * 0.25,
        overflow: 'hidden',
        backgroundColor: '#BDBDBD',
    },
    textSection: {
        paddingVertical: 5,
        alignItems: 'center',
        marginTop: 5,
        marginBottom: 0,
    },
    name: {
        fontSize: 24,
        textAlign: 'center',
        fontFamily: 'EBGaramond_700Bold',
        marginBottom: 8,
    },
    info: {
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'EBGaramond_400Regular',
        marginBottom: 4,
    },
    buttonContainer: {
        width: SCREEN_WIDTH,
        height: SCREEN_WIDTH * 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 0,
        marginBottom: 20,
        position: 'relative',
    },
    buttonWrapper: {
        alignItems: 'center',
        position: 'absolute',
        width: 80,
    },
    buttonPosition1: {
        // Left side - top of flipped semi-circle
        left: SCREEN_WIDTH * 0.12,
        top: 10,
    },
    buttonPosition2: {
        // Bottom left - tighter spacing
        left: SCREEN_WIDTH * 0.28,
        top: 60,
    },
    buttonPosition3: {
        // Bottom right - tighter spacing
        right: SCREEN_WIDTH * 0.28,
        top: 60,
    },
    buttonPosition4: {
        // Right side - top of flipped semi-circle
        right: SCREEN_WIDTH * 0.12,
        top: 10,
    },
    iconButton: {
        borderRadius: 50,
        width: 55,
        height: 55,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
    },
    iconStyle: {
        // Center icon
    },
    label: {
        marginTop: 6,
        fontSize: 12,
        fontFamily: 'EBGaramond_500Medium',
        textAlign: 'center',
    },
});

