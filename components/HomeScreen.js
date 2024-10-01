import React, { useState, useMemo, useEffect } from 'react';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, push, set, query, orderByChild, onValue } from "firebase/database";
import { auth, database } from '../config/firebase';

export default function HomeScreen({ route, navigation }) {
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

  // Destructure parameters from route
  const { fullName, babyID } = route.params;

  const feedingTimeRef = ref(database, 'feedingTimes/');
  const sleepTimeRef = ref(database, 'sleepTimes/');
  const diaperChangeRef = ref(database, 'diaperChanges/');

  const [isLoading, setIsLoading] = useState(true);
/*
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
*/
  // Fetching existing feeding records
  const allFeedingTimesQuery = useMemo(() => (
    query(feedingTimeRef, orderByChild('dateTime'))
  ), [feedingTimeRef]);

  useEffect(() => {
    const unsubscribe = onValue(allFeedingTimesQuery, (snapshot) => {
      if (snapshot.exists()) {
        const tmp = [];
        snapshot.forEach(child => {
          tmp.push(child.val());
        });
        
        const filteredFeedingTimes = tmp.filter(feedingTime => feedingTime.babyID === babyID);
        setFeedings(filteredFeedingTimes);
      } else {
        setFeedings([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [allFeedingTimesQuery, babyID]);

  useEffect(() => {
    const unsubscribe = onValue(diaperChangeRef, (snapshot) => {
      if (snapshot.exists()) {
        const diaperChanges = snapshot.val();
        setDiaperChanges(Object.values(diaperChanges));
      } else {
        setDiaperChanges([]);
      }
    });
    return () => unsubscribe();
  }, [babyID]);

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

    return () => unsubscribe();
  }, [babyID]);

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

  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setSelectedDate(currentDate);
    setDatePickerVisibility(false);
  };

  const onChangeSleepStart = (event, selectedDate) => {
    const currentDate = selectedDate || sleepStart;
    setSleepStart(currentDate);
    setStartPickerVisibility(false);
  };

  const onChangeSleepEnd = (event, selectedDate) => {
    const currentDate = selectedDate || sleepEnd;
    setSleepEnd(currentDate);
    setEndPickerVisibility(false);
  };

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

  function createFeedingTime() {
    const newfeedingTimeRef = push(feedingTimeRef);
    const feedingTimeKey = newfeedingTimeRef.key;

    const newfeedingTime = {
      feedingTimeID: feedingTimeKey,
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice
    };

    set(newfeedingTimeRef, newfeedingTime).then(() => {
      console.log("Feeding Time was successfully added");
    }).catch((error) => {
      console.log(error);
    });
  };

  const handleSaveDiaperChange = () => {
    const newDiaperChange = {
      date: selectedDate.toLocaleDateString(),
      time: selectedDate.toLocaleTimeString(),
      type: diaperType,
      babyID: babyID,
    };

    setDiaperChanges([...diaperChanges, newDiaperChange]);

    const newDiaperChangeRef = push(diaperChangeRef);
    set(newDiaperChangeRef, newDiaperChange).then(() => {
      console.log("Diaper change saved to Firebase");
    }).catch((error) => {
      console.error("Error saving diaper change: ", error);
    });

    setDiaperModalVisible(false);
  };

  const handleSaveSleep = () => {
    const newSleepRecord = {
      sleepStart: sleepStart.getTime(),
      sleepEnd: sleepEnd.getTime(),
      babyID: babyID,
    };

    setSleepRecords([...sleepRecords, newSleepRecord]);
    setSleepModalVisible(false);
    
    createSleepTime(newSleepRecord);
  };

  function createSleepTime(sleepData) {
    const newSleepTimeRef = push(sleepTimeRef);
    const sleepTimeKey = newSleepTimeRef.key;

    const newSleepTime = {
      ...sleepData,
      sleepTimeID: sleepTimeKey,
      babyID: babyID,
    };

    set(newSleepTimeRef, newSleepTime).then(() => {
      console.log("Sleep time saved to Firebase");
    }).catch((error) => {
      console.error("Error saving sleep time: ", error);
    });
  }

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true}>
      <View className="flex bg-white" style={{ backgroundColor: "#cfe2f3" }}>
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
            <TouchableOpacity style={{ position: "absolute", left: 22, top: 55 }} onPress={() => navigation.navigate('Profiles')}>
              <Ionicons name="arrow-back" size={30} color="#fff" />
            </TouchableOpacity>
            <Text className="text-white" style={styles.titleText}>BabyTracker</Text>
          </View>
        </SafeAreaView>

        <View className="flex space-y-10 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50, position: "relative", top: -30 }}>
          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              <TouchableOpacity style={styles.avatarBubble}>
                <Text style={styles.avatarText}>Avatar</Text>
              </TouchableOpacity>
              <Text style={styles.nameText}>Baby Name</Text>
            </View>

            <View style={styles.todoContainer}>
              <Button title="Add Todo" onPress={addTodoItem} />
              <TextInput
                style={styles.todoInput}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Enter todo item"
              />
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Feeding" onPress={() => setFeedingModalVisible(true)} />
            {feedings.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Feeding: {feedings[feedings.length - 1].foodChoice} - {feedings[feedings.length - 1].feedingDate} at {feedings[feedings.length - 1].feedingTime}, {feedings[feedings.length - 1].feedingAmount} mL
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Diaper Change" onPress={() => setDiaperModalVisible(true)} />
            {diaperChanges.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Diaper Change: {diaperChanges[diaperChanges.length - 1].type} on {diaperChanges[diaperChanges.length - 1].date} at {diaperChanges[diaperChanges.length - 1].time}
              </Text>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button title="Sleep" onPress={() => setSleepModalVisible(true)} />
            {sleepRecords.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Sleep Record: {new Date(sleepRecords[sleepRecords.length - 1].sleepStart).toLocaleTimeString()} to {new Date(sleepRecords[sleepRecords.length - 1].sleepEnd).toLocaleTimeString()}
              </Text>
            )}
          </View>

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
                {sleepRecords.map((record, index) => (
                  <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text>Sleep Record: {record.sleepStart} to {record.sleepEnd}</Text>
                    <Button title="Delete" onPress={() => handleDeleteSleep(record.id)} />
                  </View>
                ))}
              </>
            )}
          </View>
        </View>

        {/* Modal for Feeding */}
        <Modal visible={feedingModalVisible} animationType="slide">
          <View style={styles.modalContent}>
            <Text>Select Feeding Details:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Amount (mL)"
              keyboardType="numeric"
              value={feedingAmount}
              onChangeText={setFeedingAmount}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Food Choice"
              value={foodChoice}
              onChangeText={setFoodChoice}
            />
            <Button title="Save Feeding" onPress={handleSaveFeeding} />
            <Button title="Cancel" onPress={() => setFeedingModalVisible(false)} />
          </View>
        </Modal>

        {/* Modal for Diaper Change */}
        <Modal visible={diaperModalVisible} animationType="slide">
          <View style={styles.modalContent}>
            <Text>Diaper Change:</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Select Diaper Type"
              value={diaperType}
              onChangeText={setDiaperType}
            />
            <Button title="Save Diaper Change" onPress={handleSaveDiaperChange} />
            <Button title="Cancel" onPress={() => setDiaperModalVisible(false)} />
          </View>
        </Modal>

        {/* Modal for Sleep */}
        <Modal visible={sleepModalVisible} animationType="slide">
          <View style={styles.modalContent}>
            <Text>Sleep Record:</Text>
            <Button title="Save Sleep" onPress={handleSaveSleep} />
            <Button title="Cancel" onPress={() => setSleepModalVisible(false)} />
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  avatarContainer: {
    alignItems: 'center',
  },
  avatarBubble: {
    backgroundColor: '#5a9bd5',
    borderRadius: 50,
    width: 70,
    height: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 16,
  },
  nameText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  todoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
  },
  todoInput: {
    borderWidth: 1,
    borderColor: '#5a9bd5',
    padding: 10,
    borderRadius: 5,
    width: '80%',
    marginBottom: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  recordPreview: {
    marginTop: 5,
    fontSize: 12,
    color: '#555',
  },
  modalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    width: '80%',
  },
});
