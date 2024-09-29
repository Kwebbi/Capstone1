//BabyMilestones.js
import React, { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { ref, onValue } from 'firebase/database';
import { database } from '../config/firebase';
import Timeline from 'react-native-timeline-flatlist';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

// Define the BabyMilestones component
const BabyMilestones = ({ route }) => {
    const { babyId, babyName } = route.params; // Extract babyId and babyName from navigation parameters
    const [milestones, setMilestones] = useState([]); // State to store milestones
    const [loading, setLoading] = useState(true); // State to track loading status
    const navigation = useNavigation(); // Hook to get navigation prop

    // Effect to fetch milestones when the component mounts or babyId changes
    useEffect(() => {
        const milestonesRef = ref(database, `babies/${babyId}/milestone`);  // Reference to the Firebase path for milestones
        // Subscribe to the value at the reference
        onValue(milestonesRef, (snapshot) => {
            if (snapshot.exists()) { // Check if milestones exist
                const data = snapshot.val(); // Get the data from the snapshot
                const milestonesArray = Object.keys(data).map((key) => ({
                    milestoneId: key, // Add milestoneId from the Firebase key
                    ...data[key], // Spread the milestone data (title, achieved, date, etc.)
                }));

                // Sort milestones by date (earliest first)
                milestonesArray.sort((a, b) => {
                    const dateA = new Date(a.date.split('/').reverse().join('-')); // Convert to YYYY-MM-DD
                    const dateB = new Date(b.date.split('/').reverse().join('-')); // Convert to YYYY-MM-DD
                    return dateA - dateB; // Sort by date
                });

                // Log the sorted milestones to verify
                console.log("Sorted Milestones:", milestonesArray);

                // Set the sorted milestones to state
                setMilestones(milestonesArray);
            } else {
                console.log("No milestones found."); // Log if no milestones exist
                setMilestones([]); // Set milestones state to an empty array
            }
            setLoading(false); // Update loading state
        });
    }, [babyId]); // Dependency array: effect runs when babyId changes

    // Map milestones to the format required by the Timeline component
    const timelineData = milestones.map((milestone) => ({
        time: milestone.date, // date from Firebase
        title: milestone.title, // title from Firebase
        description: milestone.achieved ? 'Achieved' : 'Not Achieved', // description from Firebase
        onPress: () => handleMilestonePress(milestone), // onPress handler for each milestone
    }));

     // Function to handle milestone press
    const handleMilestonePress = (milestone) => {
        console.log("Milestone pressed:", milestone); // Log the pressed milestone for debugging
        // Navigate to the MilestoneView screen with necessary parameters
        navigation.navigate('MilestoneView', { 
            milestone, 
            milestones,
            babyId, // Pass babyId
            babyName, // Pass babyName
            milestoneId: milestone.milestoneId, // Pass milestoneId
        });
    };

    // Function to render the details of each milestone in the timeline
    const renderDetail = (rowData) => (
        <TouchableOpacity onPress={rowData.onPress} style={styles.timelineItem}>
            <Text style={styles.title}>{rowData.title}</Text>
            <Text style={styles.description}>{rowData.description}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.title}>{babyName}'s Milestones</Text>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                <Timeline
                    data={timelineData}
                    circleSize={20}
                    circleColor="black"
                    lineColor="gray"
                    timeContainerStyle={{ minWidth: 52 }}
                    descriptionStyle={{ color: 'gray' }}
                    innerCircle={'dot'}
                    options={{
                        style: { paddingTop: 5 },
                        removeClippedSubviews: false
                    }}
                    columnFormat='two-column'
                    separator={true}
                    renderDetail={renderDetail} // Use custom render function
                />
            )}
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
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: 20,
        textAlign: 'center',
    },
    timelineItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    description: {
        color: 'gray',
    },
});

export default BabyMilestones;
