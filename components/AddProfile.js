import React, { Component, useState } from "react";
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView, Image, Modal, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { RadioButton } from 'react-native-paper';
import { StatusBar } from "expo-status-bar";
import { ref, push, set } from "firebase/database";
import { auth, database} from '../config/firebase'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddProfile({ navigation }) {

  const [name, setName] = useState(''); // State for selecting name
  const [dob, setDOB] = useState(new Date()); // State for selecting date of birth
  const [dobSelected, setDOBSelected] = useState(false); // State for showing the inputted date of birth
  const [showPicker, setShowPicker] = useState(false); // State for showing the date picker
  
  const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false) //open and close modal


  const [checked, setChecked] = React.useState('first'); //radio buttons

  function createBaby() {
    const babyRef = ref(database, 'babies/');
    const newBabyRef = push(babyRef);
    const babyKey = newBabyRef.key;

    // Create the new baby entry with a uniquely generated key
    const newBaby = {
      fullName: name,
      DOB: dob.toLocaleDateString(),
      babyID: babyKey,
      Gender: checked,
      parents: [auth.currentUser.uid]
    };

    // Set the new baby entry in the database and to a catch error in case there is an error
    set(newBabyRef, newBaby).then (() => {
      console.log("Baby was successfully added")
    }).catch((error) => {
      console.log(error);
    })
  };

  function handleOnPress() {
    //setOpen(!open);
    createBaby();
    navigation.navigate('Profiles');
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex bg-white" style={{ backgroundColor: "#cfe2f3" }}>
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
              <TouchableOpacity style={{ position: "absolute", left: 22, top: 27 }} onPress={()=> navigation.navigate('Profiles')}>
                <Ionicons name= "arrow-back" size={30} color= "#28436d"/>
              </TouchableOpacity>
              
            <Text className="text-white mt-5" style={styles.titleText}>Add Profile</Text>
          </View>
        </SafeAreaView>

        <View className="flex bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
          <View className="flex-row justify-center">
            <Text className="text-black font-bold mb-5" style={{ fontSize: 25 }}>Baby Info</Text>
          </View>

          <View className="form space-y-1" style={{ flex: 1, justifyContent: "center"}}>

            {/* Name */}
            <Text className="flex-end text-gray-700 ml-2">Name</Text>
            <TextInput className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3" 
              value={name} onChangeText={value=> setName(value)} placeholder='Enter name'/>

            {/* DOB */}
            <Text className="text-gray-700 ml-2">Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3">
                {dobSelected ? (dob.toLocaleDateString()) : (<Text className="text-gray-400 opacity-60">Enter DOB</Text>)}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <View>  
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) {
                      setDOB(date); // Set selected date from date picker
                      setDOBSelected(true);
                    }
                  }}
                />
                <Button
                  title = "Done"
                  onPress={() => {
                    setShowPicker(false);
                    setDOB(dob);
                  }}
                />
              </View>
            )}

            {/* Gender */}
            <Text className="text-gray-700 ml-2">Gender</Text>
            <RadioButton.Item
              label="Male"
              value="Male"
              status={ checked === 'Male' ? 'checked' : 'unchecked' }
              onPress={() => setChecked('Male')}
            />
            <RadioButton.Item
              label="Female"
              value="Female"
              status={ checked === 'Female' ? 'checked' : 'unchecked' }
              onPress={() => setChecked('Female')}
            />
          </View>
          
          <TouchableOpacity className="py-1 bg-blue-300 rounded-3xl mt-5 mb-8">
            <Text className="font-xl text-center text-gray-700 text-3xl" onPress={()=> handleOnPress()}>+</Text>
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

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});