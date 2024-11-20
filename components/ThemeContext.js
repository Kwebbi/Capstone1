import React, { createContext, useState, useContext, useEffect } from "react";
import { auth, database } from "../config/firebase";
import { ref, get, set } from "firebase/database";

// Create the context
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleDarkMode = () => setIsDarkMode((prevMode) => !prevMode);

    // Fetch theme preference from Firebase on mount
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId) {
            const themeRef = ref(database, `users/${userId}/theme`);
            get(themeRef).then((snapshot) => {
                if (snapshot.exists()) {
                    setIsDarkMode(snapshot.val() === "dark"); // Set theme based on stored value
                }
            }).catch((error) => {
                console.error("Error fetching theme: ", error);
            });
        }
    }, []);

    // Save theme preference to Firebase
    useEffect(() => {
        const userId = auth.currentUser?.uid;
        if (userId && isDarkMode !== null) {
            const themeRef = ref(database, `users/${userId}/theme`);
            set(themeRef, isDarkMode ? "dark" : "light")
                .then(() => {
                    console.log('Theme preference saved to Firebase');
                })
                .catch((error) => {
                    console.error('Error saving theme preference: ', error);
                });
        }
    }, [isDarkMode]);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Custom hook for using the ThemeContext
export const useTheme = () => useContext(ThemeContext);
