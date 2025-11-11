import React, { useState } from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity, SafeAreaView, Dimensions, Image, Modal, StatusBar } from 'react-native';
import { IconButton, Card } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const SCREEN_WIDTH = Dimensions.get('window').width;

// Mock user data - this will eventually come from your backend/state management
const MOCK_USER: {
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  profilePicture: string;
  fields: string[];
  titles: string[];
  goals: string;
  bio: string;
  resume: { name: string; uri: string | null } | null;
  portfolio: { name: string; uri: string | null } | null;
  headshots: Array<{ uri: string }>;
} = {
  firstName: 'Sally',
  lastName: 'Davidson',
  dateOfBirth: new Date('2000-05-15'), // Used to calculate age
  profilePicture: 'https://i.pravatar.cc/300?img=12',
  fields: ['Film', 'T.V.'],
  titles: ['Director', 'Producer', 'Actor'],
  goals: 'My goal is to create compelling narratives that resonate with audiences. I aim to collaborate with talented creators and bring stories to life that inspire and entertain. I\'m looking for opportunities to work on projects that challenge me and allow me to grow as a creative professional.',
  bio: 'I\'m a passionate filmmaker with over 5 years of experience in the industry. I\'ve worked on various projects ranging from indie films to commercial productions. My expertise lies in storytelling, visual composition, and directing actors. I believe in the power of collaboration and always strive to create meaningful connections with my team and audience.',
  resume: null,
  portfolio: null,
  headshots: [
    { uri: 'https://picsum.photos/seed/headshot1/400/500' },
    { uri: 'https://picsum.photos/seed/headshot2/400/500' },
  ],
};

