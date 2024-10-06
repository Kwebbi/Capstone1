// Imports
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { auth } from '../config/firebase';
import { Ionicons } from "@expo/vector-icons";

 // Navigates to login Screen
const Settings = ({ route, navigation }) => {

    const [alerts, setAlerts] = useState(route.params.alerts); //pass alerts from profile screen

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
        console.log('Notifications clicked');
    };

    const handleAppearance = () => {
        console.log('Appearance clicked');
    };


    const handleHelpSupport = () => {
        console.log('Help & Support clicked');
    };

    const handleAbout = () => {
        console.log('About clicked');
    };

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
                    <Text style={styles.logoutButtonText}>Pending Share Request</Text>
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
});

export default Settings;
