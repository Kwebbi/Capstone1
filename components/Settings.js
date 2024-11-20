import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Modal, Switch, ScrollView } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { ref, set, get } from "firebase/database"; // import necessary Firebase functions
import { useTheme } from "../components/ThemeContext"; // assuming you have this context for theme
import { auth, database } from "../config/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage'; // import AsyncStorage

const Settings = ({ route, navigation }) => {
    const [alerts, setAlerts] = useState(route.params?.alerts || null);
    const [modalVisible, setModalVisible] = useState(false);
    const [appearanceModalVisible, setAppearanceModalVisible] = useState(false); // Appearance modal state
    const [isEnabled, setIsEnabled] = useState(false);

    const { isDarkMode, toggleDarkMode } = useTheme();
    const userId = auth.currentUser?.uid;

    // Fetch theme preference on component mount (only once)
    useEffect(() => {
        const loadTheme = async () => {
            // Check if the theme preference exists in Firebase (always read from Firebase first)
            if (userId) {
                const themeRef = ref(database, `users/${userId}/theme`);
                try {
                    const snapshot = await get(themeRef);
                    if (snapshot.exists()) {
                        const theme = snapshot.val();
                        const isDark = theme === "dark";
                        // Only update if the Firebase theme differs from the current theme
                        if (isDark !== isDarkMode) {
                            toggleDarkMode(isDark);
                            setIsEnabled(isDark); // Update toggle state
                        }
                    } else {
                        // If theme does not exist in Firebase, use AsyncStorage as fallback
                        const storedTheme = await AsyncStorage.getItem('theme');
                        if (storedTheme) {
                            const isDark = storedTheme === "dark";
                            // Update the state with the stored theme
                            toggleDarkMode(isDark);
                            setIsEnabled(isDark); // Update toggle state
                        }
                    }
                } catch (error) {
                    console.error("Error fetching theme from Firebase: ", error);
                }
            }
        };
    
        loadTheme();
    }, [userId, toggleDarkMode, isDarkMode]);
    
    // Save theme preference to Firebase and AsyncStorage when toggled
    const saveThemePreference = async (isDarkMode) => {
        if (userId) {
            const themeRef = ref(database, `users/${userId}/theme`);
            try {
                await set(themeRef, isDarkMode ? "dark" : "light");
                console.log('Theme preference saved to Firebase');
            } catch (error) {
                console.error('Error saving theme preference: ', error);
            }
        }
    
        // Save to AsyncStorage as well
        await AsyncStorage.setItem('theme', isDarkMode ? "dark" : "light");
    };
    
    // Toggle the switch and save the new preference to Firebase and AsyncStorage
    const toggleSwitch = () => {
        setIsEnabled((previousState) => {
            const newValue = !previousState;
            if (newValue !== isDarkMode) {
                toggleDarkMode(newValue); // Toggle the global theme context
                saveThemePreference(newValue); // Save to Firebase and AsyncStorage
            }
            return newValue;
        });
    };
    
    const handleLogout = () => {
        auth.signOut().then(() => {
            navigation.navigate('Login');
        }).catch((error) => {
            console.error(error);
        });
    };

    const handleAccount = () => {
        console.log('Account clicked');
    };

    const handleNotifications = () => {
        setModalVisible(true);
    };

    const handleAppearance = () => {
        setAppearanceModalVisible(true); // Show the Appearance modal
    };

    const handleHelpSupport = () => {
        console.log('Help & Support clicked');
    };

    const handleAbout = () => {
        console.log('About clicked');
    };

    return (
        <ScrollView
            automaticallyAdjustKeyboardInsets={true}
            style={{ backgroundColor: isDarkMode ? "black" : "#cfe2f3" }}
        >
            <View style={{ backgroundColor: isDarkMode ? "black" : "#cfe2f3" }}>
                <SafeAreaView style={{ flex: 0 }}>
                    <View style={[styles.container, { backgroundColor: isDarkMode ? "black" : "#cfe2f3" }]}>
                        <TouchableOpacity style={{ position: "absolute", left: 22, top: 40 }} onPress={() => navigation.navigate('Profiles')}>
                            <Ionicons name="arrow-back" size={30} color={isDarkMode ? "white" : "black"} />
                        </TouchableOpacity>
                        <Text style={[styles.titleText, { color: isDarkMode ? "white" : "black" }]}>Settings</Text>
                    </View>
                </SafeAreaView>
    
                <View style={[styles.container, { backgroundColor: isDarkMode ? "black" : "#cfe2f3" }]}>
                    <TouchableOpacity onPress={handleAccount} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="person" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Account</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={handleNotifications} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="notifications" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Notifications</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={handleAppearance} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="settings" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Appearance</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={() => navigation.navigate('ShareRequests', { alerts })} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="share" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Pending Share Requests</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={handleHelpSupport} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="help-circle" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Help & Support</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={() => navigation.navigate('About')} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="information-circle" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>About</Text>
                        </View>
                    </TouchableOpacity>
    
                    <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                        <View style={styles.logoutContent}>
                            <Ionicons name="log-out" size={42} color={isDarkMode ? "white" : "black"} />
                            <Text style={[styles.logoutButtonText, { color: isDarkMode ? "white" : "black" }]}>Sign out</Text>
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
                                    {/* Dummy Switch */}
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={() => {}}
                                        value={isEnabled}
                                        disabled={true} // Disable the switch functionality
                                    />
                                </View>
    
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
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
                                <Text style={styles.modalTitle}>Appearance Settings</Text>
    
                                <View style={styles.switchContainer}>
                                    <Text>{isEnabled ? "Dark Mode" : "Light Mode"}</Text>
                                    <Switch
                                        trackColor={{ false: "#767577", true: "#81b0ff" }}
                                        thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
                                        ios_backgroundColor="#3e3e3e"
                                        onValueChange={toggleSwitch}
                                        value={isEnabled}
                                    />
                                </View>
    
                                <TouchableOpacity onPress={() => setAppearanceModalVisible(false)} style={styles.closeButton}>
                                    <Text style={styles.closeButtonText}>Close</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
    
                </View>
                </View>
            </ScrollView>
        
    );
    
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
    },
    titleText: {
        fontSize: 28,
        fontWeight: "bold",
        marginTop: 40,
    },
    logoutButton: {
        marginTop: 20,
        padding: 15,
        width: "80%",
    },
    logoutContent: {
        flexDirection: "row",
        alignItems: "center",
    },
    logoutButtonText: {
        marginLeft: 10,
        fontSize: 18,
    },
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContainer: {
        width: "80%",
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: "bold",
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    closeButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
    closeButtonText: {
        color: "white",
        fontWeight: "bold",
    },
});

export default Settings;
