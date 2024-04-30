import React, { useState, useMemo, useEffect } from 'react';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { ref, push, set, query, orderByChild, onValue, remove } from "firebase/database";
import { auth, database } from '../config/firebase';

export default function HomeScreen({route, navigation }) {
  // States
  const [newTodo, setNewTodo] = useState('');
  const [todoItems, setTodoItems] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [sleepRecords, setSleepRecords] = useState([]);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [feedingAmount, setFeedingAmount] = useState('');
  const [foodChoice, setFoodChoice] = useState('');
  const [diaperType, setDiaperType] = useState('Wet');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [diaperModalVisible, setDiaperModalVisible] = useState(false);
  const [sleepModalVisible, setSleepModalVisible] = useState(false);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [sleepStart, setSleepStart] = useState(new Date());
  const [sleepEnd, setSleepEnd] = useState(new Date());
  const { fullName, babyID } = route.params;
  const feedingTimeRef = ref(database, 'feedingTimes/');
  const sleepTimeRef = ref(database, 'sleepTimes/');
  const diaperChangeRef = ref(database, 'diaperChanges/');
  

  const [isLoading, setIsLoading] = useState(true);
  

  // Fetching existing feeding records
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
      
      });
      return () => unsubscribe();
  }, []);

  // Fetching existing diaper change records
useEffect(() => {
  const unsubscribe = onValue(diaperChangeRef, (snapshot) => {
    if (snapshot.exists()) {
      const diaperChanges = snapshot.val();
      setDiaperChanges(Object.values(diaperChanges));
    } else {
      console.log("No diaper changes found");
      setDiaperChanges([]); // Reset diaper changes with empty array
    }
  }, {
  });
  return () => unsubscribe();
}, [babyID]); // Add babyID to the dependency array

  useEffect(() => {
    const sleepTimesRef = ref(database, 'sleepTimes/');
    const sleepQuery = query(sleepTimesRef, orderByChild('babyID'));

    const unsubscribe = onValue(sleepQuery, (snapshot) => {
        const fetchedSleepRecords = [];
        snapshot.forEach(childSnapshot => {
            if (childSnapshot.val().babyID === babyID) {
                fetchedSleepRecords.push(childSnapshot.val());
            }
        });
        setSleepRecords(fetchedSleepRecords);
    });

    return () => unsubscribe(); // Cleanup on unmount
}, [babyID]);


  // Add a new to-do item
  const addTodoItem = () => {
    if (newTodo.trim()) {
        const newTodoRef = push(ref(database, 'todoItems'));
        const newTodoKey = newTodoRef.key;
        set(newTodoRef, newTodo.trim()).then(() => {
            setTodoItems([...todoItems, { id: newTodoKey, text: newTodo.trim() }]);
            setNewTodo('');
        }).catch((error) => {
            console.error("Error adding todo item: ", error);
        });
    }
};

  useEffect(() => {
    const todoItemsRef = ref(database, 'todoItems');
    onValue(todoItemsRef, (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            const todoItemsList = Object.keys(data).map(key => ({ id: key, text: data[key] }));
            setTodoItems(todoItemsList);
        } else {
            setTodoItems([]);
        }
    });
}, []);


  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSelectedDate(currentDate);
    setDatePickerVisibility(false); // Hide the picker
  };

  // Handle sleep start date change
  const onChangeSleepStart = (event, selectedDate) => {
    const currentDate = selectedDate || sleepStart;
    setSleepStart(currentDate);
    setStartPickerVisibility(false); // Hide the picker
  };

  // Handle sleep end date change
  const onChangeSleepEnd = (event, selectedDate) => {
    const currentDate = selectedDate || sleepEnd;
    setSleepEnd(currentDate);
    setEndPickerVisibility(false); // Hide the picker
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

    // Create the new feeding time entry with a uniquely generated key
    const newfeedingTime = {
      feedingTimeID: feedingTimeKey,
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice
    };

    // Set the new baby entry in the database and to catch error in case there is an error
    set(newfeedingTimeRef, newfeedingTime).then(() => {
      console.log("Feeding Time was successfully added");
    }).catch((error) => {
      console.log(error);
    });
  };

  // Save diaper change record
