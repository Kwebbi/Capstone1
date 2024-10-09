import React, { useState, useMemo, useEffect } from 'react';
import { Button, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, FlatList } from 'react-native';
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from '@react-native-community/datetimepicker';
import { ref, push, set, query, orderByChild, onValue, remove } from "firebase/database";
import { auth, database } from '../config/firebase';
import { Picker } from '@react-native-picker/picker';

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
  const [commentSectionModalVisible, setCommentSectionModalVisible] = useState(false);
  const [isStartPickerVisible, setStartPickerVisibility] = useState(false);
  const [isEndPickerVisible, setEndPickerVisibility] = useState(false);
  const [sleepStart, setSleepStart] = useState(new Date());
  const [sleepEnd, setSleepEnd] = useState(new Date());
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const feedingTimeRef = ref(database, 'feedingTimes/');
  const sleepTimeRef = ref(database, 'sleepTimes/');
  const diaperChangeRef = ref(database, 'diaperChanges/');
  const commentRef = ref(database, 'comments/');
  const userId = auth.currentUser.uid;
  const todoItemsRef = ref(database, `todoItems/${userId}/${babyID}/`);

  const [isLoading, setIsLoading] = useState(true);

  //setComments([{user:"john@gmail.com", babyID: 123456, text: "Juan David is a Shitty Baby, he pukes all the time"}, {user:"john@gmail.com", babyID: 123456, text: "Juan David is a Shitty Baby, he pukes all the time"}]);

  const { fullName, babyID } = route.params; //Get baby info from navigation params
  
  // Fetching existing feeding records
  const allFeedingTimesQuery = useMemo(() => (
    query(feedingTimeRef, orderByChild('dateTime'))
  ), [feedingTimeRef]);

  const allCommentsQuery = useMemo(() => (
    query(commentRef/*, orderByChild('dateTime')*/)
  ),  [commentRef]);
  
  
  useEffect(() => {
    const unsubscribe = onValue(allFeedingTimesQuery, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Feeding Times Found!!!");
        let tmp = [];
        snapshot.forEach(child => {
          //console.log(child.key, child.val());
          tmp.push(child.val());
        });
        
        // Filter feedingTimes based on the "babyId"
        const filteredFeedingTimes = Object.values(tmp).filter(feedingTime => feedingTime.babyID && feedingTime.babyID == babyID);
        // Set filtered feedingTimes to state
        setFeedings(filteredFeedingTimes);
        //console.log(filteredFeedingTimes);
      } else {
        console.log("No feedingTimes found");
        setFeedings([]); // Reset feedings with empty array
      }
      setIsLoading(false); // Set loading state to false
    });

    return () => unsubscribe();
  }, []);

  //Retrieving Comments from DB
  useEffect(() => {
    
    const unsubscribe = onValue(allCommentsQuery, (snapshot) => {
      if (snapshot.exists()) {
        console.log("Comments found in DB!!!");
        let tmp = [];
        snapshot.forEach(child => {
          //console.log(child.key, child.val());
          tmp.push(child.val());
        });
        
        // Filter Comments based on the "babyId"
        const filteredComments = Object.values(tmp).filter(comment => comment.babyID && comment.babyID == babyID);
        // Set filtered feedingTimes to state
        setComments(filteredComments);
        //console.log(filteredComments);
      } else {
        console.log("No Comments found");
        setComments([]); // Reset comments with empty array
      }
      setIsLoading(false); // Set loading state to false
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

  // Fetch to-do items
  useEffect(() => {
    const unsubscribe = onValue(todoItemsRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const todoList = Object.keys(data).map((key) => ({
          id: key,
          text: data[key],
        }));
        setTodoItems(todoList);
      } else {
        setTodoItems([]);
      }
      setIsLoading(false);
    });

    return () => unsubscribe(); // Cleanup on unmount
  }, [todoItemsRef]);

  // Function to add a todo item
  const addTodoItem = async () => {
    if (!newTodo.trim()) return;

    try {
      const todoRef = ref(database, `todoItems/${userId}/${babyID}`);
      const newTodoRef = push(todoRef);
      await set(newTodoRef, {
        text: newTodo,
        timestamp: Date.now(),
      });
      setTodoItems((prevItems) => [...prevItems, { id: newTodoRef.key, text: newTodo }]);
      setNewTodo('');
    } catch (error) {
      console.error("Error adding Todo Item: ", error);
    }
  };

  const deleteTodoItem = (itemId) => {
    const itemRef = ref(database, `todoItems/${userId}/${babyID}/${itemId}`);
    remove(itemRef)
      .then(() => {
        setTodoItems((prevItems) => prevItems.filter(item => item.id !== itemId));
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

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

  //Save comment record
  const handleSaveComment = () => {

    const newComment = {
      text: comment,
      user: auth.currentUser.email,
      commentDate: (new Date()).toLocaleDateString(),
      dateTime: (new Date()).getTime(),
      babyID: babyID
    };

    setComments([...comments, newComment]);
    setComment('');
    console.log("Comment Saved!");
    //console.log(comments);

    createComment();
  };

  // Saves comments to the database
  function createComment() {
    const newCommentRef = push(commentRef);
    const commentKey = newCommentRef.key;

    // Create the new comment entry with a uniquely generated key
    const newComment = {
      commentId: commentKey,
      text: comment,
      user: auth.currentUser.email,
      commentDate: (new Date()).toLocaleDateString(),
      dateTime: (new Date()).getTime(),
      babyID: babyID
    };

    // Set the new baby entry in the database and to catch error in case there is an error
    set(newCommentRef, newComment).then(() => {
      console.log("New Comment was successfully added");
    }).catch((error) => {
      console.log(error);
    });
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
      console.error("Error saving sleep time: ", error);
    });
  };

  return (
    <ScrollView
      automaticallyAdjustKeyboardInsets={true}
      style={{ backgroundColor: "#cfe2f3" }}
    >
      <View className="flex" style={{ backgroundColor: "#cfe2f3" }}>
        {/* Banner with Name */}
        <SafeAreaView className="flex">
          <View className="flex-row justify-center" style={styles.container}>
            <TouchableOpacity
              style={{ position: "absolute", left: 22, top: 25 }}
              onPress={() => navigation.navigate("Profiles")}
            >
              <Ionicons name="arrow-back" size={30} color="#28436d" />
            </TouchableOpacity>

            <Text style={styles.titleText}>{fullName}</Text>
          </View>
        </SafeAreaView>

        <View
          className="flex space-y-10 bg-white px-8 pt-8"
          style={{ borderRadius: 50, position: "relative", top: -30 }}
        >
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
              {todoItems.map((todo) => (
                <Text key={todo.id} style={styles.todoItem}>
                  • {todo.text}
                </Text>
              ))}
            </View>
          </View>

          {/* Feeding Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Feeding"
              onPress={() => setFeedingModalVisible(true)}
            />
            {feedings.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Feeding: {feedings[feedings.length - 1].foodChoice} -{" "}
                {feedings[feedings.length - 1].feedingDate} at{" "}
                {feedings[feedings.length - 1].feedingTime},{" "}
                {feedings[feedings.length - 1].feedingAmount} mL
              </Text>
            )}
          </View>

          {/* Diaper Change Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Diaper Change"
              onPress={() => setDiaperModalVisible(true)}
            />
            {diaperChanges.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Diaper Change:{" "}
                {diaperChanges[diaperChanges.length - 1].type} on{" "}
                {diaperChanges[diaperChanges.length - 1].date} at{" "}
                {diaperChanges[diaperChanges.length - 1].time}
              </Text>
            )}
          </View>

          {/* Sleep Button */}
          <View style={styles.buttonContainer}>
            <Button title="Sleep" onPress={() => setSleepModalVisible(true)} />
            {sleepRecords.length > 0 && (
              <Text style={styles.recordPreview}>
                Last Sleep Record:{" "}
                {new Date(
                  sleepRecords[sleepRecords.length - 1].sleepStart
                ).toLocaleTimeString()}{" "}
                to{" "}
                {new Date(
                  sleepRecords[sleepRecords.length - 1].sleepEnd
                ).toLocaleTimeString()}
              </Text>
            )}
          </View>

          {/* Show All Records Button */}
          <View style={styles.buttonContainer}>
            <Button
              title="Show All Records"
              onPress={() => setShowAllRecords(!showAllRecords)}
            />
            {showAllRecords && (
              <>
                {feedings.map((feeding, index) => (
                  <Text key={`feeding-${index}`}>
                    Feeding #{index + 1}: {feeding.feedingDate} -{" "}
                    {feeding.feedingTime} - {feeding.feedingAmount} mL -{" "}
                    {feeding.foodChoice}
                  </Text>
                ))}
                {diaperChanges.map((change, index) => (
                  <Text key={`diaper-${index}`}>
                    Diaper #{index + 1}: {change.type} on {change.date} at{" "}
                    {change.time}
                  </Text>
                ))}
                <View>
                  {sleepRecords.map((record, index) => (
                    <View
                      key={index}
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "",
                      }}
                    >
                      <Text>
                        Sleep #{index + 1}:{" "}
                        {new Date(record.sleepStart).toLocaleTimeString()} to{" "}
                        {new Date(record.sleepEnd).toLocaleTimeString()}
                      </Text>
                      <Button
                        title="Delete"
                        onPress={() => handleDeleteSleep(record.sleepTimeID)}
                      />
                    </View>
                  ))}
                </View>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Weekly Report"
              onPress={() =>
                navigation.navigate("WeeklyReport", { fullName, babyID })
              }
            />
          </View>

          {/* Show Milestones Button*/}
          <View style={styles.buttonContainer}>
            <Button
              title="Show Milestones"
              onPress={() =>
                navigation.navigate("BabyMilestones", { fullName, babyID })
              } // Navigate to BabyMilestones
            />
          </View>

          {/* Feeding Modal */}
          <Modal
            visible={feedingModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setFeedingModalVisible(false)}
          >
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
          </Modal>

          {/* Diaper Change Modal */}
          <Modal
            visible={diaperModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setDiaperModalVisible(false)}
          >
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
                />
              )}
              <Button title="Save" onPress={handleSaveDiaperChange} />
              <Button
                title="Cancel"
                onPress={() => setDiaperModalVisible(false)}
              />
            </View>
          </Modal>

          {/* Sleep Modal */}
          <Modal
            visible={sleepModalVisible}
            animationType="slide"
            transparent={true}
            onRequestClose={() => setSleepModalVisible(false)}
          >
            <View style={styles.modalView}>
              <Text>Enter Sleep Start:</Text>
              <Button
                title="Pick Start Time"
                onPress={() => setStartPickerVisibility(true)}
              />
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
              <Button
                title="Pick End Time"
                onPress={() => setEndPickerVisibility(true)}
              />
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
              <Button
                title="Cancel"
                onPress={() => setSleepModalVisible(false)}
              />
            </View>
          </Modal>

          <Button
            mode="contained"
            title="Comment Section"
            onPress={() =>
              setCommentSectionModalVisible(!commentSectionModalVisible)
            }
          ></Button>

          {/* Comment Section Modal */}
          <Modal
            visible={commentSectionModalVisible}
            onRequestClose={() => setCommentSectionModalVisible(false)}
          >
            <View style={styles.commentSection}>
              {/* Comment Input Field */}

              <TextInput
                style={styles.commentInput}
                label="Add a comment"
                value={comment}
                onChangeText={(text) => setComment(text)}
                mode="outlined"
                placeholder="Enter your comment here..."
              />

              {/* Submit Button */}
              <Button
                mode="contained"
                title="Post"
                onPress={handleSaveComment}
              ></Button>

              {/* Display list of comments */}
              <FlatList
                data={comments}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <View style={styles.comment}>
                    <Text style={styles.user}>User: {item.user}</Text>
                    <Text>Date: {item.commentDate}</Text>
                    <Text>{item.text}</Text>
                  </View>
                )}
                ListEmptyComponent={<Text>No comments yet.</Text>}
              />
              <Button
                title="Go Back to HomeScreen"
                onPress={() => setCommentSectionModalVisible(false)}
              ></Button>
            </View>
          </Modal>
        </View>
      </View>
    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  titleText: {
    fontSize: 30,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatarBubble: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#999',
  },
  todoInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  recordPreview: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 50,
    alignItems: 'center',
    shadowColor: '#000',
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
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  comment: {
    margin: 2,
    fontWeight: 'bold',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#999',
    width: 300
  },
  commentInput: {
    width: 310,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
    marginTop: 10,
    height: 80
  },
  commentSection :{
    backgroundColor: 'white',
    padding: 10,
    margin: 20,
    marginTop: 100,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    height: 500,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});
