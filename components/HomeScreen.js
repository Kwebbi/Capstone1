import React from "react";
import { Button, View, Text, TouchableOpacity } from "react-native";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'

export default function HomeScreen() {
  const handleLogout = async ()=>{
    await signOut(auth);
  }
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Home Screen!!!!!!</Text>
      
      <TouchableOpacity onPress={handleLogout} className="p-1 bg-blue-400 rounded-lg">
        <Text className="text-white text-lg font-bold">Logout</Text>
      </TouchableOpacity>
      
      <Button
        title="Go to About"
        onPress={() => navigation.navigate("About")}
      />

           
    </View>
  );
}
