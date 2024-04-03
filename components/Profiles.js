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

export default function startPage({ navigation }) {
  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex-1 bg-white" style={{backgroundColor: "#cfe2f3"}}>
        <SafeAreaView> className="flex"
          <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white" style={styles.titleText}>Baby Profiles</Text>
          </View>
        </SafeAreaView>

        <View className="flex-1 bg-white px-8 pt-8" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
          <View className="form space-y-2">
            <View className="flex-row justify-center">
              <Image source={require('../assets/logo.png')}
                style={{width: 150, height: 150}} />
              <View className="form space-y-1">
                <Text className="text-white" style={styles.nameText}>Name</Text>
                <Text className="text-white" style={styles.ageText}>Age</Text>
              </View>
            </View>

            <TouchableOpacity className="py-3 bg-blue-300 rounded-xl">
              <Text className="font-xl font-bold text-center text-gray-700">+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({

  titleText: {
    color: '#28436d',
    fontSize: 30,
    fontWeight: 'bold',
  },

  nameText: {
    color: '#28436d',
    fontSize: 30,
    fontWeight: 'bold',
  },

  ageText: {
    color: '#28436d',
    fontSize: 10,
  },
});