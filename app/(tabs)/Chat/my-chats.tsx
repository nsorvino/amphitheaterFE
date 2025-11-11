import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  SafeAreaView,
  Image,
} from "react-native";
import { Avatar, Text, TextInput, Card } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";

import { LinearGradient } from 'expo-linear-gradient'; // Import gradient

interface Message {
  text: string;
  sentByMe?: boolean;
}

interface ProfileData {
  name: string;
  tags: string[];
  titles: string[];
  lastMessage?: string;
  unread?: boolean;
  messages: Message[];
  profilePicture?: string;
}

const profiles: ProfileData[] = [
  {
    name: "Mike Smith",
    tags: ["Film"],
    titles: ["Director", "Filmmaker"],
    lastMessage: "Hey, can you call me at 201-621-3815 at 9:00 tomorrow evening?",
    profilePicture: "https://i.pravatar.cc/150?img=1",
    messages: [
      { text: "Hi" },
      { text: "Hey, can you call me at 201-621-3815 at 9:00 tomorrow evening?", sentByMe: true },
      { text: "No problem!" },
    ],
  },
  {
    name: "Sarah Johnson",
    tags: ["Music"],
    titles: ["Producer", "Composer"],
    lastMessage: "Thanks for the feedback on my latest track!",
    profilePicture: "https://i.pravatar.cc/150?img=5",
    messages: [
      { text: "Hi Sarah! I listened to your track" },
      { text: "Thanks for the feedback on my latest track!", sentByMe: true },
    ],
  },
  {
    name: "Alex Chen",
    tags: ["T.V.", "Video"],
    titles: ["Editor", "Director"],
    lastMessage: "The footage looks great, when can we schedule the next shoot?",
    profilePicture: "https://i.pravatar.cc/150?img=12",
    messages: [
      { text: "Hey! The footage looks great, when can we schedule the next shoot?", sentByMe: true },
      { text: "How about next Friday?" },
    ],
  },
  {
    name: "Emma Wilson",
    tags: ["Film"],
    titles: ["Cinematographer", "Director"],
    lastMessage: "Can't wait to work with you on this project!",
    profilePicture: "https://i.pravatar.cc/150?img=9",
    messages: [
      { text: "Hi Emma! Excited about our upcoming project" },
      { text: "Can't wait to work with you on this project!", sentByMe: true },
    ],
  },
  {
    name: "David Martinez",
    tags: ["Music"],
    titles: ["Artist", "Songwriter"],
    lastMessage: "Let me know when you're available for a session",
    profilePicture: "https://i.pravatar.cc/150?img=11",
    messages: [
      { text: "Let me know when you're available for a session", sentByMe: true },
      { text: "I'm free this weekend!" },
    ],
  },
  {
    name: "Jessica Brown",
    tags: ["Film"],
    titles: ["Actor", "Producer"],
    profilePicture: "https://i.pravatar.cc/150?img=47",
    messages: [],
  },
  {
    name: "Michael Taylor",
    tags: ["Music"],
    titles: ["Producer", "Engineer"],
    profilePicture: "https://i.pravatar.cc/150?img=33",
    messages: [],
  },
  {
    name: "Sophie Anderson",
    tags: ["T.V."],
    titles: ["Writer", "Director"],
    profilePicture: "https://i.pravatar.cc/150?img=45",
    messages: [],
  },
  {
    name: "James Wilson",
    tags: ["Video"],
    titles: ["Editor", "Videographer"],
    profilePicture: "https://i.pravatar.cc/150?img=51",
    messages: [],
  },
  {
    name: "Olivia Parker",
    tags: ["Film"],
    titles: ["Cinematographer", "Director of Photography"],
    profilePicture: "https://i.pravatar.cc/150?img=20",
    messages: [],
  },
  {
    name: "Ryan Thompson",
    tags: ["Music"],
    titles: ["Sound Designer", "Mix Engineer"],
    profilePicture: "https://i.pravatar.cc/150?img=25",
    messages: [],
  },
  {
    name: "Amanda Lee",
    tags: ["T.V."],
    titles: ["Writer", "Showrunner"],
    profilePicture: "https://i.pravatar.cc/150?img=30",
    messages: [],
  },
  {
    name: "Daniel Kim",
    tags: ["Video"],
    titles: ["Motion Graphics Designer", "Editor"],
    profilePicture: "https://i.pravatar.cc/150?img=35",
    messages: [],
  },
  {
    name: "Rachel Green",
    tags: ["Film", "T.V."],
    titles: ["Producer", "Executive Producer"],
    profilePicture: "https://i.pravatar.cc/150?img=40",
    messages: [],
  },
  {
    name: "Chris Rodriguez",
    tags: ["Music"],
    titles: ["Musician", "Composer"],
    profilePicture: "https://i.pravatar.cc/150?img=15",
    messages: [],
  },
  {
    name: "Lauren Mitchell",
    tags: ["Film"],
    titles: ["Actor", "Director"],
    profilePicture: "https://i.pravatar.cc/150?img=50",
    messages: [],
  },
];

