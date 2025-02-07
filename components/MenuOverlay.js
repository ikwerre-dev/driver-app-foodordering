import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
} from "react-native";
import Icon from 'react-native-vector-icons/Feather';
import { useFonts } from "expo-font";
import jwt_decode from 'jwt-decode'
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from '../components/Loader';
import { AuthContext, ThemeContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

const getStyles = (theme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 0,
      left: 0,
      bottom: 0,
      width: "70%",
      backgroundColor: theme === "light" ? "#FFFFFF" : "#000000",
      zIndex: 1000,
    },
    content: {
      flex: 1,
      padding: 20,
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    profileSection: {
      alignItems: "flex-start",
      marginTop: 40,
      marginBottom: 50,
    },
    profileImageContainer: {
      width: 80,
      height: 80,
      borderRadius: 60,
      backgroundColor: theme === "light" ? "#F0F0F0" : "#121212",
      padding: 1,
      marginBottom: 20,
    },
    profileImage: {
      width: "100%",
      height: "100%",
      borderRadius: 60,
    },
    profileName: {
      color: theme === "light" ? "#000000" : "#FFFFFF",
      fontSize: 25,
      fontWeight: "bold",
      marginBottom: 8,
      fontFamily: "Livvic_700Bold",
    },
    profileEmail: {
      color: "#666",
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
    },
    menuItems: {
      flex: 1,
      gap: 25,
      paddingBottom:50
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuIconContainer: {
      width: 40,
      justifyContent: "center",
    },
    menuItemText: {
      fontSize: 18,
      marginLeft: 15,
      fontFamily: "Livvic_400Regular",
    },
    logoutButton: {
      marginBottom: 30,
      paddingTop:15
    },
    logoutContent: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#DC2626",
      padding: 16,
      borderRadius: 30,
      gap: 10,
      
    },
    logoutText: {
      color: "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
      fontFamily: "Livvic_400Regular",
    },
  });

export default function MenuOverlay({ isOpen, onClose, translateX }) {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const [token, setToken] = useState(null)
  const [fullName, setfullName] = useState("...")
  const [email, setEmail] = useState("...")
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const main = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const main = jwt_decode(token)
        const {fullname, email} = main;
        setfullName(fullname)
        setEmail(email)
        setToken(token)
      } catch (error) {
        console.log("Error: ", error)
      }
    }

    main()
  }, [])

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

  const handleNavigation = (screenName) => {
    onClose();
    navigation.navigate(screenName);
  };

  const MenuItem = ({ icon, title, onPress, color }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        {icon}
      </View>
      <Text style={[styles.menuItemText, { color }]}>{title}</Text>
    </TouchableOpacity>
  );

  const menuItems = [
    { icon: <Icon name="shopping-bag" color={theme === "light" ? "#000" : "#fff"} size={24} />, title: "My Orders", screen: "Orders" },
    { icon: <Icon name="user" color={theme === "light" ? "#000" : "#fff"} size={24} />, title: "My Profile", screen: "Profile" },
    { icon: <Icon name="credit-card" color={theme === "light" ? "#000" : "#fff"} size={24} />, title: "Withdrawal Method", screen: "PaymentMethods" },
    { icon: <Icon name="bell" color={theme === "light" ? "#000" : "#fff"} size={24} />, title: "Notification", screen: "Notification" },
    {
      icon: theme === "light" ? <Icon name="moon" color={theme === "light" ? "#000" : "#fff"} size={24} /> : <Icon name="sun" color={theme === "light" ? "#000" : "#fff"} size={24} />,
      title: `${theme === "light" ? "Dark" : "Light"} Mode`,
      onPress: toggleTheme,
    },
  ];

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: "https://i.pravatar.cc/150?img=3" }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.profileName}>{fullName}</Text>
          <Text style={styles.profileEmail}>{email}</Text>
        </View>

        <ScrollView>
          <View style={styles.menuItems}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={index}
                icon={item.icon}
                title={item.title}
                onPress={item.onPress || (() => handleNavigation(item.screen))}
                color={theme === "light" ? "#000" : "#fff"}
              />
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutContent}>
            <Icon name="log-out" color="#FFFFFF" size={24} />
            <Text style={styles.logoutText}>Log Out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}