const MyProfile: React.FC = () => {
    const colorScheme = useColorScheme();
    const router = useRouter();
    const tabBarHeight = useBottomTabBarHeight();
    const insets = useSafeAreaInsets();
    const theme = (colorScheme ?? "light") as "light" | "dark";
    const [selectedHeadshot, setSelectedHeadshot] = useState<string | null>(null);

    // Calculate age from date of birth
    const calculateAge = (dob: Date): number => {
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    };

    const age = calculateAge(MOCK_USER.dateOfBirth);

    const handleSettingsPress = () => {
        router.push('/(tabs)/MyProfile/Preferences');
    };

    return (
        <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[theme].background }]}>
            {/* Top Bar with Settings */}
            <View style={[styles.headerBar, { top: insets.top, backgroundColor: Colors[theme].background, borderBottomColor: 'rgba(0,0,0,0.1)' }]}>
                <View style={styles.headerLeft} />
                <View style={styles.headerCenter}>
                    <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>My Profile</Text>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity onPress={handleSettingsPress}>
                        <Ionicons name="settings-outline" size={24} color={Colors[theme].text} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView 
                contentContainerStyle={[styles.container, { backgroundColor: Colors[theme].background, paddingTop: insets.top + 45, paddingBottom: tabBarHeight + 20 }]}
                showsVerticalScrollIndicator={false}
            >
                               {/* Header with Avatar and Basic Info - Clickable */}
               <TouchableOpacity
                   style={styles.avatarSection}
                   onPress={() => router.push('/(tabs)/MyProfile/EditProfileInfo')}
                   activeOpacity={0.7}
               >
                    <View style={{ position: 'relative', alignItems: 'center', justifyContent: 'center' }}>
                        <View style={[styles.imageContainer, { borderColor: Colors[theme].mainBlue }]}>
                            <Image 
                                source={{ uri: MOCK_USER.profilePicture }} 
                                style={styles.largeAvatar}
                                resizeMode="cover"
                            />
                        </View>
                        <View style={[styles.editBadge, { backgroundColor: Colors[theme].mainBlue }]}>
                            <Ionicons name="pencil" size={14} color={Colors.light.white} />
                        </View>
                    </View>
                    <View style={styles.textSection}>
                        <Text style={[styles.name, {color: Colors[theme].text}]}>
                            {MOCK_USER.firstName} {MOCK_USER.lastName}
                        </Text>
                        <Text style={[styles.info, {color: Colors[theme].textSecondary}]}>{age} years old</Text>
                    </View>
                </TouchableOpacity>

               {/* Fields & Titles Section - Clickable */}
               <TouchableOpacity
                   style={styles.section}
                   onPress={() => router.push('/(tabs)/MyProfile/EditFieldsTitles')}
                   activeOpacity={0.7}
               >
                    <View style={styles.sectionHeader}>
                        <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Fields & Titles</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors[theme].textSecondary} />
                    </View>
                    <View style={styles.tagsContainer}>
                        {MOCK_USER.fields.map((field, index) => (
                            <View 
                                key={`field-${index}`} 
                                style={[styles.tag, { backgroundColor: Colors[theme].cream, borderColor: Colors[theme].mainBlue, borderWidth: 1 }]}
                            >
                                <Text style={[styles.tagText, { color: Colors[theme].mainBlue }]}>{field}</Text>
                            </View>
                        ))}
                        {MOCK_USER.titles.map((title, index) => (
                            <View 
                                key={`title-${index}`} 
                                style={[styles.tag, { backgroundColor: Colors[theme].mainBlue }]}
                            >
                                <Text style={[styles.tagText, { color: Colors.light.white }]}>{title}</Text>
                            </View>
                        ))}
                    </View>
                </TouchableOpacity>

               {/* Goals Section - Clickable */}
               <View style={styles.section}>
                    <TouchableOpacity 
                        style={styles.sectionHeader}
                        onPress={() => router.push('/(tabs)/MyProfile/EditGoals')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Goals</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors[theme].textSecondary} />
                    </TouchableOpacity>
                    <Card style={[styles.card, { backgroundColor: Colors[theme].cream }]}>
                        <Card.Content>
                            <Text style={[styles.textContent, {color: Colors[theme].text}]} numberOfLines={3}>
                                {MOCK_USER.goals}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

               {/* Bio Section - Clickable */}
               <View style={styles.section}>
                    <TouchableOpacity 
                        style={styles.sectionHeader}
                        onPress={() => router.push('/(tabs)/MyProfile/EditBio')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Bio</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors[theme].textSecondary} />
                    </TouchableOpacity>
                    <Card style={[styles.card, { backgroundColor: Colors[theme].cream }]}>
                        <Card.Content>
                            <Text style={[styles.textContent, {color: Colors[theme].text}]} numberOfLines={3}>
                                {MOCK_USER.bio}
                            </Text>
                        </Card.Content>
                    </Card>
                </View>

                {/* Documents Section - Clickable */}
                <View style={styles.section}>
                    <TouchableOpacity 
                        style={styles.sectionHeader}
                        onPress={() => router.push('/(tabs)/MyProfile/Portfolio')}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Documents</Text>
                        <Ionicons name="chevron-forward" size={20} color={Colors[theme].textSecondary} />
                    </TouchableOpacity>
                    
                    {MOCK_USER.resume || MOCK_USER.portfolio ? (
                        <>
                            {MOCK_USER.resume && (
                                <TouchableOpacity
                                    onPress={() => {
                                        // TODO: View resume - open PDF viewer or navigate to view screen
                                        console.log('View resume:', MOCK_USER.resume?.name);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
                                        <Card.Content style={styles.documentContent}>
                                            <IconButton icon="file-document" size={24} iconColor={Colors[theme].mainBlue} />
                                            <View style={styles.documentInfo}>
                                                <Text style={[styles.documentName, {color: Colors[theme].text}]}>Resume</Text>
                                                <Text style={[styles.documentSubtext, {color: Colors[theme].textSecondary}]}>
                                                    {MOCK_USER.resume?.name || 'Resume'}
                                                </Text>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            )}
                            {MOCK_USER.portfolio && (
                                <TouchableOpacity
                                    onPress={() => {
                                        // TODO: View portfolio - open PDF viewer or navigate to view screen
                                        console.log('View portfolio:', MOCK_USER.portfolio?.name);
                                    }}
                                    activeOpacity={0.7}
                                >
                                    <Card style={[styles.documentCard, { backgroundColor: Colors[theme].background, borderColor: Colors[theme].silver }]}>
                                        <Card.Content style={styles.documentContent}>
                                            <IconButton icon="briefcase" size={24} iconColor={Colors[theme].mainBlue} />
                                            <View style={styles.documentInfo}>
                                                <Text style={[styles.documentName, {color: Colors[theme].text}]}>Portfolio</Text>
                                                <Text style={[styles.documentSubtext, {color: Colors[theme].textSecondary}]}>
                                                    {MOCK_USER.portfolio?.name || 'Portfolio'}
                                                </Text>
                                            </View>
                                        </Card.Content>
                                    </Card>
                                </TouchableOpacity>
                            )}
                        </>
                    ) : (
                        <View style={[styles.emptyDocumentBox, { borderColor: Colors[theme].silver }]}>
                            <Text style={[styles.emptyDocumentText, {color: Colors[theme].textSecondary}]}>
                                no documents here...
                            </Text>
                        </View>
                    )}

                    {/* Headshots Section */}
                    <View>
                        <TouchableOpacity 
                            style={styles.headshotsHeader}
                            onPress={() => router.push('/(tabs)/MyProfile/EditPhotos')}
                            activeOpacity={0.7}
                        >
                            <Text style={[styles.sectionTitle, {color: Colors[theme].text}]}>Headshots</Text>
                            <Ionicons name="chevron-forward" size={20} color={Colors[theme].textSecondary} />
                        </TouchableOpacity>
                        {MOCK_USER.headshots && MOCK_USER.headshots.length > 0 ? (
                            <ScrollView 
                                horizontal 
                                showsHorizontalScrollIndicator={false}
                                style={styles.headshotsContainer}
                                contentContainerStyle={styles.headshotsContent}
                            >
                                {MOCK_USER.headshots.map((headshot, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => setSelectedHeadshot(headshot.uri)}
                                        activeOpacity={0.7}
                                    >
                                        <View style={[styles.headshotContainer, { borderColor: Colors[theme].silver }]}>
                                            <Image 
                                                source={{ uri: headshot.uri }} 
                                                style={styles.headshotImage}
                                                resizeMode="cover"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        ) : (
                            <View style={[styles.emptyHeadshotBox, { borderColor: Colors[theme].silver }]}>
                                <Text style={[styles.emptyHeadshotText, {color: Colors[theme].textSecondary}]}>
                                    no headshots here...
                                </Text>
                            </View>
                        )}
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

export default MyProfile;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        width: '100%',
    },
    headerBar: {
        width: '100%',
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 8,
        zIndex: 1000,
        position: 'absolute',
        left: 0,
        right: 0,
        borderBottomWidth: 1,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    headerTitle: {
        fontSize: 18,
        fontFamily: 'EBGaramond_700Bold',
    },
    container: {
        width: '100%',
        minHeight: '100%',
        paddingHorizontal: 20,
    },
    avatarSection: {
        alignItems: 'center',
        marginVertical: 20,
        width: '100%',
    },
    imageContainer: {
        width: SCREEN_WIDTH * 0.4,
        height: SCREEN_WIDTH * 0.4,
        marginBottom: 15,
        borderRadius: SCREEN_WIDTH * 0.2,
        overflow: 'hidden',
        borderWidth: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 8,
    },
    largeAvatar: {
        width: '100%',
        height: '100%',
        backgroundColor: '#BDBDBD',
    },
    editBadge: {
        position: 'absolute',
        bottom: -5,
        right: -5,
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: Colors.light.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    textSection: {
        paddingVertical: 5,
        alignItems: 'center',
        marginTop: 5,
    },
    name: {
        fontSize: 28,
        textAlign: 'center',
        fontFamily: 'EBGaramond_700Bold',
        marginBottom: 8,
    },
    info: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: 'EBGaramond_400Regular',
        marginBottom: 4,
    },
    section: {
        marginBottom: 30,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 22,
        fontFamily: 'EBGaramond_700Bold',
    },
    subsectionTitle: {
        fontSize: 16,
        fontFamily: 'EBGaramond_600SemiBold',
        marginBottom: 10,
        marginTop: 10,
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
    card: {
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    textContent: {
        fontSize: 16,
        fontFamily: 'EBGaramond_400Regular',
        lineHeight: 24,
    },
    documentCard: {
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 12,
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    documentContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
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
    documentSubtext: {
        fontSize: 14,
        fontFamily: 'EBGaramond_400Regular',
    },
    headshotsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    headshotsContainer: {
        marginTop: 0,
    },
    headshotsContent: {
        paddingRight: 20,
    },
    headshotContainer: {
        width: 120,
        height: 150,
        borderRadius: 12,
        overflow: 'hidden',
        marginRight: 12,
        borderWidth: 2,
    },
    headshotImage: {
        width: '100%',
        height: '100%',
    },
    emptyDocumentBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 120,
        marginBottom: 12,
    },
    emptyDocumentText: {
        fontSize: 16,
        fontFamily: 'EBGaramond_400Regular',
        textAlign: 'center',
    },
    emptyHeadshotBox: {
        borderWidth: 2,
        borderStyle: 'dashed',
        borderRadius: 12,
        padding: 60,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 150,
        marginBottom: 12,
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
        right: 20,
        zIndex: 1000,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
});

