// Main color palette
const mainBlue = '#0f1154';
const cream = '#f2ebc4';
const silver = '#9c9c9c';
const black = '#000000';
const white = '#ffffff';

export const Colors = {
  light: {
    text: mainBlue, // Main blue text
    textSecondary: silver, // Silver for secondary text
    background: white, 
    lightBackground: cream, // Cream background
    tint: mainBlue, // Active elements (tabs/icons/buttons)
    icon: mainBlue, // Main blue for icons
    tabIconDefault: silver, // Inactive tab icon
    tabIconSelected: mainBlue, // Active tab icon
    avatarBackground: cream, // Cream background for avatars
    cream: cream,
    silver: silver,
    black: black,
    white: white,
    mainBlue: mainBlue,
  },
  dark: {
    text: white, // White text for dark mode
    textSecondary: silver, // Silver for secondary text
    background: mainBlue, // Main blue background
    lightBackground: cream, // Cream background
    tint: cream, // Active elements (tabs/icons/buttons)
    icon: cream, // Cream for icons
    tabIconDefault: silver, // Inactive tab icon
    tabIconSelected: cream, // Active tab icon
    avatarBackground: cream, // Cream background for avatars
    cream: cream,
    silver: silver,
    black: black,
    white: white,
    mainBlue: mainBlue,
  },
};
