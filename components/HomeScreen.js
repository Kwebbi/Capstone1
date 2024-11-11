import React, { useState, useMemo, useEffect } from "react"
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, } from "react-native"
import { SafeAreaView, withSafeAreaInsets, } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import DateTimePicker from "@react-native-community/datetimepicker"
import { ref, push, set, query, orderByChild, onValue, remove, get } from "firebase/database"
import { auth, database } from "../config/firebase"
import { Picker } from "@react-native-picker/picker"
import * as Notifications from "expo-notifications"

export default function HomeScreen({ route, navigation }) {
  // States
  const [newTodo, setNewTodo] = useState("")
  const [sendNotification, setSendNotification] = useState(false)
  const [todoItems, setTodoItems] = useState([])
  const [feedings, setFeedings] = useState([])
  const [diaperChanges, setDiaperChanges] = useState([])
  const [sleepRecords, setSleepRecords] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [feedingAmount, setFeedingAmount] = useState("")
  const [foodChoice, setFoodChoice] = useState("")
  const [diaperType, setDiaperType] = useState("Wet")
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
  const [feedingModalVisible, setFeedingModalVisible] = useState(false)
  const [diaperModalVisible, setDiaperModalVisible] = useState(false)
  const [sleepModalVisible, setSleepModalVisible] = useState(false)
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false)
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false)
  const [sleepStart, setSleepStart] = useState(new Date())
  const [sleepEnd, setSleepEnd] = useState(new Date())
  const feedingTimeRef = ref(database, "feedingTimes/")
  const sleepTimeRef = ref(database, "sleepTimes/")
  const diaperChangeRef = ref(database, "diaperChanges/")
  const userId = auth.currentUser.uid
  const todoItemsRef = ref(database, `todoItems/${userId}/${babyID}/`)
  const [colorModalVisible, setColorModalVisible] = useState(false);
  const [avatarColor, setAvatarColor] = useState("#ccc");
  const colorOptions = ["black", "red", "blue", "green", "yellow", "pink", "purple"];
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [isLoading, setIsLoading] = useState(true)

  const { fullName, babyID } = route.params // Get baby info from navigation params

  // Fetching existing feeding records
  const allFeedingTimesQuery = useMemo(
    () => query(feedingTimeRef, orderByChild("dateTime")),
    [feedingTimeRef]
  )

  useEffect(() => {
    const unsubscribe = onValue(allFeedingTimesQuery, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Feeding Times Found!!!")
        let tmp = []
        snapshot.forEach((child) => {
          //console.log(child.key, child.val());
          tmp.push(child.val())
        })

        // Filter feedingTimes based on the "babyId"
        const filteredFeedingTimes = Object.values(tmp).filter(
          (feedingTime) => feedingTime.babyID && feedingTime.babyID == babyID
        )
        // Set filtered feedingTimes to state
        setFeedings(filteredFeedingTimes)
        //console.log(filteredFeedingTimes);
      } else {
        console.log("No feedingTimes found")
        setFeedings([]) // Reset feedings with empty array
      }
      setIsLoading(false) // Set loading state to false
    })

    return () => unsubscribe()
  }, [])

  useEffect(() => {
    if (sendNotification) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: "New Todo Added 📝",
          body: `Your new todo ${newTodo} has been added!`,
          sound: "default",
        },
        trigger: null
      })
    }
    return () => setSendNotification(false)
  }, [sendNotification])

  useEffect(() => {
    const unsubscribe = onValue(diaperChangeRef, (snapshot) => {
      if (snapshot.exists()) {
        const diaperChanges = Object.values(snapshot.val()).filter(
          (change) => change.babyID === babyID
        )
        setDiaperChanges(diaperChanges)
      } else {
        console.log("No diaper changes found")
        setDiaperChanges([])
      }
    })

    return () => unsubscribe()
  }, [babyID])

  useEffect(() => {
    const sleepTimesRef = ref(database, "sleepTimes/")
    const sleepQuery = query(sleepTimesRef, orderByChild("babyID"))

    const unsubscribe = onValue(sleepQuery, (snapshot) => {
      const fetchedSleepRecords = []
      snapshot.forEach((childSnapshot) => {
        if (childSnapshot.val().babyID === babyID) {
          fetchedSleepRecords.push(childSnapshot.val())
        }
      })
      setSleepRecords(fetchedSleepRecords)
    })

    return () => unsubscribe()
  }, [babyID])

  // Fetching existing todo items
  useEffect(() => {
    const todoRef = ref(database, `todoItems/${babyID}/users/${userId}/`)
    const unsubscribe = onValue(todoRef, (snapshot) => {
      if (snapshot.exists()) {
        const items = []
        snapshot.forEach((child) => {
          items.push({ id: child.key, ...child.val() })
        })
        setTodoItems(items)
      } else {
        setTodoItems([])
      }
    })

    return () => unsubscribe()
  }, [userId, babyID])

  // Function to add a todo item
  const addTodoItem = async () => {
    if (!newTodo.trim()) return

    try {
      const todoRef = ref(database, `todoItems/${babyID}/users/${userId}/`)
      const newTodoRef = push(todoRef)
      await set(newTodoRef, {
        text: newTodo,
        timestamp: Date.now(),
      })
    } catch (error) {
      console.error("Error adding Todo Item: ", error)
    }
    setSendNotification(true)
    setNewTodo("");
  }

  // Function to delete a todo item
  const deleteTodoItem = (itemId) => {
    const itemRef = ref(database, `todoItems/${babyID}/users/${userId}/${itemId}`)
    remove(itemRef).catch((error) => {
      console.error("Error deleting todo:", error)
    })
  }

  // Handle date change
  const onChangeDate = (event, selectedDate) => {
    const currentDate = selectedDate || date
    setSelectedDate(currentDate)
    setDatePickerVisibility(false)
  }

  const onChangeSleepStartDate = (event, selectedDate) => {
  const currentDate = selectedDate || sleepStart;
  setSleepStart(currentDate);
  setStartDatePickerVisibility(false);
  };

  const onChangeSleepStartTime = (event, selectedTime) => {
    const currentTime = selectedTime || sleepStart;
    setSleepStart((prevDate) => new Date(
      prevDate.getFullYear(),
      prevDate.getMonth(),
      prevDate.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    ));
    setStartTimePickerVisibility(false);
  };

  const onChangeSleepEndDate = (event, selectedDate) => {
    const currentDate = selectedDate || sleepEnd;
    setSleepEnd(currentDate);
    setEndDatePickerVisibility(false);
  };

  const onChangeSleepEndTime = (event, selectedTime) => {
    const currentTime = selectedTime || sleepEnd;
    setSleepEnd((prevDate) => new Date(
      prevDate.getFullYear(),
      prevDate.getMonth(),
      prevDate.getDate(),
      currentTime.getHours(),
      currentTime.getMinutes()
    ));
    setEndTimePickerVisibility(false);
  };

  // Save feeding record
  const handleSaveFeeding = () => {
    const newFeeding = {
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice,
    }

    setFeedings([...feedings, newFeeding])
    setFeedingModalVisible(false)
    createFeedingTime()
  }

  // Saves feeding times to the database
  function createFeedingTime() {
    const newfeedingTimeRef = push(feedingTimeRef)
    const feedingTimeKey = newfeedingTimeRef.key

    // Create the new feeding time entry with a uniquely generated key
    const newfeedingTime = {
      feedingTimeID: feedingTimeKey,
      feedingAmount: Number(feedingAmount),
      feedingDate: selectedDate.toLocaleDateString(),
      feedingTime: selectedDate.toLocaleTimeString(),
      dateTime: selectedDate.getTime(),
      babyID: babyID,
      foodChoice: foodChoice,
    }

    // Set the new baby entry in the database and to catch error in case there is an error
    set(newfeedingTimeRef, newfeedingTime)
      .then(() => {
        console.log("Feeding Time was successfully added")
      })
      .catch((error) => {
        console.log(error)
      })
  }

  // Save diaper change record
  const handleSaveDiaperChange = () => {
    const newDiaperChange = {
      date: selectedDate.toLocaleDateString(),
      time: selectedDate.toLocaleTimeString(),
      type: diaperType,
      babyID: babyID, // Include the babyID
    }

    setDiaperChanges([...diaperChanges, newDiaperChange]) // Update local state

    // Push to Firebase
    const newDiaperChangeRef = push(diaperChangeRef)
    set(newDiaperChangeRef, newDiaperChange)
      .then(() => {
        console.log("Diaper change saved to Firebase")
      })
      .catch((error) => {
        console.error("Error saving diaper change: ", error)
      })

    setDiaperModalVisible(false) // Close the modal after saving
  }

  // Save sleep record
  const handleSaveSleep = () => {
    const newSleepRecord = {
      sleepStart: sleepStart.getTime(),
      sleepEnd: sleepEnd.getTime(),
      babyID: babyID,
    }

    setSleepRecords([...sleepRecords, newSleepRecord])
    setSleepModalVisible(false)

    createSleepTime(newSleepRecord)
  }

  function createSleepTime(sleepData) {
    const newSleepTimeRef = push(sleepTimeRef)
    const sleepTimeKey = newSleepTimeRef.key

    const newSleepTime = {
      ...sleepData,
      sleepTimeID: sleepTimeKey,
    }

    // Push the new record to Firebase
    set(newSleepTimeRef, newSleepTime)
      .then(() => {
        console.log("Sleep Time was successfully added")
      })
      .catch((error) => {
        console.error("Error saving sleep time: ", error)
      })
  }

  // Function to delete a sleep record
  const handleDeleteSleep = async (recordId) => {
    try {
      const sleepRecordRef = ref(database, `sleepTimes/${recordId}`)
      await remove(sleepRecordRef)

      setSleepRecords(
        sleepRecords.filter((record) => record.sleepTimeID !== recordId)
      )
      alert("Sleep record deleted successfully!")
    } catch (error) {
      console.error("Error deleting sleep record:", error)
      alert("Failed to delete sleep record.")
    }
  }

  // Function to calculate the sleep duration
  function getSleepDuration(time1, time2) {
    const diffInMs = time2 - time1;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));

    if (diffInHours >= 1) { // at least an hour ago
      const mins = diffInMins % 60;
      return `${diffInHours}h ${mins}m`;
    } else {
      return `${diffInMins}m`;
    }
  }

  // Function to calculate the time difference for last data entries
  function getTimeAgo(date, time) {
    // Split date and time
    const [month, day, year] = date.split("/");
    const [clock, period] = time.split(" ");
    let [hoursStr, minutes, seconds] = clock.split(":");

    // Convert to 24-hour format
    let hours = parseInt(hoursStr);
    if (period === "PM" && hours !== 12) {
      hours += 12;
    }
    if (period === "AM" && hours === 12) {
      hours = 0;
    }

    // Convert to ISO string format (YYYY-MM-DDTHH:mm:ss)
    const isoString = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T${hours.toString().padStart(2, "0")}:${minutes}:${seconds}`;

    // Get time difference
    const lastTime = new Date(isoString).getTime();
    const currentTime = Date.now();
    const diffInMs = currentTime - lastTime;
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays >= 1) { // at least a day ago
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    } else if (diffInHours >= 1) { // at least an hour ago
      const mins = diffInMins % 60;
      return `${diffInHours}h ${mins}m ago`;
    } else {
      return `${diffInMins}m ago`;
    }
  }

  useEffect(() => {
    const fetchAvatarColor = async () => {
      try {
        const avatarRef = ref(database, `avatarColors/${babyID}`);
        const snapshot = await get(avatarRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (data.avatarColor) {
            setAvatarColor(data.avatarColor);
          }
        }
      } catch (error) {
        console.error('Error fetching avatar color: ', error);
      }
    };

    fetchAvatarColor();
  }, [babyID]);

  const updateAvatarColor = async (color) => {
    try {
      setAvatarColor(color);
      const avatarRef = ref(database, `avatarColors/${babyID}`);
      await set(avatarRef, { avatarColor: color });
      console.log('Color updated successfully');
    } catch (error) {
      console.error('Error updating color: ', error);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#cfe2f3" }}>

      {/* Top Header */}
        <View style={{ ...styles.topHeader, backgroundColor: "#cfe2f3" }}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Profiles")}
          >
            <Ionicons name="arrow-back" size={30} color="#28436d" />
          </TouchableOpacity>

          <Text style={styles.titleText}>Activity Log</Text>
        </View>

      {/* Scrollable Content */}
      <ScrollView
        automaticallyAdjustKeyboardInsets={true}
        style={{ backgroundColor: "white" }}
      >
        <View className="flex space-y-5 bg-white px-4 pt-8">
          <View style={styles.profileSection}>
            {/* Avatar Section */}
            <View className="flex justify-center">
              <TouchableOpacity
                style={[styles.avatarBubble, { backgroundColor: avatarColor }]}
                onPress={() => setColorModalVisible(true)}
              />
              <Text style={styles.nameText}>{fullName}</Text>
            </View>

            {/* To-Do List */}
            <View style={styles.todoList}>
              <TouchableOpacity style={{ backgroundColor: "#cfe2f3", padding: 5 }} onPress={addTodoItem}>
                <Text style={styles.todoButtonText}>Add Todo</Text>
              </TouchableOpacity>
              <TextInput
                style={styles.todoInput}
                value={newTodo}
                onChangeText={setNewTodo}
                placeholder="Enter todo item"
              />
              {todoItems.map((todo) => (
                <View key={todo.id} style={styles.todoItemContainer}>
                  <Text style={styles.todoItem}>• {todo.text}</Text>
                  <TouchableOpacity onPress={() => deleteTodoItem(todo.id)}>
                    <Ionicons name="trash-outline" size={24} color="red" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>

          <View style={{ height: 1.5, backgroundColor: 'grey' }} />

          {/* Feeding Button */}
          <TouchableOpacity className="flex-row space-x-7" style={[ styles.dataButton, { backgroundColor: '#fd763e' }]} onPress={()=> setFeedingModalVisible(true)}>
              <Image source={require('../assets/feedingIcon.png')} style={[ styles.dataIcon, { tintColor: '#e64d14' }]}/>

              <View className="flex-1">
                <Text style={styles.dataText}>Feeding</Text>
                {feedings.length > 0 && (
                  <Text style={[styles.recordPreview]}>
                    {getTimeAgo(feedings[feedings.length - 1].feedingDate, feedings[feedings.length - 1].feedingTime)} •{" "}
                    {feedings[feedings.length - 1].foodChoice} (
                    {feedings[feedings.length - 1].feedingAmount} mL)
                  </Text>
                )}
              </View>
          </TouchableOpacity>
          
          {/* Diaper Change Button */}
          <TouchableOpacity className="flex-row space-x-7" style={[styles.dataButton, { backgroundColor: '#23de62' } ]} onPress={()=> setDiaperModalVisible(true)}>
              <Image source={require('../assets/diaperIcon.png')} style={[ styles.dataIcon, { marginTop: 2, tintColor: '#19b64f' }]}/>

              <View className="flex-1">
              <Text style={styles.dataText}>Diaper</Text>
              {diaperChanges.length > 0 && (
                <Text style={styles.recordPreview}>
                  {getTimeAgo(diaperChanges[diaperChanges.length - 1].date, diaperChanges[diaperChanges.length - 1].time)} •{" "}
                  {diaperChanges[diaperChanges.length - 1].type}
                </Text>
            )}
              </View>
          </TouchableOpacity>
          
          {/* Sleep Button */}
          <TouchableOpacity className="flex-row space-x-7" style={[styles.dataButton, { backgroundColor: '#a184ff' } ]} onPress={()=> setSleepModalVisible(true)}>
              <Image source={require('../assets/sleepIcon.png')} style={[ styles.dataIcon, { tintColor: '#8064de' }]}/>

              <View className="flex-1">
              <Text style={styles.dataText}>Sleep</Text>
              {sleepRecords.length > 0 && (
                <Text style={styles.recordPreview}>
                  {getTimeAgo(new Date(sleepRecords[sleepRecords.length - 1].sleepEnd).toLocaleDateString("en-US"), new Date(sleepRecords[sleepRecords.length - 1].sleepEnd).toLocaleTimeString("en-US"))} •{" "}
                  {getSleepDuration(sleepRecords[sleepRecords.length - 1].sleepStart, sleepRecords[sleepRecords.length - 1].sleepEnd)}
                </Text>
            )}
              </View>
          </TouchableOpacity>

          {/* Color Selection Modal */}
          <Modal
            visible={colorModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setColorModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text>Select Avatar Color:</Text>
                {colorOptions.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => {
                      updateAvatarColor(color);
                      setColorModalVisible(false);
                    }}
                  />
                ))}
                <Button title="Close" onPress={() => setColorModalVisible(false)} />
              </View>
            </View>
          </Modal>

          {/* Feeding Modal */}
          <Modal
            visible={feedingModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFeedingModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text>Enter Feeding Details:</Text>
                <Button
                  title="Pick Date & Time"
                  onPress={() => setDatePickerVisibility(true)}
                />
                {isDatePickerVisible && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode="datetime"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
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
                <Button
                  title="Cancel"
                  onPress={() => setFeedingModalVisible(false)}
                />
              </View>
            </View>
          </Modal>

          {/* Diaper Change Modal */}
          <Modal
            visible={diaperModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDiaperModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text>Diaper Change Type:</Text>
                <Picker
                  selectedValue={diaperType}
                  onValueChange={(itemValue) => setDiaperType(itemValue)}
                  style={{ width: 200, height: 200 }}
                >
                  <Picker.Item label="Wet" value="Wet" />
                  <Picker.Item label="Dirty" value="Dirty" />
                  <Picker.Item label="Mixed" value="Mixed" />
                  <Picker.Item label="Dry" value="Dry" />
                </Picker>
                <Button
                  title="Pick Date & Time"
                  onPress={() => setDatePickerVisibility(true)}
                />
                {isDatePickerVisible && (
                  <DateTimePicker
                    testID="dateTimePicker"
                    value={selectedDate}
                    mode="datetime"
                    display="default"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}
                <Button title="Save" onPress={handleSaveDiaperChange} />
                <Button
                  title="Cancel"
                  onPress={() => setDiaperModalVisible(false)}
                />
              </View>
            </View>
          </Modal>

          {/* Sleep Modal */}
          <Modal
            visible={sleepModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSleepModalVisible(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalView}>
                <Text>Enter Sleep Details:</Text>

                {/* Date Picker */}
                <Button
                  title="Pick Date"
                  onPress={() => setDatePickerVisibility(true)}
                />
                {isDatePickerVisible && (
                  <DateTimePicker
                    testID="datePicker"
                    value={selectedDate}
                    mode="date"
                    display="calendar"
                    onChange={onChangeDate}
                    maximumDate={new Date()}
                  />
                )}

                {/* Start Time Picker */}
                <Text>Pick Start Time:</Text>
                <Button
                  title="Pick Start Time"
                  onPress={() => setStartTimePickerVisibility(true)}
                />
                {isStartTimePickerVisible && (
                  <DateTimePicker
                    testID="startTimePicker"
                    value={sleepStart}
                    mode="time"
                    display="clock"
                    onChange={onChangeSleepStartTime}
                  />
                )}

                {/* End Time Picker */}
                <Text>Pick End Time:</Text>
                <Button
                  title="Pick End Time"
                  onPress={() => setEndTimePickerVisibility(true)}
                />
                {isEndTimePickerVisible && (
                  <DateTimePicker
                    testID="endTimePicker"
                    value={sleepEnd}
                    mode="time"
                    display="clock"
                    onChange={onChangeSleepEndTime}
                  />
                )}

                {/* Save and Cancel Buttons */}
                <Button title="Save" onPress={handleSaveSleep} />
                <Button
                  title="Cancel"
                  onPress={() => setSleepModalVisible(false)}
                />
              </View>
            </View>
          </Modal>
        </View>
      </ScrollView>
          {/* Bottom Bar */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.bottomButton }
              onPress={() => navigation.navigate("WeeklyReport", { fullName, babyID })}
             >
              <Ionicons name="calendar" size={30} color="#28436d" />
              <Text style={styles.bottomButtonText}>Report</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton }
              onPress={() => navigation.navigate("BabyMilestones", { fullName, babyID })}
             >
              <Ionicons name="trophy" size={30} color="#28436d" />
              <Text style={styles.bottomButtonText}>Milestones</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bottomButton }
              onPress={() => navigation.navigate("Comments", { fullName, babyID })}
             >
              <Ionicons name="chatbubbles" size={30} color="#28436d" />
              <Text style={styles.bottomButtonText}>Comments</Text>
            </TouchableOpacity>
          </View>
    </View>
  )
}

const styles = StyleSheet.create({
  topHeader: {
    alignItems: 'center',
    height: 80,
    padding: 20,
    marginTop: 40,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 25,
    zIndex: 1,
  },
  titleText: {
    flex: 1,
    fontSize: 30,
    textAlign: "center",
    fontWeight: "bold",
    color: '#28436d',
  },
  dataButton: {
    borderRadius: 8,
    alignItems: 'center',
    height: 100,
  },
  dataText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  dataIcon: {
    width: 70,
    height: 70,
    marginLeft: 12,
  },
  profileSection: {
    flexDirection: "row",
    justifyContent: 'space-between',
    width: '100%',
    marginHorizontal: 10,
  },
  avatarBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontSize: 14,
    textAlign: "center",
  },
  nameText: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  todoList: {
    marginLeft: 80,
    marginRight: 20,
    fontWeight: "bold",
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#999",
    flex: 1,
  },
  todoButtonText: {
    color: '#28436d',
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  todoInput: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  recordPreview: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    width: 200,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  todoItemContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  todoItem: {
    fontSize: 16,
    flex: 1,
  },
  deleteIcon: {
    marginLeft: 10,
  },
  avatarSelection: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  bottomBar: {
    flexDirection: 'row',
    backgroundColor: '#cfe2f3',
    paddingHorizontal: 16
  },
  bottomButton: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    paddingVertical: 20,
  },
  bottomButtonText: {
    color: '#28436d',
    marginTop: 4,
  },
})
