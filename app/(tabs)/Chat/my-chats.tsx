import React, { useState } from "react";
import {
  ScrollView,
  View,
  StyleSheet,
  TextStyle,
  ViewStyle,
  SafeAreaView,
} from "react-native";
import { Avatar, Text, TextInput, Card } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { useRouter } from "expo-router";
import color from "color";

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
}

const profiles: ProfileData[] = [
  {
    name: "Mike Smith",
    tags: ["Film"],
    titles: ["Director", "Filmmaker"],
    lastMessage: "Hey, can you call me at 201-621-3815 at 9:00 tomorrow evening?",
    messages: [
      { text: "Hi" },
      { text: "Hey, can you call me at 201-621-3815 at 9:00 tomorrow evening?", sentByMe: true },
      { text: "No problem!" },
    ],
  },
];

const MyChats: React.FC = () => {
  const [searchQ, setSearchQ] = useState<string | null>(null);
  const colorScheme = useColorScheme();
  const router = useRouter();
  const tabBarHeight = useBottomTabBarHeight();
  const [isFocused, setIsFocused] = useState(false);

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
        width: "100%",
        backgroundColor: Colors[colorScheme ?? "light"].background,
        paddingBottom: tabBarHeight,
      }}
    >
      {/* Search Bar */}
      <View style={[styles.searchContainer, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
        <TextInput
          placeholder="Search"
          placeholderTextColor={Colors[colorScheme ?? "light"].silver}
          mode="outlined"
          left={<TextInput.Icon icon="magnify" color={Colors[colorScheme ?? "light"].silver} />}
          style={[styles.searchInputText, { color: Colors[colorScheme ?? "light"].text }]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onChangeText={(value) => setSearchQ(value)}
        />
      </View>

      {/* Recent Matches */}
      {recentMatches.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? "light"].mainBlue }]}>Recent Matches</Text>
          <ScrollView horizontal style={styles.horizontalScroll}>
            {recentMatches.map((profile) => (
              <TouchableOpacity
                key={profile.name}
                style={styles.recentMatchContainer}
                onPress={() => navigateToChat(profile)}
              >
                <Avatar.Text
                  label={profile.name.charAt(0)}
                  size={48}
                  style={{
                    backgroundColor:
                      Colors[colorScheme ?? "light"].silver || "#ddd",
                  }}
                />
                <Text style={[styles.recentMatchName, { color: Colors[colorScheme ?? "light"].text }]}>{profile.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Chats */}
      {chats.length > 0 && (
        <>
          <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? "light"].mainBlue }]}>Chats</Text>
          {chats.map((profile) => (
            <TouchableOpacity
              key={profile.name}
              onPress={() => navigateToChat(profile)}
            >
              <Profile {...profile} />
            </TouchableOpacity>
          ))}
        </>
      )}
    </SafeAreaView>
  );
};

interface ProfileProps {
  name: string;
  tags: string[];
  titles: string[];
  lastMessage?: string;
}

const Profile: React.FC<ProfileProps> = ({ name, tags, titles, lastMessage }) => {
  const colorScheme = useColorScheme();
  const title = titles.join(", ");

  // Use the background color from the provided image
  const cardBackgroundColor = Colors[colorScheme ?? "light"].white; 
  
  return (
    <Card style={[styles.profileContainer, { backgroundColor: Colors[colorScheme ?? "light"].white }]}>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Avatar.Text 
          label={name.charAt(0)} 
          size={48} 
          style={{ backgroundColor: Colors[colorScheme ?? "light"].silver }} 
        />
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
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  horizontalScroll: {
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  recentMatchContainer: {
    marginRight: 15,
    alignItems: "center",
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
});
