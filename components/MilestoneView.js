//MilestoneView.js
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, update } from 'firebase/database';
import { database } from '../config/firebase';
import { Picker } from '@react-native-picker/picker';

// MilestoneView component
const MilestoneView = ({ navigation, route }) => {
    // Extract milestone, babyId, babyName, and milestoneId from route parameters
    const { milestone, babyId, babyName, milestoneId } = route.params;

    // State to toggle between editing and viewing mode
    const [isEditing, setIsEditing] = useState(false);
    
    // State for tracking and updating the title, achieved status, and date of the milestone
    const [editedTitle, setEditedTitle] = useState(milestone.title); // Initialized with the existing title
    const [editedAchieved, setEditedAchieved] = useState(milestone.achieved); // Initialized with the existing achieved status
    const [editedDate, setEditedDate] = useState(milestone.date); // Initialized with the existing date

    // Function to switch to edit mode
    const handleEditPress = () => {
        setIsEditing(true); // Enable editing mode
        console.log("Editing mode enabled");
    };

    // Function to save changes to Firebase and disable edit mode
    const handleSaveChanges = () => {
        const milestoneRef = ref(database, `babies/${babyId}/milestone/${milestoneId}`); // Reference to the specific milestone in Firebase

        // Update milestone fields in Firebase
        update(milestoneRef, {
            title: editedTitle,     // Update the title
            achieved: editedAchieved === 'Yes', // Convert "Yes" to true, "No" to false for the achieved status
            date: editedDate, // Update the date
        }).then(() => {
            setIsEditing(false); // Exit editing mode
            console.log("Milestone updated successfully:", { title: editedTitle, achieved: editedAchieved, date: editedDate });
        }).catch((error) => {
            console.error("Error updating milestone: ", error); // Log any errors during the update
        });
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditPress}>
                <Ionicons name="create-outline" size={24} color="black" />
            </TouchableOpacity>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{`${babyName}'s Milestone`}</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                        />
                    ) : (
                        <Text style={styles.title}>{editedTitle}</Text>
                    )}
                </View>
                
                <View style={styles.itemContainer}>
                    <Text style={styles.label}>Achieved:</Text>
                    {isEditing ? (
                        <Picker
                            selectedValue={editedAchieved ? 'Yes' : 'No'} // Show Yes/No for boolean values
                            style={styles.picker}
                            onValueChange={(itemValue) => setEditedAchieved(itemValue === 'Yes')} // Update achieved status based on picker selection
                        >
                            <Picker.Item label="Yes" value="Yes" />
                            <Picker.Item label="No" value="No" />
                        </Picker>
                    ) : (
                        <Text style={styles.value}>{milestone.achieved ? 'Yes' : 'No'}</Text>
                    )}
                </View>

                <View style={styles.titleContainer}>
                    <Text style={styles.label}>Date:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedDate}
                            onChangeText={setEditedDate}
                        />
                    ) : (
                        <Text style={styles.value}>{milestone.date}</Text>
                    )}
                </View>

                {isEditing && (
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveChanges}>
                        <Text style={styles.saveButtonText}>Save Changes</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 20,
        zIndex: 1,
    },
    editButton: {
        position: 'absolute',
        top: 40,
        right: 20,
        zIndex: 1,
    },
    scrollContainer: {
        paddingBottom: 100,
        marginTop: 60,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        flexShrink: 1,
        width: '70%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 15,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    value: {
        fontSize: 18,
        marginRight: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 5,
        width: '60%',
        marginRight: 10,
    },
    saveButton: {
        backgroundColor: '#007BFF',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default MilestoneView;