const handleSaveDiaperChange = () => {
  const newDiaperChange = {
    date: selectedDate.toLocaleDateString(),
    time: selectedDate.toLocaleTimeString(),
    type: diaperType,
    babyID: babyID, // Include the babyID
  };

  setDiaperChanges([...diaperChanges, newDiaperChange]); // Update local state

  // Push to Firebase
  const newDiaperChangeRef = push(diaperChangeRef);
  set(newDiaperChangeRef, newDiaperChange).then(() => {
    console.log("Diaper change saved to Firebase");
  }).catch((error) => {
    console.error("Error saving diaper change: ", error);
  });

  setDiaperModalVisible(false); // Close the modal after saving
};
  // Save sleep record
  const handleSaveSleep = () => {
    const newSleepRecord = {
      sleepStart: sleepStart.getTime(), // Store the time as timestamp
      sleepEnd: sleepEnd.getTime(), // Store the time as timestamp
      babyID: babyID,
    };

    setSleepRecords([...sleepRecords, newSleepRecord]);
    setSleepModalVisible(false);

    // Push to Firebase
    createSleepTime(newSleepRecord);
  };

  function createSleepTime(sleepData) {
    const newSleepTimeRef = push(sleepTimeRef);
    const sleepTimeKey = newSleepTimeRef.key;

    // Extend sleepData with a unique key
    const newSleepTime = {
      ...sleepData,
      sleepTimeID: sleepTimeKey
    };

    // Push the new record to Firebase
    set(newSleepTimeRef, newSleepTime).then(() => {
      console.log("Sleep Time was successfully added");
    }).catch((error) => {
      console.error("Error adding sleep time: ", error);
    });
  };

  const handleDeleteSleep = (sleepTimeID) => {
    const sleepTimeRef = ref(database, `sleepTimes/${sleepTimeID}`);
    remove(sleepTimeRef)
    .then(() => {
        console.log("Sleep time removed from Firebase");
        setSleepRecords(prevRecords => prevRecords.filter(record => record.sleepTimeID !== sleepTimeID));
    })
    .catch(error => {
        console.error("Failed to remove sleep time: ", error);
    });
    
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

            <Text className="text-white" style={styles.titleText}>BabyTracker</Text>
          </View>
        </SafeAreaView>
        
        <View className="flex space-y-10 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, position: "relative", top: -30 }}>
          
          {/* Avatar Section */}
          <View style={styles.profileSection}>
            <View className="flex justify-center">
              <TouchableOpacity style={styles.avatarBubble}>
                <Text style={styles.avatarText}>Avatar</Text>
              </TouchableOpacity>
              <Text style={styles.nameText}>{fullName}</Text>
            </View>

            {/* To-Do List */}
            <View style={styles.todoList}>
              <TextInput
                style={styles.todoInput}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Enter todo item"
            
              />
              <Button title="Add Todo" onPress={addTodoItem} />
            {todoItems.map(todo => (
                <Text key={todo.id}>{todo.text}</Text>
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
          

          {/* Sleep Button */}
          <View style={styles.buttonContainer}>
            <Button title="Sleep" onPress={() => setSleepModalVisible(true)} />
            {sleepRecords.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Sleep Record: {new Date(sleepRecords[sleepRecords.length - 1].sleepStart).toLocaleTimeString()} to {new Date(sleepRecords[sleepRecords.length - 1].sleepEnd).toLocaleTimeString()}
              </Text>
            )}
          </View>

                    {/* Show All Records Button */}
                    <View style={styles.buttonContainer}>
            <Button title="Recent Activities" onPress={() => setShowAllRecords(!showAllRecords)} />
            {showAllRecords && (
              <>
                {feedings.map((feeding, index) => (
                  <Text key={`feeding-${index}`}>Feeding #{index + 1}: {feeding.feedingDate} - {feeding.feedingTime} - {feeding.feedingAmount} mL - {feeding.foodChoice}</Text>
                ))}
                {diaperChanges.map((change, index) => (
                  <Text key={`diaper-${index}`}>Diaper #{index + 1}: {change.type} on {change.date} at {change.time}</Text>
                ))}
                <View>
               {sleepRecords.map((record, index) => (
              <View key={index} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: '' }}>
            <Text>Sleep #{index + 1} {new Date(record.sleepStart).toLocaleTimeString()} to {new Date(record.sleepEnd).toLocaleTimeString()}</Text>
            <Button title="Delete" onPress={() => handleDeleteSleep(record.sleepTimeID)} />
        </View>
    ))}
</View>

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
              <Button title="Cancel" onPress={() => setFeedingModalVisible(false)} />
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
                style={{width: 200, height: 200}}>
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
              <Button title="Cancel" onPress={() => setDiaperModalVisible(false)} />
            </View>
          </Modal>

          {/* Sleep Modal */}
          <Modal
            visible={sleepModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSleepModalVisible(false)}>
            <View style={styles.modalView}>
              <Text>Enter Sleep Start:</Text>
              <Button title="Pick Start Time" onPress={() => setStartPickerVisibility(true)} />
              {isStartPickerVisible && (
                <DateTimePicker
                  testID="startDateTimePicker"
                  value={sleepStart}
                  mode="datetime"
                  display="default"
                  onChange={onChangeSleepStart}
                />
              )}
              <Text>Enter Sleep End:</Text>
              <Button title="Pick End Time" onPress={() => setEndPickerVisibility(true)} />
              {isEndPickerVisible && (
                <DateTimePicker
                  testID="endDateTimePicker"
                  value={sleepEnd}
                  mode="datetime"
                  display="default"
                  onChange={onChangeSleepEnd}
                />
              )}
              <Button title="Save Sleep Record" onPress={handleSaveSleep} />
              <Button title="Cancel" onPress={() => setSleepModalVisible(false)} />
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
    fontWeight: 'bold',
    flex: 1,
  },
  todoInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    fontWeight: 'bold',
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
  titleText: {
    color: '#28436d',
    fontSize: 30,
    fontWeight: 'bold',
  },
});
