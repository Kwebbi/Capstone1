import React, { Component, useState } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'

export default function HomeScreen({ navigation }) {
  const handleLogout = async ()=>{
    await signOut(auth);
  }

  const data = [
    { id: 1, image: '', username: 'baby1' },
    { id: 2, image: '', username: 'baby2' },
    { id: 3, image: '', username: 'baby3' },

  ]

  const [babies, setBabies] = useState(data)




  return (

    <View className="flex-1 bg-white">
      <SafeAreaView style={{backgroundColor: "#cfe2f3", borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}>
        <View className="flex bg-white px-8 pt-10" style={{backgroundColor: "#cfe2f3", borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}>
          <Text className="text-white font-xl font-bold text-center" style={{fontSize: 30}}>Home</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
      <View style={styles.body}>
        <FlatList
          style={styles.container}
          enableEmptySections={true}
          data={babies}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <View style={styles.box}>
                  <Image style={styles.image} source={{ uri: item.image }} />
                  <Text style={styles.username}>{item.username}</Text>
                </View> 
              </TouchableOpacity>
              
            )
          }}
        />
      </View>
      </View>




      <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity className="py-3 bg-blue-100 rounded-xl" onPress={()=> navigation.navigate('AddProfile')}>
            <Text className="font-xl font-bold text-center text-gray-700">Add Baby</Text>
          </TouchableOpacity>
        </View>

      
    </View>


  );




}











/*
      <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity className="py-3 bg-blue-300 rounded-xl" onPress={()=> navigation.navigate('AddProfile')}>
            <Text className="font-xl font-bold text-center text-gray-700">+</Text>
          </TouchableOpacity>
        </View>
*/








const styles = StyleSheet.create({

  image: {
    width: 60,
    height: 60,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  box: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
  },
  username: {
    color: '#20B2AA',
    fontSize: 22,
    alignSelf: 'center',
    marginLeft: 10,
  },
})




