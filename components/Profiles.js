/*import React from "react";
import { Button, View, Text } from "react-native";

export default function startPage({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>start page</Text>
      <Button
        title="Go to register"
        onPress={() => navigation.navigate("register")}
      />
    </View>
  );
} */

import React, { Component, useState } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, Touchable, ScrollView } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Profiles({ navigation }) {
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex bg-white" style={{backgroundColor: "#cfe2f3"}}>
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
              <TouchableOpacity style={{ position: "absolute", left: 22, top: 27 }} onPress={()=> navigation.navigate('Login')}>
                <Ionicons name= "arrow-back" size={30} color= "#28436d"/>
              </TouchableOpacity>
              
            <Text className="text-white mt-5" style={styles.titleText}>Baby Profiles</Text>
          </View>
        </SafeAreaView>

        <View className="flex bg-white px-8 pt-8" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
          <View className="form space-y-2 mb-8 border rounded-3xl">
            <View className="flex-row space-x-2.5">
              <Image source={require('../assets/logo.png')} style={{width: 150, height: 150}} />

              <View style={{borderRightWidth: 1, borderRightColor: 'black', marginHorizontal: 0}}></View>

              <View className="form space-y-2">
                <Text className=""></Text>
                <Text className=""></Text>
                <Text className="text-white" style={styles.nameText}>Name</Text>
                <Text className="text-white" style={styles.ageText}>Age</Text>
              </View>

              <TouchableOpacity style={{ position: "absolute", right: 12, top: 10 }}>
                <Ionicons name= "pencil" size={27} color= "grey"/>
              </TouchableOpacity>
              <TouchableOpacity style={{ position: "absolute", right: 12, bottom: 10 }}>
                <Ionicons name= "trash" size={27} color= "grey"/>
              </TouchableOpacity>
            </View>
          </View>
          
          <TouchableOpacity className="py-1 bg-blue-300 rounded-3xl mb-8">
            <Text className="font-xl  text-center text-gray-700 text-3xl">+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

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