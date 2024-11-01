// Imports
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Switch } from 'react-native';
import { auth } from '../config/firebase';
import { Ionicons } from "@expo/vector-icons";

 // Navigates to login Screen
const Settings = ({ route, navigation }) => {
 
    const [alerts, setAlerts] = useState(route.params.alerts);
    const [modalVisible, setModalVisible] = useState(false);
    const [appearanceModalVisible, setAppearanceModalVisible] = useState(false);
    const [isEnabled, setIsEnabled] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.navigate('Login');
        }).catch((error) => {
            console.error(error);
        });
    };

    // Placeholder functions for other buttons
    const handleAccount = () => {
        console.log('Account clicked');
    };

    const handleNotifications = () => {
         setModalVisible(true);
    };

    const handleAppearance = () => {
        setAppearanceModalVisible(true);
    };


    const handleHelpSupport = () => {
        console.log('Help & Support clicked');
    };

    const handleAbout = () => {
        console.log('About clicked');
    };

    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleDarkMode = () => setIsDarkMode(previousState => !previousState);
 
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleAccount} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="person" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Account</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNotifications} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="notifications" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Notifications</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAppearance} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="color-palette" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Appearance</Text>
                </View>
            </TouchableOpacity>
            {/*Pending Share Request Button */}
            <TouchableOpacity onPress={() => navigation.navigate('ShareRequests', { alerts })} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="share" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Pending Share Requests</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleHelpSupport} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="help-circle" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Help & Support</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleAbout} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="information-circle" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>About</Text>
                </View>
            </TouchableOpacity>
            {/* Sign Out Button */}
            <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                <View style={styles.logoutContent}>
                    <Ionicons name="log-out" size={42} color="black" />
                    <Text style={styles.logoutButtonText}>Sign out</Text>
                </View>
            </TouchableOpacity>
             {/* Notification Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Alert Notifications</Text>
                        <View style={styles.switchContainer}>
                            <Text>{isEnabled ? "Enabled" : "Disabled"}</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#cfe2f3" }}
                                thumbColor={isEnabled ? "black" : "black"}
                                onValueChange={toggleSwitch}
                                value={isEnabled}
                            />
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Appearance Modal */}
            <Modal
                transparent={true}
                animationType="slide"
                visible={appearanceModalVisible}
                onRequestClose={() => setAppearanceModalVisible(false)}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Appearance</Text>
                        <View style={styles.switchContainer}>
                            <Text>{isDarkMode ? "Dark Mode" : "Light Mode"}</Text>
                            <Switch
                                trackColor={{ false: "#767577", true: "#cfe2f3" }}
                                thumbColor={isDarkMode ? "black" : "black"}
                                onValueChange={toggleDarkMode}
                                value={isDarkMode}
                            />
                        </View>
                        <TouchableOpacity style={styles.closeButton} onPress={() => setAppearanceModalVisible(false)}>
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
        
    );
};

// Style Sheet
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#cfe2f3',
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    logoutButton: {
        padding: 15,
        width: '100%',
        alignItems: 'flex-start',
    },
    logoutContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    logoutButtonText: {
        color: 'black',
        fontSize: 32,
        marginLeft: 10,
    },
 modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: "white",
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
    },
    switchContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginBottom: 20,
    },
    closeButton: {
        backgroundColor: "#cfe2f3",
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: "black",
        fontWeight: "bold",
    },
});

export default Settings;
