import React, { Component, useState } from "react";
<<<<<<< HEAD
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, Platform, ScrollView } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
=======
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, Touchable, ScrollView } from "react-native";
//import { TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../config/firebase';
import { Ionicons } from "@expo/vector-icons";
import Checkbox from 'expo-checkbox';
>>>>>>> main

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  
  const handleSubmit = async ()=>{
    if (email && password) {
      try {
        await signInWithEmailAndPassword(auth, email, password);
      }
      catch (err) {
        console.log('got error: ', err.message);
      }
    }
  }  
  
  return (
<<<<<<< HEAD
  <ScrollView automaticallyAdjustKeyboardInsets={true}>
    <View className="flex-1 bg-white" style={{backgroundColor: "#cfe2f3"}}>
      <SafeAreaView className="flex">
          <View className="flex-row justify-center">
            <Image source={require('../assets/logo.png')}
                style={{width: 200, height: 200}} />
          </View>

          <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white" style={styles.titleText}>Welcome!</Text>
          </View>
          
          <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white" style={styles.titleText}>Sign in to your account</Text>
          </View>
      </SafeAreaView>

      <View className="flex-1 bg-white px-8 pt-10" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
        <View className="form space-y-2">
        
          <Text className="text-gray-700 ml-4">Email Address</Text>


          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
            value={email} onChangeText={value=> setEmail(value)} placeholder='Enter Email'/>
         


          <Text className="text-gray-700 ml-4">Password</Text>
 
          <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
            secureTextEntry value={password} onChangeText={value=> setPassword(value)} placeholder='Enter Password'/>
          
          <TouchableOpacity className="flex items-end mb-2">
            <Text className="text-gray-700">Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSubmit} className="py-3 bg-blue-300 rounded-xl">
            <Text className="font-xl font-bold text-center text-gray-700">Login</Text>
          </TouchableOpacity>

          <Text className="text-gray-700 font-bold text-center py-2">Or</Text>

          <TouchableOpacity className="py-3 bg-blue-300 rounded-xl" onPress={()=> navigation.navigate('Register')}>
            <Text className="font-xl font-bold text-center text-gray-700">Register</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
    </ScrollView>
    
=======
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex-1 bg-white" style={{backgroundColor: "#cfe2f3"}}>
        <SafeAreaView className="flex">
            <View className="flex-row justify-center">
              <Image source={require('../assets/logo.png')}
                  style={{width: 225, height: 225}} />
            </View>

            <View className="flex-row justify-center" style={styles.container}>
              <Text className="text-white" style={styles.welcomeText}>Welcome!</Text>
            </View>
            
            <View className="flex-row justify-center pt-1" style={styles.container}>
              <Text className="text-white" style={styles.signInText}>Sign in to your account</Text>
            </View>
        </SafeAreaView>

        <View className="flex-1 bg-white px-8 pt-10" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-2">Email Address</Text>
            <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
              value={email} onChangeText={value=> setEmail(value)} placeholder='Enter Email'/>
            
            <Text className="text-gray-700 ml-2">Password</Text>
            <View className="space-y-3">
              <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
                secureTextEntry={!showPassword} value={password} onChangeText={value=> setPassword(value)} placeholder='Enter Password'/>

              <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} style={{ position: "absolute", right: 12 }}>
                {
                  showPassword == true ? ( <Ionicons name= "eye" size={24} color= "grey"/> ) : ( <Ionicons name= "eye-off" size={24}  color= "grey"/> )
                }
              </TouchableOpacity>
            </View>

            <View className="flex-row ml-1 mb-3">
              <Checkbox style={{marginRight: 8}} value={isChecked} onValueChange={setIsChecked} color={isChecked ? "grey" : undefined}/>

              <Text className="text-gray-500">Remember Me</Text>
              
              <TouchableOpacity style={{ position: "absolute", right: 6 }}>
                <Text className="text-gray-500">Forgot password?</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleSubmit} className="py-3 bg-blue-300 rounded-xl">
              <Text className="font-xl font-bold text-center text-gray-700">Login</Text>
            </TouchableOpacity>

            <Text className="text-gray-700 text-center py-2">or</Text>

            <TouchableOpacity className="py-3 bg-blue-300 rounded-xl mb-20" onPress={()=> navigation.navigate('Register')}>
              <Text className="font-xl font-bold text-center text-gray-700">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
>>>>>>> main
  );
}


/*
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

<KeyboardAwareScrollView>
  <TextInput />
</KeyboardAwareScrollView>
*/
const styles = StyleSheet.create({

  welcomeText: {
    color: '#28436d',
    fontFamily: 'lucida grande',
    fontSize: 40,
    fontWeight: 'bold',
  },

  signInText: {
    color: '#28436d',
    fontSize: 20,
  },
});

//style={{alignItems: "center", backgroundColor: "#ffffff"}}
//style={{borderTopLeftRadius: 50, borderTopRightFadius: 50}}>