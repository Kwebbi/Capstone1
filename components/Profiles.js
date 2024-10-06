import React, { Component, useState, useEffect, useMemo } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, Touchable, ScrollView, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ref, push, set, query, orderByChild, equalTo, onValue } from "firebase/database";
import { auth, database} from '../config/firebase'

export default function Profiles({ navigation }) {
  const [isLoading, setIsLoading] = useState(true);

  //first need to check if the baby exists, and get its ID, then pull data
  const babiesRef = ref(database, 'babies');
  const[myBabies, setMyBabies] = useState([]);
  console.log("logged in user is: " + auth.currentUser.uid);
  
  const allBabiesQuery = useMemo(() => (
      query(babiesRef, orderByChild('parents'))
  ), [babiesRef]);
  
  useEffect(() => {
      const unsubscribe = onValue(allBabiesQuery, (snapshot) => {
              if (snapshot.exists()) {
                  const babies = snapshot.val();
                  // Filter babies based on the "parents" array
                  const filteredBabies = Object.values(babies).filter(baby => baby.parents && baby.parents.includes(auth.currentUser.uid));
                  // Set filtered babies to state
                  setMyBabies(filteredBabies);
              } else {
                  console.log("No babies found");
                  setMyBabies([]); // Reset babies state if no data found
              }
              setIsLoading(false); // Set loading state to false
          }, {
          });
          return () => unsubscribe();
  }, []);
        
  return (
    <View className="flex-1 bg-white" style={{ backgroundColor: "#cfe2f3" }}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-center" style={styles.container}>
          <Text className="text-white mt-5" style={styles.titleText}>Baby Profiles</Text>
        </View>
      </SafeAreaView>
      {isLoading ? ( // Check if isLoading is true
        // Render ActivityIndicator while loading
        <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}/>
      ) : (
        <View style={styles.mainBody}>
          <FlatList
            data={myBabies}
            keyExtractor={item => item.babyID}
            renderItem={({ item }) => {
              return (
                <View className="form space-y-2 mb-8 border rounded-3xl">
                  <TouchableOpacity className="flex-row space-x-2.5" onPress={()=> navigation.navigate('HomeScreen', item)}>
                    <Image source={require('../assets/logo.png')} style={{ width: 150, height: 150 }}/>

                    <View style={{ borderRightWidth: 1, borderRightColor: 'black', marginHorizontal: 0 }}></View>

                    <View className="form space-y-2">
                    <Text className=""></Text>
                    <Text className=""></Text>
                    <Text className="text-white" style={styles.nameText}>{item.fullName}</Text>
                    <Text className="text-white" style={styles.ageText}>{item.DOB}</Text>
                    </View>

                    <TouchableOpacity style={{ position: "absolute", right: 12, top: 10 }}>
                      <Ionicons name= "pencil" size={27} color= "grey"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: "absolute", right: 12, bottom: 10 }}>
                      <Ionicons name= "trash" size={27} color= "grey"/>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ position: "absolute", right: 130, bottom: 10 }} onPress={()=> navigation.navigate('ShareBaby', item)}>
                      <Ionicons name= "share" size={27} color= "grey"/>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </View>
              )
            }}
          />

          <TouchableOpacity className="py-1 bg-blue-300 rounded-3xl mt-6 mb-6">
              <Text className="font-xl  text-center text-gray-700 text-3xl" onPress={()=> navigation.navigate('AddProfile')}>+</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={styles.settingsButton}>
            <Ionicons name="settings" size={42} color="black" />
            <Ionicons name="person" size={42} color="black" style={styles.personIcon} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({

  mainBody: { //for the rounded edges in the main body of each screen
        flex: 1, // this allows the view to take the remaining space
        backgroundColor: 'white', 
        borderTopLeftRadius: 50,
        borderTopRightRadius: 50,
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
    settingsButton: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 10
  },
  personIcon: {
    marginLeft: -10
  }
});

