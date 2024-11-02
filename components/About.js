import React, { Component, useState } from "react";
import { StyleSheet, Button, View, Text, TextInput, TouchableOpacity, FlatList, Image, ScrollView } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { auth, database } from '../config/firebase'
import { Ionicons } from "@expo/vector-icons";
import { ref, push, set, query, orderByChild, equalTo, onValue, get } from "firebase/database";



export default function About({ navigation }) {
   
    const goToSettings = () => {
        navigation.navigate('Settings'); // Navigate without parameters
      };

    return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
        <View className="flex-1 bg-white" style={{ backgroundColor: "#cfe2f3" }}>
            <SafeAreaView style={{ flex: 0 }}>

            <View className="flex-row justify-center" style={styles.container}>     
                </View>
                <View className="flex-row justify-center">
                <TouchableOpacity style={{ position: "absolute", left: 22, top: 27, zIndex: 10 }} onPress={goToSettings}>
                    <Ionicons name= "arrow-back" size={30} color= "#28436d"/>
                    </TouchableOpacity>
              <Image source={require('../assets/logo.png')} style={{ width: 225, height: 225 }}/>
            </View>
            <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white mt-5" style={styles.titleText}>About</Text>
            </View>
            </SafeAreaView>
            
            <View style={styles.mainBody}> 
                <View className="flex-row justify-center">
                </View>
                <View>
                <Text style={{ fontSize: 18, color: '#28436d'}}>
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
                    Shajira Guzman{'\n'}Sagar Gyawali{'\n'}Kelley Le{'\n'}Sumat Kusum Sedhain{'\n'}Neha Shrestha{'\n'}Edwin Smith{'\n'}
                </Text>
                </View>
                <View className="flex-row justify-center">
                    <Image source={require('../assets/meanGreen.png')} style={{ width: 200, height: 225 }}/>
                </View>
            </View>
        </View>
        </ScrollView>

    );
}

const styles = StyleSheet.create({

    mainBody: { 
        flex: 1, 
        backgroundColor: 'white', 
        padding: 16,
        overflow: 'hidden', 
        paddingHorizontal: 32, 
        paddingTop: 32, 
    },
    
    titleText: {
      color: '#28436d',
      fontSize: 35,
      fontWeight: 'bold',
    },
  
    nameText: {
      color: '#28436d',
      fontSize: 27,
      fontWeight: 'bold',
    },
  
    ageText: {
      color: '#28436d',
      fontSize: 17,
    },
    
  });


  


