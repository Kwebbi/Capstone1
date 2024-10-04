import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ref, update, remove } from 'firebase/database';
import { database } from '../config/firebase';

// MilestoneView component
const MilestoneView = ({ navigation, route }) => {
    // Extract milestone, babyID, fullName, and milestoneId from route parameters
    const { milestone, babyID, fullName, milestoneId } = route.params;

    // State to toggle between editing and viewing mode
    const [isEditing, setIsEditing] = useState(false);
    
    // State for tracking and updating the title, description, and date of the milestone
    const [editedTitle, setEditedTitle] = useState(milestone.title); // Initialized with the existing title
    const [editedDescription, setEditedDescription] = useState(milestone.description); // Initialized with the existing description
    const [editedDate, setEditedDate] = useState(milestone.date); // Initialized with the existing date

    // Function to switch to edit mode
    const handleEditPress = () => {
        setIsEditing(true); // Enable editing mode
        console.log("Editing mode enabled");
    };

    // Function to save changes to Firebase and disable edit mode
    const handleSaveChanges = () => {
        const milestoneRef = ref(database, `babies/${babyID}/milestone/${milestoneId}`); // Reference to the specific milestone in Firebase

        // Update milestone fields in Firebase
        update(milestoneRef, {
            title: editedTitle,
            description: editedDescription, // Just save the description string
            date: editedDate,
        }).then(() => {
            setIsEditing(false); // Exit editing mode
            console.log("Milestone updated successfully:", { title: editedTitle, description: editedDescription, date: editedDate });
        }).catch((error) => {
            console.error("Error updating milestone: ", error); // Log any errors during the update
        });
    };

    // Function to handle milestone deletion
    const handleDeleteMilestone = () => {
        Alert.alert(
            "Delete Milestone",
            "Are you sure you want to delete this milestone?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: () => deleteMilestone(), // Call deleteMilestone if confirmed
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    // Function to delete milestone from Firebase
    const deleteMilestone = () => {
        const milestoneRef = ref(database, `babies/${babyID}/milestone/${milestoneId}`);
        
        remove(milestoneRef)
            .then(() => {
                console.log("Milestone deleted successfully");
                navigation.goBack(); // Navigate back after deletion
            })
            .catch((error) => {
                console.error("Error deleting milestone: ", error); // Log any errors during deletion
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
                    <Text style={styles.label}>Title:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedTitle}
                            onChangeText={setEditedTitle}
                        />
                    ) : (
                        <Text style={styles.value}>{editedTitle}</Text>
                    )}
                </View>
                
                <View style={styles.titleContainer}>
                    <Text style={styles.label}>Description:</Text>
                    {isEditing ? (
                        <TextInput
                            style={styles.input}
                            value={editedDescription} // Use the description string directly
                            onChangeText={setEditedDescription} // Update description string directly
                        />
                    ) : (
                        <Text style={styles.value}>{milestone.description}</Text> // Display the description directly
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

                {/* Delete Milestone Button */}
                <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteMilestone}>
                    <Text style={styles.deleteButtonText}>Delete Milestone</Text>
                </TouchableOpacity>
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
    deleteButton: {
        backgroundColor: '#FF3B30',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});

export default MilestoneView;
