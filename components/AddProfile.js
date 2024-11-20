import React, { useState } from "react";
import { Button, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ref, push, set } from "firebase/database";
import { auth, database } from '../config/firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "../components/ThemeContext"; // Import ThemeContext

export default function AddProfile({ navigation }) {
  const { isDarkMode } = useTheme();  // Get dark mode status
  const [name, setName] = useState(''); // name
  const [dob, setDOB] = useState(new Date()); // date of birth
  const [dobSelected, setDOBSelected] = useState(false); // has date of birth been selected
  const [showPicker, setShowPicker] = useState(false); // state for showing the date picker
  const [gender, setGender] = useState('first'); // gender radio buttons

  function createBaby() {
    const babyRef = ref(database, 'babies/');
    const newBabyRef = push(babyRef);
    const babyKey = newBabyRef.key;

    // Create the new baby entry with a uniquely generated key
    const newBaby = {
      fullName: name,
      DOB: dob.toLocaleDateString(),
      babyID: babyKey,
      Gender: gender,
      parents: [auth.currentUser.uid]
    };

    // Set the new baby entry in the database and to a catch error in case there is an error
    set(newBabyRef, newBaby).then(() => {
      console.log("Baby was successfully added");
    }).catch((error) => {
      console.log(error);
    })
  };

  function handleOnPress() {
    createBaby();
    navigation.navigate('Profiles');
  }

  // Dynamic background and text colors based on dark mode
  const backgroundColor = isDarkMode ? 'black' : '#cfe2f3';
  const textColor = isDarkMode ? 'white' : '#28436d';
  const placeholderTextColor = isDarkMode ? 'black' : '#999999';
  const borderColor = isDarkMode ? '#444444' : '#8ec3ff';

  return (
    <ScrollView automaticallyAdjustKeyboardInsets={true} style={{ backgroundColor: backgroundColor }}>
      <View style={[styles.container, { backgroundColor: backgroundColor }]}>
        <SafeAreaView>
          <View style={styles.header}>
            <TouchableOpacity style={{ position: "absolute", left: -10, top: 17 }} onPress={() => navigation.navigate('Profiles')}>
              <Ionicons name="arrow-back" size={30} color={textColor} />
            </TouchableOpacity>
            <Text style={[styles.titleText, { color: textColor }]}>Add Profile</Text>
          </View>
        </SafeAreaView>

        <View style={styles.mainBody}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.headerText, { color: textColor }]}>Baby Info</Text>
          </View>

          <View style={styles.form}>
            {/* Name */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Name</Text>
            <TextInput
              style={[styles.input, { backgroundColor: isDarkMode ? '#818181' : '#f9f9f9', color: textColor }]}
              value={name}
              onChangeText={setName}
              placeholder="Enter name"
              placeholderTextColor={placeholderTextColor}
            />

            {/* DOB */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Date of Birth</Text>
            <TouchableOpacity onPress={() => setShowPicker(true)}>
              <Text style={[styles.input, { backgroundColor: isDarkMode ? '#818181' : '#f9f9f9', color: textColor }]}>
                {dobSelected ? dob.toLocaleDateString() : <Text style={{ color: placeholderTextColor }}>Enter DOB</Text>}
              </Text>
            </TouchableOpacity>
            {showPicker && (
              <View>
                <DateTimePicker
                  value={dob}
                  mode="date"
                  display="spinner"
                  onChange={(event, date) => {
                    if (Platform.OS === 'android') { // Android automatically has confirm button
                      setShowPicker(false);
                    }
                    if (date) {
                      setDOB(date); // Set selected date from date picker
                      setDOBSelected(true);
                    }
                  }}
                  maximumDate={new Date()} // Restrict date picker to the current date
                  style={{ backgroundColor: isDarkMode ? '#818181' : '#f9f9f9' }}  // Background color for the date picker
                />
                {Platform.OS === 'ios' && (
                  <Button
                    title="Done"
                    onPress={() => setShowPicker(false)}
                  />
                )}
              </View>
            )}

            {/* Gender */}
            <Text style={[styles.inputLabel, { color: textColor }]}>Gender</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
              {/* Male Radio Button */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setGender('Male')}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: gender === 'Male' ? '#8ec3ff' : borderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {gender === 'Male' && <View style={styles.selectedRadio} />}
                </TouchableOpacity>
                <Text style={{ marginLeft: 8, color: textColor }}>Male</Text>
              </View>

              {/* Female Radio Button */}
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => setGender('Female')}
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: gender === 'Female' ? '#8ec3ff' : borderColor,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  {gender === 'Female' && <View style={styles.selectedRadio} />}
                </TouchableOpacity>
                <Text style={{ marginLeft: 8, color: textColor }}>Female</Text>
              </View>
            </View>
          </View>

          <TouchableOpacity onPress={handleOnPress} style={[styles.submitButton, { backgroundColor: '#8ec3ff' }]}>
            <Text style={styles.submitButtonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 32,
    paddingHorizontal: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  titleText: {
    fontSize: 35,
    fontWeight: 'bold',
  },
  mainBody: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    padding: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  form: {
    flex: 1,
    justifyContent: 'center',
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
  },
  selectedRadio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#8ec3ff',
  },
  submitButton: {
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 20,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 24,
    color: '#ffffff',
  },
});
