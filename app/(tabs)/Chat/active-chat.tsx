import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  TextInput as RNTextInput,
  Image,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Avatar, IconButton } from "react-native-paper";
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets, SafeAreaView as RNSafeAreaView } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

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

const ActiveChat: React.FC = () => {
  const { user } = useLocalSearchParams(); 
  const profile: ProfileData | null = user ? JSON.parse(user as string) : null;
  const router = useRouter();
  const colorScheme = useColorScheme();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const theme = (colorScheme ?? "light") as "light" | "dark";
  
  const [messages, setMessages] = useState<Message[]>(profile?.messages || []);
  const [messageText, setMessageText] = useState("");

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: Colors[theme].background }]}>
        <Text style={[styles.errorText, { color: Colors[theme].text }]}>No profile selected</Text>
      </View>
    );
  }

  const handleSendMessage = () => {
    if (messageText.trim()) {
      const newMessage: Message = {
        text: messageText.trim(),
        sentByMe: true,
      };
      setMessages([...messages, newMessage]);
      setMessageText("");
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const messageStyle = item.sentByMe 
      ? [styles.myMessage, { backgroundColor: Colors[theme].mainBlue }]
      : [styles.theirMessage, { backgroundColor: Colors[theme].cream }];
    const messageTextStyle = item.sentByMe 
      ? [styles.myMessageText, { color: Colors.light.white }]
      : [styles.theirMessageText, { color: Colors[theme].text }];

    return (
      <View style={[styles.messageBubble, messageStyle]}>
        <Text style={messageTextStyle}>{item.text}</Text>
      </View>
    );
  };

  return (
    <RNSafeAreaView style={[styles.container, { backgroundColor: Colors.light.white }]} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? tabBarHeight : tabBarHeight}
      >
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: Colors[theme].silver }]}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors[theme].text} />
          </TouchableOpacity>
          {profile.profilePicture ? (
            <View style={[styles.headerAvatarCircle, { borderColor: Colors[theme].silver }]}>
              <Image
                source={{ uri: profile.profilePicture }}
                style={styles.headerAvatarImage}
                resizeMode="cover"
              />
            </View>
          ) : (
            <Avatar.Text
              label={profile.name.charAt(0)}
              size={40}
              style={[styles.avatar, { backgroundColor: Colors[theme].silver }]}
            />
          )}
          <Text style={[styles.headerName, { color: Colors[theme].text }]}>{profile.name}</Text>
        </View>

        {/* Messages List */}
        <FlatList
          data={messages}
          keyExtractor={(_, index) => index.toString()}
          renderItem={renderMessage}
          contentContainerStyle={[styles.messagesContainer, { paddingBottom: 20 }]}
          showsVerticalScrollIndicator={false}
        />

        {/* Message Input Bar */}
        <View style={[styles.inputContainer, { 
          backgroundColor: Colors.light.white,
          borderTopColor: Colors[theme].silver,
          paddingBottom: tabBarHeight - 60,
        }]}>
          <View style={[styles.inputWrapper, { 
            backgroundColor: Colors.light.white,
            borderColor: Colors[theme].silver,
          }]}>
            <RNTextInput
              style={[styles.textInput, { 
                color: Colors[theme].text,
              }]}
              placeholder="Type a message..."
              placeholderTextColor={Colors[theme].textSecondary}
              value={messageText}
              onChangeText={setMessageText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity
              onPress={handleSendMessage}
              disabled={!messageText.trim()}
              style={styles.sendButton}
              activeOpacity={messageText.trim() ? 0.7 : 1}
            >
              <Ionicons 
                name="send" 
                size={24} 
                color={Colors[theme].mainBlue}
                style={{ opacity: messageText.trim() ? 1 : 0.3 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </RNSafeAreaView>
  );
};

export default ActiveChat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  avatar: {
    marginRight: 12,
  },
  headerAvatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginRight: 12,
  },
  headerAvatarImage: {
    width: '100%',
    height: '100%',
  },
  headerName: {
    fontSize: 18,
    fontFamily: 'EBGaramond_700Bold',
    flex: 1,
  },
  errorText: {
    fontSize: 18,
    fontFamily: 'EBGaramond_400Regular',
    textAlign: 'center',
    marginTop: 50,
  },
  messagesContainer: {
    padding: 16,
    flexGrow: 1,
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: 12,
    padding: 12,
    marginVertical: 4,
  },
  myMessage: {
    alignSelf: "flex-end",
  },
  theirMessage: {
    alignSelf: "flex-start",
  },
  myMessageText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  theirMessageText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
  },
  inputContainer: {
    borderTopWidth: 1,
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 44,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 84,
  },
  sendButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    paddingRight: 4,
  },
});
