import React, { createContext, useState, useEffect, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  StatusBar,
  FlatList,
} from 'react-native';
import { BASE_URL } from '../config';
export const ThemeContext = createContext();

export const AuthContext = createContext();

export default function ContextProvider({ children }) {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState('light');
  const [token, settoken] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedTheme = await AsyncStorage.getItem('theme');
      if (storedUser) setUser(JSON.parse(storedUser));
      if (storedTheme) setTheme(storedTheme);
    };
    loadData();
  }, []);

  const signup = async (userData) => {
    try {
      console.log("Userdata: ", userData);
      const response = await fetch(`${BASE_URL}/driver/signup`, {
        method: "POST",
        body: JSON.stringify(userData), // Serialize user data to JSON
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response: ", errorData);
        return { status: response.status, message: errorData.message || "An error occurred during signup" };
      }
  
      const resp2 = await response.json();
      console.log("Resp2: ", resp2);
  
      if (resp2.status === 201) { // Assuming 201 for successful creation
        // Optionally store token or user data locally if required
        const { token, message } = resp2;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify(userData));
  
        setUser(userData);
        settoken(token);
        return { status: 201, message: message || "User signed up successfully" };
      }
  
      return { status: resp2.status, message: resp2.message || "Signup failed" };
  
    } catch (error) {
      console.error("Error: ", error);
      return { status: 500, message: "An unexpected error occurred during signup" };
    }
  };
  

  const verifyEmail = async (userData) => {
    try {
      console.log("Userdata: ", userData);
      const response = await fetch(`${BASE_URL}/send_verification_otp`, {
        method: "POST",
        body: userData, // Serialize user data to JSON
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error Response: ", errorData);
        return { status: response.status, message: errorData.message || "An error occurred during signup" };
      }
  
      const resp2 = await response.json();
      console.log("Resp2: ", resp2);
  
      if (resp2.status === 200) { // Assuming 201 for successful creation
        // Optionally store token or user data locally if required

        return { status: 201, message: resp2.message, otp: resp2.otp || "Verification email sent" };
      }
  
      return { status: resp2.status, message: resp2.message || "Signup failed" };
  
    } catch (error) {
      console.error("Error: ", error);
      return { status: 500, message: "An unexpected error occurred during signup" };
    }
  };
  

  const login = async (userData) => {
    try {
      console.log("Userdata: ", userData)
      const response = await fetch(`${BASE_URL}/driver/login`, {
        method: "POST",
        body: userData, // Serialize user data to JSON
        headers: {
          "Content-Type": "application/json"
        }
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error: ", response)
        return { status: response.status, message: errorData.message || "An error occurred" };
      }
  
      const resp2 = await response.json();
      console.log("Resp2: ", resp2)
  
      if (resp2.status === 200) {
        // Save the user token and info
        const { token, message } = resp2;
        await AsyncStorage.setItem("token", token);
        await AsyncStorage.setItem("user", JSON.stringify({ email: userData.email }));
  
        setUser(userData);
        settoken(token)
        return { status: 200, message: message || "User logged in successfully" };
      }
  
      return { status: resp2.status, message: resp2.message || "Login failed" };
  
    } catch (error) {
      console.error("Error: ", error);
      return { status: 500, message: "An unexpected error occurred" };
    }
  };
  

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, token, verifyEmail, signup }}>
      <ThemeContext.Provider value={{ theme, toggleTheme }}>
        <StatusBar showHideTransition={true}   barStyle={ theme === 'dark' ? 'light-content' : 'dark-content'} />
        {children}
      </ThemeContext.Provider>
    </AuthContext.Provider>
  );
}