const MyChats: React.FC = () => {
  const [searchQ, setSearchQ] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [isFocused, setIsFocused] = useState(false);
  const theme = (colorScheme ?? "light") as "light" | "dark";

  const search = (q: string | null): ProfileData[] => {
    if (!q) return profiles;
    const query = q.toLowerCase();
    return profiles.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.titles.some((t) => t.toLowerCase().includes(query)) ||
        p.tags.some((t) => t.toLowerCase().includes(query))
    );
  };

  const profileDisplay = search(searchQ);
  const recentMatches = profileDisplay.filter((p) => !p.lastMessage);
  const chats = profileDisplay.filter((p) => p.lastMessage);

  const navigateToChat = (profile: ProfileData) => {
    router.push({
      pathname: "/(tabs)/Chat/active-chat",
      params: {
        user: JSON.stringify(profile),
      },
    });
  };

  return (
        <SafeAreaView
      style={{
        flex: 1,
        width: "100%",
        backgroundColor: Colors.light.white,
      }}
    >
      {/* Header Bar */}
      <View style={[styles.headerBar, { top: insets.top, backgroundColor: Colors.light.white, borderBottomColor: 'rgba(0,0,0,0.1)' }]}>
        <View style={styles.headerLeft} />
        <View style={styles.headerCenter}>
          <Text style={[styles.headerTitle, { color: Colors[theme].text }]}>My Chats</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView 
        style={{ flex: 1, backgroundColor: Colors.light.white }}
        contentContainerStyle={{ paddingBottom: tabBarHeight + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View style={[styles.searchContainer, { 
          backgroundColor: Colors.light.white, 
          paddingTop: Math.max(insets.top, 10) + 20 
        }]}>
          <TextInput
            placeholder="Search"
            placeholderTextColor={Colors[theme].textSecondary}
            mode="outlined"
            left={<TextInput.Icon icon="magnify" color={Colors[theme].textSecondary} />}
            style={[styles.searchInputText, { color: Colors[theme].text }]}
            contentStyle={{ fontFamily: 'EBGaramond_400Regular' }}
            outlineColor={Colors[theme].silver}
            activeOutlineColor={Colors[theme].mainBlue}
            textColor={Colors[theme].text}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            onChangeText={(value) => setSearchQ(value)}
          />
        </View>

        {/* Recent Connections */}
        {recentMatches.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: Colors[theme].mainBlue }]}>Recent Connections</Text>
            <View style={styles.recentConnectionsWrapper}>
              <ScrollView 
                horizontal 
                style={styles.horizontalScroll} 
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.horizontalScrollContent}
                contentInsetAdjustmentBehavior="never"
              >
                {recentMatches.map((profile) => (
                  <TouchableOpacity
                    key={profile.name}
                    style={styles.recentMatchContainer}
                    onPress={() => navigateToChat(profile)}
                    activeOpacity={0.7}
                  >
                    {profile.profilePicture ? (
                      <View style={[styles.profileCircle, { borderColor: Colors[theme].silver }]}>
                        <Image
                          source={{ uri: profile.profilePicture }}
                          style={styles.profileImage}
                          resizeMode="cover"
                        />
                      </View>
                    ) : (
                      <View style={[styles.profileCircle, { 
                        backgroundColor: Colors[theme].silver,
                        borderColor: Colors[theme].silver,
                      }]}>
                        <Text style={[styles.profileInitial, { color: Colors[theme].text }]}>
                          {profile.name.charAt(0)}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <LinearGradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                colors={[
                  'rgba(255,255,255,0)',
                  'rgba(255,255,255,0.3)',
                  'rgba(255,255,255,0.6)',
                  Colors[theme].background,
                  Colors[theme].background,
                ]}
                locations={[0, 0.5, 0.7, 0.85, 1]}
                style={styles.fadeGradient}
                pointerEvents="none"
              />
            </View>
          </>
        )}

        {/* Chats */}
        {chats.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: Colors[theme].mainBlue }]}>Chats</Text>
            {chats.map((profile) => (
              <TouchableOpacity
                key={profile.name}
                onPress={() => navigateToChat(profile)}
              >
                <Profile 
                  name={profile.name}
                  tags={profile.tags}
                  titles={profile.titles}
                  lastMessage={profile.lastMessage}
                  profilePicture={profile.profilePicture}
                />
              </TouchableOpacity>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

interface ProfileProps {
  name: string;
  tags: string[];
  titles: string[];
  lastMessage?: string;
  profilePicture?: string;
}

const Profile: React.FC<ProfileProps> = ({ name, tags, titles, lastMessage, profilePicture }) => {
  const colorScheme = useColorScheme();
  const theme = (colorScheme ?? "light") as "light" | "dark";
  const title = titles.join(", ");

  // Use the background color from the provided image
  const cardBackgroundColor = Colors[colorScheme ?? "light"].white; 
  
  return (
    <Card style={[styles.profileContainer, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {profilePicture ? (
          <View style={[styles.chatAvatarCircle, { borderColor: Colors[theme].silver }]}>
            <Image
              source={{ uri: profilePicture }}
              style={styles.chatAvatarImage}
              resizeMode="cover"
            />
          </View>
        ) : (
          <Avatar.Text 
            label={name.charAt(0)} 
            size={48} 
            style={{ backgroundColor: Colors[colorScheme ?? "light"].silver }} 
          />
        )}
        <View style={{ marginLeft: 10, flex: 1 }}>
          <Text style={styles.profileName}>{name}</Text>
          {/* Container with fade-out effect for lastMessage */}
          <View style={styles.lastMessageWrapper}>
            {lastMessage ? (
              <View style={styles.textFadeContainer}>
                <Text style={styles.lastMessageText} numberOfLines={1}>
                  {lastMessage}
                </Text>
                <LinearGradient
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  colors={['rgba(242,237,243,0)', cardBackgroundColor]} 
                  style={styles.fadeOverlay}
                />
              </View>
            ) : (
              <Text style={{ fontFamily: 'EBGaramond_400Regular', color: Colors[colorScheme ?? "light"].textSecondary }}>Tap to Chat</Text>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

export default MyChats;

const styles = StyleSheet.create({
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  searchInputWrapper: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchInputContainer: {
    backgroundColor: "#e6e6e6",
    borderRadius: 10,
    borderBottomWidth: 0,
    paddingHorizontal: 10,
    height: 40,
    justifyContent: "center",
  },
  searchInputText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'EBGaramond_600SemiBold',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  recentConnectionsWrapper: {
    position: 'relative',
    marginVertical: 10,
  },
  horizontalScroll: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
    marginVertical: 0,
  },
  horizontalScrollContent: {
    paddingRight: 15,
  },
  recentMatchContainer: {
    marginRight: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  profileCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: Colors.light.cream,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileInitial: {
    fontSize: 24,
    fontFamily: 'EBGaramond_700Bold',
    textAlign: 'center',
    lineHeight: 64,
  },
  chatAvatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
    backgroundColor: Colors.light.cream,
    marginRight: 10,
  },
  chatAvatarImage: {
    width: '100%',
    height: '100%',
  },
  recentMatchName: {
    marginTop: 5,
    fontSize: 14,
    fontFamily: 'EBGaramond_500Medium',
    color: Colors.light.text,
  },
  profileContainer: {
    marginHorizontal: 15,
    marginVertical: 5,
    padding: 10,
    backgroundColor: Colors.light.white,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'EBGaramond_700Bold',
    color: Colors.light.text,
  },
  profileTag: {
    color: Colors.light.silver,
    fontFamily: 'EBGaramond_400Regular',
  },
  profileTitle: {
    color: Colors.light.textSecondary,
    fontFamily: 'EBGaramond_400Regular',
  },
  lastMessageWrapper: {
    position: 'relative',
    marginTop: 2,
    maxWidth: '100%', // ensure the container doesn't exceed its parent's width
  },
  textFadeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
    overflow: 'hidden', // ensures the text will be clipped
  },
  lastMessageText: {
    fontSize: 14,
    fontFamily: 'EBGaramond_400Regular',
    color: Colors.light.silver,
    flexShrink: 1,
  },
  fadeOverlay: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 50, // adjust width as needed for the fade length
  },
  fadeGradient: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 40,
    pointerEvents: 'none',
  },
});
