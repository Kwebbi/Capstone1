import React from "react";
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../components/ThemeContext";

export default function About({ navigation }) {
  const { isDarkMode, toggleDarkMode } = useTheme();  
  const goToSettings = () => {
    navigation.navigate('Settings'); // Navigate without parameters
  };

  const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
  const titleTextStyle = isDarkMode ? styles.darkTitleText : styles.lightTitleText;
  const textStyle = isDarkMode ? styles.darkText : styles.lightText;
  const backgroundColor = isDarkMode ? 'black' : '#cfe2f3'; // Dark or light background
  const iconColor = isDarkMode ? '#f1f1f1' : '#28436d'; // Dark or light icon color

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View style={{ flex: 1, backgroundColor: backgroundColor }}>
        <SafeAreaView style={{ flex: 0 }}>
          <View style={containerStyle}>
            <TouchableOpacity
              style={{ position: "absolute", left: 22, top: 27, zIndex: 10 }}
              onPress={goToSettings}
            >
              <Ionicons name="arrow-back" size={30} color={iconColor} />
            </TouchableOpacity>

            {/* Centering the logo */}
            <View style={styles.centeredContainer}>
              <Image source={require('../assets/logo.png')} style={{ width: 225, height: 225 }} />
            </View>
          </View>
          <View style={styles.centeredContainer}>
            <Text style={titleTextStyle}>About</Text>
          </View>
        </SafeAreaView>

        {/* Update mainBody style to use dynamic background color */}
        <View style={[styles.mainBody, { backgroundColor: backgroundColor }]}>
          <Text style={textStyle}>
            The team at Baby Tracker cares about infants and their development so we
            developed a seamless experience for parents to input their child’s
            data. Keeping data up to date is essential when caring for infants, so
            our team worked to create a collaborative experience for users.
            {'\n\n'}
            The team at Baby Tracker consists of six software developers from the University of 
            North Texas. We are a group of seniors graduating in December, 2024. We look forward to 
            growing our development skills to improve your experience!
            {'\n\n'}
            Sincerely, {'\n\n'}
            Shajira Guzman{'\n'}Sagar Gyawali{'\n'}Kelley Le{'\n'}Sumat Kusum Sedhain{'\n'}Neha Shrestha{'\n'}Edwin Smith
          </Text>

          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Image source={require('../assets/meanGreen.png')} style={{ width: 200, height: 225 }} />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  mainBody: { 
    flex: 1, 
    padding: 16,
    overflow: 'hidden', 
    paddingHorizontal: 32, 
    paddingTop: 32, 
  },

  lightContainer: {
    backgroundColor: '#cfe2f3', // Light background color
  },

  darkContainer: {
    backgroundColor: 'black', // Dark background color
  },

  lightTitleText: {
    color: '#28436d', // Light mode title color
    fontSize: 35,
    fontWeight: 'bold',
  },

  darkTitleText: {
    color: '#ffffff', // Dark mode title color
    fontSize: 35,
    fontWeight: 'bold',
  },

  lightText: {
    color: '#28436d', // Light mode text color
    fontSize: 18,
  },

  darkText: {
    color: '#ffffff', // Dark mode text color
    fontSize: 18,
  },

  // Added a new style to center items
  centeredContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
});
