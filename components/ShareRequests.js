import React, { Component, useState, useEffect, useMemo } from "react";
import { StyleSheet, Button, View, TouchableOpacity, Image, Text, TextInput, Touchable, ScrollView, FlatList, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ref, update, set, query, orderByChild, equalTo, onValue, get, remove } from "firebase/database";
import { auth, database} from '../config/firebase'
import Dialog from "react-native-dialog";

export default function ShareRequests({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(true);
    //const { alerts } = route.params;
    const [alerts, setAlerts] = useState(route.params.alerts);
    const [visible, setVisible] = useState(false); //for dialog



    const deleteAlert = (itemId) => {
        console.log("alert id: " + itemId);
        const itemRef = ref(database, `alert/${itemId}`);
        remove(itemRef).then(() => {
            setAlerts((prevAlerts) => prevAlerts.filter(alert => alert.alertID !== itemId));
            console.log("alert deleted");
        }).catch((error) => {
            console.error("Error deleting alert: ", error);
        }); 
    };

    const addCaretakersToBaby = (babyID, newCaretaker) => {
        const babyRef = ref(database, `babies/${babyID}`);
    
        //get the current caretakers
        get(babyRef)
            .then((snapshot) => {
                if (snapshot.exists()) {
                    const currentData = snapshot.val();
                    const currentCaretakers = currentData.caretakers || []; // Default to empty array if caretakers doesn't exist
                    
                    // Add the new caretaker to the array
                    const updatedCaretakers = [...currentCaretakers, newCaretaker];
                    
                    // Update the baby record
                    update(babyRef, {
                        caretakers: updatedCaretakers
                    })
                    .then(() => {
                        console.log("Caretaker added successfully.");
                    })
                    .catch((error) => {
                        console.error("Error adding caretaker: ", error);
                    });
                }
            })
            .catch((error) => {
                console.error("Error fetching baby data: ", error);
            });
    };

    const showDialog = () => {
      setVisible(true);
    };
  
    const handleCancel = () => {
      setVisible(false);
    };
  
    const handleAccept = (parentID, babyID, alertID) => {
      addCaretakersToBaby(babyID, parentID);
      deleteAlert(alertID);
      setVisible(false);
    };

    const handleDeny = (itemId) => {
        deleteAlert(itemId)
        setVisible(false);
        navigation.navigate('ShareRequests', alerts);
    };

    return (
      <View className="flex-1 bg-white" style={{ backgroundColor: "#cfe2f3" }}>
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
            <Text className="text-white mt-5" style={styles.titleText}>Pending Share Requests</Text>

          </View>
        </SafeAreaView>
       {/* } {isLoading ? ( // Check if isLoading is true
            // Render ActivityIndicator while loading
            <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: "center", alignItems: "center" }}/>
    ) : ( */}
            <View style={styles.mainBody}>


            <View style={{ padding: 10 }}>
                    {alerts.length < 1 && (
                            <Text style={{ fontSize: 18, color: '#28436d', fontWeight: 'bold', textAlign: 'center' }}>
                                You have no share requests.
                            </Text>
                    )}
                </View>
                <FlatList
                data={alerts}
                keyExtractor={item => item.alertID}
                renderItem={({ item }) => {
                    const name = item.message.split("for")[1]?.trim();
                    return (
                        <View className="flex-1 mt-4">
                            <View style={{ borderRightWidth: 1, borderRightColor: 'black', marginHorizontal: 0 }}></View>
                                <View>
                                    <TouchableOpacity style={{ backgroundColor: '#fef9c3', padding: 10, borderRadius: 15 }}>
                                        <Text className="text-xsm" onPress={showDialog}>{item.message}</Text>
                                    </TouchableOpacity>
                                    <Dialog.Container visible={visible}>
                                        <Dialog.Title>Pending Request</Dialog.Title>
                                        <Dialog.Description>
                                        Do you want to be added as a caretaker for {name}?
                                        </Dialog.Description>
                                        <Dialog.Button label="Cancel" onPress={handleCancel} />
                                        <Dialog.Button label="Accept" onPress={() => handleAccept(item.parentID, item.babyID, item.alertID)} />
                                        <Dialog.Button label="Deny" onPress={() => handleDeny(item.alertID)} />
                                    </Dialog.Container>
                                </View>
                        </View>
                    )
                }}
                />
            </View>
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

    alertList: {
        borderWidth: 1, 
        borderColor: 'black', 
        borderRadius: 8, 
        padding: 10,
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

