import React from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar } from "react-native-paper";

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

const ActiveChat: React.FC = () => {
  const { user } = useLocalSearchParams(); 
  const profile: ProfileData | null = user ? JSON.parse(user as string) : null;
  const router = useRouter();

  if (!profile) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No profile selected</Text>
      </View>
    );
  }

  const renderMessage = ({ item }: { item: Message }) => {
    const messageStyle = item.sentByMe ? styles.myMessage : styles.theirMessage;
    const messageTextStyle = item.sentByMe ? styles.myMessageText : styles.theirMessageText;

    return (
      <View style={[styles.messageBubble, messageStyle]}>
        <Text style={messageTextStyle}>{item.text}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backArrow}>←</Text>
        </TouchableOpacity>
        <Avatar.Text
          label={profile.name.charAt(0)}
          size={40}
          style={styles.avatar}
        />
        <Text style={styles.headerName}>{profile.name}</Text>
      </View>

      {/* Messages List */}
      <FlatList
        data={profile.messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderMessage}
        contentContainerStyle={styles.messagesContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default ActiveChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  // Updated header with just an arrow, icon, and name
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    // No borders or backgrounds, plain layout
  },
  backButton: {
    marginRight: 10,
  },
  backArrow: {
    fontSize: 20,
    color: "#000",
  },
  avatar: {
    backgroundColor: "#BDBDBD",
    marginRight: 10,
  },
  headerName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  errorText: {
    fontSize: 18,
    color: "red",
  },
  messagesContainer: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 8,
    padding: 10,
    marginVertical: 5,
  },
  myMessage: {
    backgroundColor: "#F3E5F5",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#ECECEC",
    alignSelf: "flex-start",
  },
  myMessageText: {
    color: "#000",
  },
  theirMessageText: {
    color: "#000",
  },
});
