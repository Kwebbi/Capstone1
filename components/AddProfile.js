import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, TouchableOpacity, Modal, TextInput, Button, Platform } from 'react-native';
import { ref, onValue, push } from 'firebase/database';
import { database } from '../config/firebase';
import Timeline from 'react-native-timeline-flatlist';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "../components/ThemeContext";  // Make sure to import this

// Define the BabyMilestones component
const BabyMilestones = ({ route }) => {
    const { fullName, babyID } = route.params;

    const [milestones, setMilestones] = useState([]); // State for storing milestones
    const [loading, setLoading] = useState(true); // Loading state
    const [modalVisible, setModalVisible] = useState(false); // State for controlling the modal visibility
    const [newTitle, setNewTitle] = useState(''); // State for new milestone title
    const [newDescription, setNewDescription] = useState(''); // State for new milestone description
    const [selectedDate, setSelectedDate] = useState(new Date()); // State for selected date
    const [showDatePicker, setShowDatePicker] = useState(false); // State for showing the date picker
    const navigation = useNavigation();

    // Dark mode settings from ThemeContext
    const { isDarkMode, toggleDarkMode } = useTheme();

    // Effect to fetch milestones from Firebase on component mount
    useEffect(() => {
        const milestonesRef = ref(database, `babies/${babyID}/milestone`);
        onValue(milestonesRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const milestonesArray = Object.keys(data).map((key) => ({
                    milestoneId: key,
                    ...data[key],
                }));

                // Sort milestones by date
                milestonesArray.sort((a, b) => {
                    const dateA = new Date(a.date.split('/').join('-'));
                    const dateB = new Date(b.date.split('/').join('-'));
                    return dateA - dateB;
                });

                setMilestones(milestonesArray);
            } else {
                setMilestones([]); // No milestones found
            }
            setLoading(false); // Stop loading
        });
    }, [babyID]);

    // Map milestones to timeline data
    const timelineData = milestones.map((milestone) => ({
        time: milestone.date,
        title: milestone.title,
        description: milestone.description,
        onPress: () => handleMilestonePress(milestone),
    }));

    // Function to navigate to MilestoneView on milestone press
    const handleMilestonePress = (milestone) => {
        navigation.navigate('MilestoneView', { 
            milestone, 
            babyID, 
            fullName, 
            milestoneId: milestone.milestoneId,
        });
    };

    // Function to handle adding a new milestone
    const handleAddMilestone = () => {
        const newMilestoneRef = ref(database, `babies/${babyID}/milestone`);
        const newMilestone = {
            title: newTitle,
            description: newDescription,
            date: selectedDate.toLocaleDateString(), // Use the selected date
        };
        
        // Push new milestone to the database
        push(newMilestoneRef, newMilestone)
            .then(() => {
                console.log("New milestone added:", newMilestone); // Log new milestone details
                setModalVisible(false); // Close modal after saving
                setNewTitle(''); // Reset input fields
                setNewDescription('');
                setSelectedDate(new Date()); // Reset selected date
            })
            .catch((error) => {
                console.error("Error adding milestone: ", error); // Log any errors during the addition
            });
    };

    // Function to render timeline item detail
    const renderDetail = (rowData) => (
        <TouchableOpacity onPress={rowData.onPress}>
            <Text style={styles.title}>{rowData.title}</Text>
            <Text style={styles.description}>{rowData.description}</Text>
        </TouchableOpacity>
    );

    // Apply dynamic styles for dark and light mode
    const containerStyle = isDarkMode ? styles.darkContainer : styles.lightContainer;
    const titleTextStyle = isDarkMode ? styles.darkTitleText : styles.lightTitleText;
    const textStyle = isDarkMode ? styles.darkText : styles.lightText;
    const backgroundColor = isDarkMode ? 'black' : '#cfe2f3'; // Dark or light background
    const iconColor = isDarkMode ? '#f1f1f1' : '#28436d'; // Dark or light icon color

    // Modal styles for dark and light mode
    const modalBackgroundColor = isDarkMode ? '#333' : 'white'; // Modal background color
    const modalTextColor = isDarkMode ? '#1E90FF' : '#1E90FF'; // Modal text color
    const inputBackgroundColor = isDarkMode ? '#444' : '#f0f0f0'; // Input field background color
    const inputTextColor = isDarkMode ? 'white' : 'black'; // Input text color

    return (
        <View style={[styles.container, { backgroundColor }]}>
            <TouchableOpacity style={{ position: 'absolute', left: 17, top: 82, zIndex: 10 }} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color={iconColor} />
            </TouchableOpacity>
            <Text style={[titleTextStyle, { textAlign: 'center', marginVertical: 60, fontSize: 24, fontWeight: 'bold' }]}>{fullName}'s Milestones</Text>

            {/* Add Milestone Button */}
            <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
                <Text style={styles.addButtonText}>Add Milestone</Text>
            </TouchableOpacity>

            {/* Loading indicator while fetching milestones */}
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Timeline
                    data={timelineData}
                    circleSize={20}
                    innerCircle={'dot'}
                    circleColor='rgb(45,156,219)'
                    lineColor='rgb(45,156,219)'
                    timeStyle={{ textAlign: 'center', backgroundColor: '#ff9797', color: 'white', padding: 5, borderRadius: 13 }}
                    timeContainerStyle={{ minWidth: 100 }}
                    descriptionStyle={{ color: 'gray' }}
                    options={{
                        style: { paddingTop: 5 },
                        removeClippedSubviews: false
                    }}
                    separator={true}
                    renderDetail={renderDetail}
                />
            )}

            {/* Modal for adding a new milestone */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={[styles.modalContainer, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}>
                    <View style={[styles.modalContent, { backgroundColor: modalBackgroundColor }]}>
                        <Text style={[styles.modalTitle, { color: '#1E90FF', textAlign: 'center' }]}>Add New Milestone</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: inputBackgroundColor, color: inputTextColor }]}
                            placeholder="Title"
                            value={newTitle}
                            onChangeText={setNewTitle}
                            placeholderTextColor="#c2c2c2"
                        />
                        <TextInput
                            style={[styles.input, { backgroundColor: inputBackgroundColor, color: inputTextColor }]}
                            placeholder="Description"
                            value={newDescription}
                            onChangeText={setNewDescription}
                            placeholderTextColor="#c2c2c2"
                        />
                        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                            <Text style={[styles.dateText, { color: modalTextColor, textAlign: 'center' }]}>{selectedDate.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <View>
                                <DateTimePicker
                                    value={selectedDate}
                                    mode="date"
                                    display="spinner"
                                    onChange={(event, date) => {
                                        if (Platform.OS === 'android') {
                                            setShowDatePicker(false);
                                        }
                                        if (date) {
                                            setSelectedDate(date);
                                        }
                                    }}
                                    textColor="black"
                                />
                                {Platform.OS === 'ios' && (
                                    <Button
                                        title="Done"
                                        onPress={() => setShowDatePicker(false)}
                                    />
                                )}
                            </View>
                        )}
                        <Button title="Add Milestone" onPress={handleAddMilestone} />
                        <View style={{ height: 15 }} />
                        <Button title="Cancel" onPress={() => setModalVisible(false)} color="red" />
                    </View>
                </View>
            </Modal>
        </View>
    );
};

// Styles including dynamic color changes for light/dark mode
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
    },
    lightContainer: {
        backgroundColor: '#cfe2f3',
    },
    darkContainer: {
        backgroundColor: 'black',
    },
    lightText: {
        color: 'black',
    },
    darkText: {
        color: 'white',
    },
    lightTitleText: {
        color: '#28436d',
    },
    darkTitleText: {
        color: '#f1f1f1',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16,
    },
    description: {
        color: 'gray',
    },
    addButton: {
        padding: 10,
        backgroundColor: '#007bff',
        alignItems: 'center',
        marginBottom: 10,
        borderRadius: 5,
    },
    addButtonText: {
        color: 'white',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
    },
    dateText: {
        fontSize: 16,
        marginBottom: 10,
    },
});

export default BabyMilestones;
