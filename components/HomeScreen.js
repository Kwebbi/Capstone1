/******************************** 
    This screen is not in use
********************************
import React, { Component, useState } from "react";
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { SafeAreaView, withSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { signOut } from "firebase/auth";
import { auth } from '../config/firebase'

export default function HomeScreen({ navigation }) {
  const handleLogout = async ()=>{
    await signOut(auth);
  }

  const data = [
    { id: 1, image: '', username: 'baby1' },
    { id: 2, image: '', username: 'baby2' },
    { id: 3, image: '', username: 'baby3' },

  ]

  const [babies, setBabies] = useState(data)
  return (

    <View className="flex-1 bg-white">
      <SafeAreaView style={{backgroundColor: "#cfe2f3", borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}>
        <View className="flex bg-white px-8 pt-10" style={{backgroundColor: "#cfe2f3", borderBottomLeftRadius: 50, borderBottomRightRadius: 50}}>
          <Text className="text-white font-xl font-bold text-center" style={{fontSize: 30}}>Home</Text>
        </View>
      </SafeAreaView>

      <View style={styles.container}>
      <View style={styles.body}>


        <FlatList
          style={styles.container}
          enableEmptySections={true}
          data={babies}
          keyExtractor={item => item.id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity>
                <View style={styles.box}>
                  <Image style={styles.image} source={{ uri: item.image }} />
                  <Text style={styles.username}>{item.username}</Text>
                </View> 
              </TouchableOpacity>
              
            )
          }}
        />
      </View>
      </View>
      <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity className="py-3 bg-blue-100 rounded-xl" onPress={()=> navigation.navigate('AddProfile')}>
            <Text className="font-xl font-bold text-center text-gray-700">Add Baby</Text>
          </TouchableOpacity>
        </View>
    </View>
  );
}

/*
      <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity className="py-3 bg-blue-300 rounded-xl" onPress={()=> navigation.navigate('AddProfile')}>
            <Text className="font-xl font-bold text-center text-gray-700">+</Text>
          </TouchableOpacity>
        </View>
*/
/*
const styles = StyleSheet.create({

  image: {
    width: 60,
    height: 60,
  },
  name: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  body: {
    padding: 30,
    backgroundColor: '#ffffff',
  },
  box: {
    padding: 20,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
  },
  username: {
    color: '#20B2AA',
    fontSize: 22,
    alignSelf: 'center',
    marginLeft: 10,
  },
})
*/
import React, { useState } from 'react';
import {
  Modal,
  Text,
  Button,
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';

const HomeScreen = () => {
  // States
  const [newTodo, setNewTodo] = useState('');
  const [todoItems, setTodoItems] = useState([]);
  const [feedings, setFeedings] = useState([]);
  const [diaperChanges, setDiaperChanges] = useState([]);
  const [showAllRecords, setShowAllRecords] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [feedingAmount, setFeedingAmount] = useState('');
  const [diaperType, setDiaperType] = useState('Wet');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [feedingModalVisible, setFeedingModalVisible] = useState(false);
  const [diaperModalVisible, setDiaperModalVisible] = useState(false);

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
      date: selectedDate.toLocaleDateString(),
      time: selectedDate.toLocaleTimeString(),
      amount: feedingAmount,
    };
    setFeedings([...feedings, newFeeding]);
    setFeedingModalVisible(false);
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
    <ScrollView style={styles.container}>
      {/* Banner with Name */}
      <View style={styles.banner}>
        <Text style={styles.bannerText}>Banner Name</Text>
      </View>

      {/* Avatar Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.avatarBubble}>
          <Text style={styles.avatarText}>Avatar</Text>
        </TouchableOpacity>
        <Text style={styles.nameText}>Avatar Name</Text>

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
            Last Feeding: {feedings[feedings.length - 1].date} at {feedings[feedings.length - 1].time}, {feedings[feedings.length - 1].amount} mL
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
              <Text key={`feeding-${index}`}>Feeding #{index + 1}: {feeding.date} - {feeding.time} - {feeding.amount} mL</Text>
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
});

export default HomeScreen;




