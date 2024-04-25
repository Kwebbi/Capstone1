import React, { useState, useMemo, useEffect } from 'react';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ref, push, set, query, orderByChild, onValue } from "firebase/database";
import { auth, database} from '../config/firebase';



export default function HomeScreen({route, navigation }) {
  // States
  const [newTodo, setNewTodo] = useState('');
  const [todoItems, setTodoItems] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [feedingAmount, setFeedingAmount] = useState('');
  const [foodChoice, setFoodChoice] = useState('');
  const [diaperType, setDiaperType] = useState('Wet');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [diaperModalVisible, setDiaperModalVisible] = useState(false);
  const { fullName, babyID } = route.params;
  const feedingTimeRef = ref(database, 'feedingTimes/');



  const [isLoading, setIsLoading] = useState(true);

    //fetching existing feeding records
    const allFeedingTimesQuery = useMemo(() => (
        query(feedingTimeRef, orderByChild('dateTime'))
    ), [feedingTimeRef]);
    
    useEffect(() => {
        const unsubscribe = onValue(allFeedingTimesQuery, (snapshot) => {
                if (snapshot.exists()) {
                  console.log("Feeding Times Found!!!")
                  let tmp = [];
                  snapshot.forEach(child => {
                      console.log(child.key, child.val());
                      tmp.push(child.val());
                  });
                    
                    //const feedingTimes = snapshot.val();
                    const feedingTimes = tmp;
                    // Filter feedingTimes based on the "babyId"
                    const filteredFeedingTimes = Object.values(feedingTimes).filter(feedingTime => feedingTime.babyID && feedingTime.babyID == babyID);
                    // Set filtered feedingTimes to state
                    setFeedings(filteredFeedingTimes);
                    console.log(filteredFeedingTimes);
                } else {
                    console.log("No feedingTimes found");
                    setFeedings([]); // Reset feedings with empty array
                }
                setIsLoading(false); // Set loading state to false
            }, {
                // Add appropriate error handling here
            });
            return () => unsubscribe();
    }, []);

  // Add a new to-do item
  const addTodoItem = () => {
    if (newTodo.trim()) {
      setTodoItems([...todoItems, newTodo]);
      setNewTodo('');
    }
  };

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSelectedDate(currentDate);
    setDatePickerVisibility(false); // Hide the picker
  };

  // Save feeding record
  const handleSaveFeeding = () => {
    const newFeeding = {
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice
    };

    setFeedings([...feedings, newFeeding]);
    setFeedingModalVisible(false);

    createFeedingTime();

  };

  // Saves feeding times to the database
  function createFeedingTime() {
    const newfeedingTimeRef = push(feedingTimeRef);
    const feedingTimeKey = newfeedingTimeRef.key;

    // Create the new feeding time entry with a uniquely g6enerated key
    const newfeedingTime = {
      feedingTimeID: feedingTimeKey,
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice
    };

    // Set the new baby entry in the database and to a catch error in case there is an error
    set(newfeedingTimeRef, newfeedingTime).then (() => {
      console.log("Feeding Time was successfully added")
    }).catch((error) => {
      console.log(error);
    })
  };


  // Save diaper change record
  const handleSaveDiaperChange = () => {
    const newDiaperChange = {
      date: selectedDate.toLocaleDateString(),
      time: selectedDate.toLocaleTimeString(),
      type: diaperType,
    };
    setDiaperChanges([...diaperChanges, newDiaperChange]);
    setDiaperModalVisible(false);
  };

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex bg-white" style={{backgroundColor: "#cfe2f3"}}>
        
        {/* Banner with Name */}
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
            <TouchableOpacity style={{ position: "absolute", left: 22, top: 25 }} onPress={()=> navigation.navigate('Profiles')}>
              <Ionicons name= "arrow-back" size={30} color= "#28436d"/>
            </TouchableOpacity>

            <Text className="text-white" style={styles.titleText}>Baby Name</Text>
          </View>
        </SafeAreaView>
        
        <View className="flex space-y-10 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, position: "relative", top: -30 }}>
          
          {/* Avatar Section */}
          <View style={styles.profileSection}>
            <View className="flex justify-center">
              <TouchableOpacity style={styles.avatarBubble}>
                <Text style={styles.avatarText}>Avatar</Text>
              </TouchableOpacity>
              <Text style={styles.nameText}>Avatar Name</Text>
            </View>

            {/* To-Do List */}
            <View style={styles.todoList}>
              <TextInput
                style={styles.todoInput}
                onChangeText={setNewTodo}
                value={newTodo}
                placeholder="Add new to-do"
                onSubmitEditing={addTodoItem}
              />
              {todoItems.map((item, index) => (
                <Text key={index} style={styles.todoItem}>• {item}</Text>
              ))}
            </View>
          </View>

          {/* Feeding Button */}
          <View style={styles.buttonContainer}>
            <Button title="Feeding" onPress={() => setFeedingModalVisible(true)} />
            {feedings.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Feeding: {feedings[feedings.length - 1].foodChoice} - {feedings[feedings.length - 1].feedingDate} at {feedings[feedings.length - 1].feedingTime}, {feedings[feedings.length - 1].feedingAmount} mL
              </Text>
            )}
          </View>

          {/* Diaper Change Button */}
          <View style={styles.buttonContainer}>
            <Button title="Diaper Change" onPress={() => setDiaperModalVisible(true)} />
            {diaperChanges.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Diaper Change: {diaperChanges[diaperChanges.length - 1].type} on {diaperChanges[diaperChanges.length - 1].date} at {diaperChanges[diaperChanges.length - 1].time}
              </Text>
            )}
          </View>

          {/* Show All Records Button */}
          <View style={styles.buttonContainer}>
            <Button title="Show All Records" onPress={() => setShowAllRecords(!showAllRecords)} />
            {showAllRecords && (
              <>
                {feedings.map((feeding, index) => (
                  <Text key={`feeding-${index}`}>Feeding #{index + 1}: {feeding.feedingDate} - {feeding.feedingTime} - {feeding.feedingAmount} mL - {feeding.foodChoice}</Text>
                ))}
                {diaperChanges.map((change, index) => (
                  <Text key={`diaper-${index}`}>Diaper #{index + 1}: {change.type} on {change.date} at {change.time}</Text>
                ))}
              </>
            )}
          </View>

          {/* Feeding Modal */}
          <Modal
            visible={feedingModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFeedingModalVisible(false)}>
            <View style={styles.modalView}>
              <Text>Enter Feeding Details:</Text>
              <Button title="Pick Date & Time" onPress={() => setDatePickerVisibility(true)} />
              {isDatePickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate}
                  mode="datetime"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <TextInput
                style={styles.input}
                placeholder="Food Choice Name"
                value={foodChoice}
                onChangeText={setFoodChoice}
              />
              <TextInput
                style={styles.input}
                placeholder="Amount in mL"
                value={feedingAmount}
                onChangeText={setFeedingAmount}
                keyboardType="numeric"
              />
              <Button title="Save" onPress={handleSaveFeeding} />
            </View>
          </Modal>

          {/* Diaper Change Modal */}
          <Modal
            visible={diaperModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDiaperModalVisible(false)}>
            <View style={styles.modalView}>
              <Text>Diaper Change Type:</Text>
              <Picker
                selectedValue={diaperType}
                onValueChange={(itemValue, itemIndex) => setDiaperType(itemValue)}
                style={{width: 200, height: 44}}>
                <Picker.Item label="Wet" value="Wet" />
                <Picker.Item label="Dirty" value="Dirty" />
                <Picker.Item label="Mixed" value="Mixed" />
                <Picker.Item label="Dry" value="Dry" />
              </Picker>
              <Button title="Pick Date & Time" onPress={() => setDatePickerVisibility(true)} />
              {isDatePickerVisible && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={selectedDate}
                  mode="datetime"
                  display="default"
                  onChange={onChangeDate}
                />
              )}
              <Button title="Save" onPress={handleSaveDiaperChange} />
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  banner: {
    alignItems: 'center',
    marginVertical: 20,
  },
  bannerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarBubble: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 14,
    textAlign: 'center',
  },
  nameText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  todoList: {
    marginLeft: 20,
    flex: 1,
  },
  todoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
  },
  todoItem: {
    fontSize: 16,
    marginLeft: 10,
  },
  buttonContainer: {
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  recordPreview: {
    fontSize: 16,
    marginTop: 5,
  },
  modalView: {
    marginTop: '50%',
    marginHorizontal: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
    width: '100%',
    fontSize: 16,
  },
  picker: {
    width: '100%',
    marginBottom: 20,
  },

  titleText: {
    color: '#28436d',
    fontSize: 30,
    fontWeight: 'bold',
  },
});