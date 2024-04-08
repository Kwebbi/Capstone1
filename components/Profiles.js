import React, { Component, useState, useEffect } from "react";
import { StyleSheet, View, TouchableOpacity, Image, Text, TextInput, Touchable, ScrollView, FlatList } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ref, push, set, query, orderByChild, equalTo, onValue } from "firebase/database";
import { auth, database} from '../config/firebase'


export default function Profiles({ navigation }) {
  

    //first need to check if the baby exists, and get its ID, then pull data
    const babiesRef = ref(database, 'babies');
    console.log("logged in user is: " + auth.currentUser.uid);
    const allBabiesQuery = query(babiesRef, orderByChild('parents'));
    
    const[myBabies, setMyBabies] = useState([]); // not in use
    



    let tempBabies = [];

    onValue(allBabiesQuery, (snapshot) => {
        const babies = snapshot.val();
        if (babies) {
            // Filter babies based on the "parents" array
            const filteredBabies = Object.values(babies).filter(baby => baby.parents && baby.parents.includes(auth.currentUser.uid));
            
            
            // Handle filtered babies
            filteredBabies.forEach(baby => {
                tempBabies.push(baby);
                /*console.log("Baby ID:", baby.babyID);
                console.log("DOB:", baby.DOB);
                console.log("Gender:", baby.Gender);
                console.log("Full Name:", baby.fullName); */
                // Handle other properties as needed
            });
            
        } else {
            console.log("No babies found");
        }
    }, {
        // Add appropriate error handling here
    });

    const check_duplicate_in_array=(input_array)=>{
        const duplicates =input_array.filter((item, index) =>input_array.indexOf(item) !== index);
        return Array.from(new Set(duplicates));
    }
    //const arr=[1,1,2,2,3,3,4,5,6,1];
    console.log(check_duplicate_in_array(tempBabies));
    

    const [myArray, setMyArray] = useState(tempBabies);
    console.log("The babies: " + myArray);
    
    return (

      <View className="flex bg-white" style={{backgroundColor: "#cfe2f3"}}>
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white mt-5" style={styles.titleText}>Baby Profiles</Text>
          </View>
        </SafeAreaView>

        <View className="flex bg-white px-8 pt-8" style={{borderTopLeftRadius: 50, borderTopRightRadius: 50}}>
            
            {/* Removed code was here

            <FlatList
                data={tempBabies}
                keyExtractor={item => item.fullName}
                renderItem={({ item }) => {
                    return (
                    <TouchableOpacity>
                        <Text>{item.fullName}</Text>
                    </TouchableOpacity>
                    
                    )
                }}
            /> */}

            <FlatList
                data={tempBabies}
                keyExtractor={item => item.babyID}
                renderItem={({ item }) => {
                    return (
                        <View className="form space-y-2 mb-8 border rounded-3xl">
                            <View className="flex-row space-x-2.5">
                                <Image source={require('../assets/logo.png')} style={{width: 150, height: 150}} />

                                <View style={{borderRightWidth: 1, borderRightColor: 'black', marginHorizontal: 0}}></View>

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
                            </View>
                        </View>
                    
                    )
                }}
            />







            
            <TouchableOpacity className="py-1 bg-blue-300 rounded-3xl mb-8">
                <Text className="font-xl  text-center text-gray-700 text-3xl" onPress={()=> navigation.navigate('AddProfile')}>+</Text>
            </TouchableOpacity>
        </View>
      </View>
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


/*

 
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









<View className="form space-y-2 mb-8 border rounded-3xl">
    <View className="flex-row space-x-2.5">
        <Image source={require('../assets/logo.png')} style={{width: 150, height: 150}} />

        <View style={{borderRightWidth: 1, borderRightColor: 'black', marginHorizontal: 0}}></View>

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
    </View>
</View>



*/