import React, { useState, useRef, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  Image,
  Dimensions,
  StyleSheet,
  ImageBackground,
  Animated,
  PanResponder,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MARGIN_HORIZONTAL = SCREEN_WIDTH * 0.03;

const userId = "41f7f9da-dc0a-4657-a1a5-d70c062bc627";

// Define types
interface Profile {
  id: string;
  name: string;
  imageUrl?: string;
  bio?: string;
  goals?: string;
  age?: number;
  location?: {
    city: string;
    state: string;
  };
  additionalImages?: string[];
}

const initialData: Profile = {
  id: "",
  name: "",
  imageUrl: "",
};

// Mock data fallback
const MOCK_PROFILES: Profile[] = [
  {
    id: "mock-1",
    name: "Alex Johnson",
    imageUrl: "https://picsum.photos/seed/alex/800/1200",
    bio: "Coffee, code, and climbing. I love creative projects and collaborating with other artists.",
    goals: "Looking to expand my creative network and work on exciting film projects.",
    age: 28,
    location: {
      city: "New York",
      state: "NY",
    },
    additionalImages: [
      "https://picsum.photos/seed/alex2/800/1200",
      "https://picsum.photos/seed/alex3/800/1200",
    ],
  },
  {
    id: "mock-2",
    name: "Sam Lee",
    imageUrl: "https://picsum.photos/seed/sam/800/1200",
    bio: "Photographer & traveler. Capturing moments and stories through my lens.",
    goals: "Want to connect with other creatives for collaborative projects.",
    age: 25,
    location: {
      city: "Los Angeles",
      state: "CA",
    },
    additionalImages: [
      "https://picsum.photos/seed/sam2/800/1200",
      "https://picsum.photos/seed/sam3/800/1200",
    ],
  },
  {
    id: "mock-3",
    name: "Taylor Kim",
    imageUrl: "https://picsum.photos/seed/taylor/800/1200",
    bio: "Runner. Reader. Builder. Always working on the next big project.",
    goals: "Seeking creative partners for innovative ventures.",
    age: 30,
    location: {
      city: "Chicago",
      state: "IL",
    },
    additionalImages: [
      "https://picsum.photos/seed/taylor2/800/1200",
      "https://picsum.photos/seed/taylor3/800/1200",
    ],
  },
  {
    id: "mock-4",
    name: "Jordan Martinez",
    imageUrl: "https://picsum.photos/seed/jordan/800/1200",
    bio: "Designer and artist. Passionate about visual storytelling.",
    goals: "Building a creative community of like-minded individuals.",
    age: 26,
    location: {
      city: "Austin",
      state: "TX",
    },
    additionalImages: [
      "https://picsum.photos/seed/jordan2/800/1200",
      "https://picsum.photos/seed/jordan3/800/1200",
    ],
  },
  {
    id: "mock-5",
    name: "Casey Williams",
    imageUrl: "https://picsum.photos/seed/casey/800/1200",
    bio: "Musician and producer. Creating sounds that move people.",
    goals: "Collaborating with visual artists for multimedia projects.",
    age: 29,
    location: {
      city: "Seattle",
      state: "WA",
    },
    additionalImages: [
      "https://picsum.photos/seed/casey2/800/1200",
      "https://picsum.photos/seed/casey3/800/1200",
    ],
  },
];

const ProfileQueue: React.FC = () => {
  const colorScheme = useColorScheme();
  const tabBarHeight = useBottomTabBarHeight();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const [profiles, setProfiles] = useState<Profile[]>(MOCK_PROFILES);
  const position = useRef(new Animated.ValueXY()).current;

  // Fetch profiles from API
  useEffect(() => {
    const fetchAllProfiles = async () => {
      try {
        const response = await fetch(`http://localhost:3000/users/profile-queue/${userId}`);
        const data = await response.json();
        console.log('Data received from profile-queue:', data);

        if (Array.isArray(data) && data.length > 0) {
          setProfiles(data);
        } else {
          console.warn('API did not return valid data, using mock data:', data);
          setProfiles(MOCK_PROFILES);
        }
      } catch (error) {
        console.error('Error fetching profiles, using mock data:', error);
        setProfiles(MOCK_PROFILES);
      }
    };
    fetchAllProfiles();
  }, []);

  useEffect(() => {
    if (profiles.length === 0 || !profiles[index]) return;

    // Reset position whenever current profile changes
    position.setValue({ x: 0, y: 0 });

    const fetchProfile = async () => {
      const current = profiles[index];
      if (!current?.id) return;
      console.log(`Fetching data for profile id: ${current.id}`);
      try {
        const response = await fetch(`http://localhost:3000/users/user/${current.id}`);
        const data = await response.json();
        console.log(`Data received for user ${current.id}:`, data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchProfile();
  }, [index, profiles]);

  const rotate = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: ['-10deg', '0deg', '10deg'],
    extrapolate: 'clamp',
  });

  const rotateAndTranslate = {
    transform: [
      { rotate },
      { translateX: position.x },
    ],
  };

  const likeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 0],
    extrapolate: 'clamp',
  });

  const dislikeOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [0, 0, 1],
    extrapolate: 'clamp',
  });

  const nextCardOpacity = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0, 1],
    extrapolate: 'clamp',
  });

  const nextCardScale = position.x.interpolate({
    inputRange: [-SCREEN_WIDTH / 2, 0, SCREEN_WIDTH / 2],
    outputRange: [1, 0.8, 1],
    extrapolate: 'clamp',
  });

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        const { dx, dy } = gestureState;
        return Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 5;
      },
      onPanResponderMove: (evt, gestureState) => {
        position.setValue({ x: gestureState.dx, y: 0 });
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dx > 100) {
          handleLike(profiles[index]?.id);
        } else if (gestureState.dx < -100) {
          handleDislike(profiles[index]?.id);
        } else {
          Animated.spring(position, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: false,
          }).start();
        }
      },
    })
  ).current;

  const handleLike = (likedUserId?: string) => {
    if (!likedUserId) return;
    Animated.spring(position, {
      toValue: { x: SCREEN_WIDTH + 100, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      fetch(`http://localhost:3000/users/users/${userId}/like/${likedUserId}`, {
        method: 'POST',
      })
        .then(response => {
          if (response.ok) {
            console.log('User liked successfully.');
          } else {
            console.error('Error liking user:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error liking user:', error);
        });

      setIndex((prevProfile) => prevProfile + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleDislike = (dislikedUserId?: string) => {
    if (!dislikedUserId) return;
    Animated.spring(position, {
      toValue: { x: -SCREEN_WIDTH - 100, y: 0 },
      useNativeDriver: false,
    }).start(() => {
      fetch(`http://localhost:3000/users/users/${userId}/dislike/${dislikedUserId}`, {
        method: 'POST',
      })
        .then(response => {
          if (response.ok) {
            console.log('User disliked successfully.');
          } else {
            console.error('Error disliking user:', response.statusText);
          }
        })
        .catch(error => {
          console.error('Error disliking user:', error);
        });

      setIndex((prevProfile) => prevProfile + 1);
      position.setValue({ x: 0, y: 0 });
    });
  };

  const handleRedoPress = () => {
    if (index > 0) {
      setIndex(index - 1);
    } else {
      console.log('No previous profiles.');
    }
  };

  const handleFilterPress = () => {
    // Handle filter button press here
    console.log('Filter button pressed');
  };

  const renderProfiles = () => {
    if (!Array.isArray(profiles) || profiles.length === 0) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? "light"].text }]}>Loading profiles...</Text>
        </View>
      );
    }

    if (index >= profiles.length) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={[styles.loadingText, { color: Colors[colorScheme ?? "light"].text }]}>No more profiles available.</Text>
        </View>
      );
    }

    return profiles
      .map((item, itemIndex) => {
        if (itemIndex < index || itemIndex > index + 1) {
          return null;
        }

        let style: any = {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        };

        if (itemIndex === index) {
          style = {
            ...style,
            ...rotateAndTranslate,
          };
        }

        if (itemIndex === index + 1) {
          style = {
            ...style,
            opacity: nextCardOpacity,
            transform: [{ scale: nextCardScale }],
          };
        }

        const imageWidth = SCREEN_WIDTH - 2 * MARGIN_HORIZONTAL;
        const maxImageHeight = SCREEN_HEIGHT * 0.75;
        const imageHeight = maxImageHeight;

        return (
          <Animated.View
            key={item.id}
            {...(itemIndex === index ? panResponder.panHandlers : {})}
            style={style}
          >
            {itemIndex === index && (
              <>
                <Animated.View
                  style={{
                    opacity: likeOpacity,
                    transform: [{ rotate: '-30deg' }],
                    position: 'absolute',
                    top: 50,
                    right: 40,
                    zIndex: 1000,
                  }}
                >
                  <Text style={styles.dislikeStamp}>NO</Text>
                </Animated.View>
                <Animated.View
                  style={{
                    opacity: dislikeOpacity,
                    transform: [{ rotate: '30deg' }],
                    position: 'absolute',
                    top: 50,
                    left: 40,
                    zIndex: 1000,
                  }}
                >
                  <Text style={styles.likeStamp}>YES</Text>
                </Animated.View>
              </>
            )}
            <View style={styles.cardContainer}>
              <ScrollView 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                  paddingTop: 45,
                  paddingBottom: tabBarHeight + 20 
                }}
                scrollEventThrottle={16}
              >
                <View style={{ width: '100%', alignItems: 'center' }}>
                  <View
                    style={{
                      width: imageWidth,
                      height: imageHeight,
                      marginHorizontal: MARGIN_HORIZONTAL,
                      overflow: 'hidden',
                      borderTopLeftRadius: 20,
                      borderTopRightRadius: 20,
                      borderBottomLeftRadius: 20,
                      borderBottomRightRadius: 20,
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: '100%',
                        height: '100%',
                      }}
                      source={{ uri: item.imageUrl }}
                      resizeMode="cover"
                    >
                      <View style={styles.imageOverlay}>
                        <Text style={styles.profileName}>{item.name}</Text>
                        <Text style={styles.profileInfo}>
                          {item.age ? `${item.age} years old` : 'Age not available'}
                        </Text>
                        <Text style={styles.profileInfo}>
                          {item.location ? `${item.location.city}, ${item.location.state}` : 'Location not available'}
                        </Text>
                      </View>
                    </ImageBackground>
                  </View>
                </View>
                {/* Additional content below the image with margins */}
                <View style={styles.contentContainer}>
                  {/* Biography Section */}
                  <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? "light"].text }]}>
                    My Biography
                  </Text>
                  <Text style={[styles.sectionText, { color: Colors[colorScheme ?? "light"].textSecondary }]}>
                    {item.bio || 'No biography available.'}
                  </Text>

                  {/* Additional Image */}
                  {item.additionalImages && item.additionalImages[0] && (
                    <Image
                      source={{ uri: item.additionalImages[0] }}
                      style={styles.additionalImage}
                      resizeMode="cover"
                    />
                  )}

                  {/* Goals Section */}
                  <Text style={[styles.sectionTitle, { color: Colors[colorScheme ?? "light"].text }]}>
                    My Goals
                  </Text>
                  <Text style={[styles.sectionText, { color: Colors[colorScheme ?? "light"].textSecondary }]}>
                    {item.goals || 'No goals provided.'}
                  </Text>

                  {/* Additional Image */}
                  {item.additionalImages && item.additionalImages[1] && (
                    <Image
                      source={{ uri: item.additionalImages[1] }}
                      style={styles.additionalImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              </ScrollView>
            </View>
          </Animated.View>
        );
      })
      .reverse();
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: Colors[colorScheme ?? "light"].background }]}>
      {/* Sticky header bar - outside profile rendering */}
      <View style={[styles.headerBar, { top: insets.top }]}>
        <TouchableOpacity onPress={handleRedoPress}>
          <Ionicons name="refresh" size={24} color={Colors[colorScheme ?? "light"].text} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleFilterPress}>
          <Ionicons name="filter" size={24} color={Colors[colorScheme ?? "light"].text} />
        </TouchableOpacity>
      </View>
      <View style={[styles.container, { paddingTop: insets.top + 45 }]}>{renderProfiles()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  loadingText: {
    fontSize: 18,
    fontFamily: 'EBGaramond_400Regular',
  },
  cardContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flex: 1,
  },
  headerBar: {
    width: '100%',
    height: 45,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 1000,
    position: 'absolute',
    left: 0,
    right: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
  },
  profileName: {
    fontSize: 28,
    color: 'white',
    fontFamily: 'EBGaramond_700Bold',
  },
  profileInfo: {
    fontSize: 18,
    color: 'white',
    fontFamily: 'EBGaramond_400Regular',
  },
  contentContainer: {
    paddingVertical: 10,
    marginHorizontal: MARGIN_HORIZONTAL,
  },
  sectionTitle: {
    fontSize: 24,
    fontFamily: 'EBGaramond_700Bold',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 16,
    fontFamily: 'EBGaramond_400Regular',
    lineHeight: 22,
  },
  additionalImage: {
    width: '100%',
    height: 500,
    marginTop: 20,
    borderRadius: 10,
  },
  likeStamp: {
    borderWidth: 1,
    borderColor: 'green',
    color: 'green',
    fontSize: 32,
    fontFamily: 'EBGaramond_700Bold',
    padding: 10,
  },
  dislikeStamp: {
    borderWidth: 1,
    borderColor: 'red',
    color: 'red',
    fontSize: 32,
    fontFamily: 'EBGaramond_700Bold',
    padding: 10,
  },
});

export default ProfileQueue;
