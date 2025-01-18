import React, { useContext } from "react";
import { View, StyleSheet, Text, Platform } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Icon from "react-native-vector-icons/Feather"; // Import FontAwesome icons
import { ThemeContext } from "../context/AuthContext";
import * as Haptics from "expo-haptics";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
// Import screens
import HomeScreen from "../screens/DashboardScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import FoodDetailsScreen from "../screens/FoodDetailsScreen";
import ReviewsScreen from "../screens/ReviewsScreen";
import IncomingScreen from "../screens/IncomingScreen";
import SideMenuScreen from "../screens/SideMenuScreen";
import OrdersScreen from "../screens/OrdersScreen";
import TrackOrderScreen from "../screens/TrackOrderScreen";
import FavoritesScreen from "../screens/FavoriteScreen";
import { useFoodContext } from "../context/FoodContext";
import Profile from "../screens/ProfileScreen";
import AddNewAddress from "../screens/DeliveryAddress";
import PaymentMethod from "../screens/PaymentMethod";
import NotificationScreen from "../screens/Notification";
import CallScreen from "../screens/CallScreen";
import WalletScreen from "../screens/WalletScreen";
import SettingScreen from "../screens/SettingScreen";

import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "../components/Loader";
import DriverRegistration from "../screens/InfoScreen";
import RideDetails from "../screens/RideDetails";
import Performance from "../screens/Performance";
import CarType from "../screens/CarType";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNavigator() {
  const { theme } = useContext(ThemeContext);
  const { cart, removeFromCart } = useFoodContext();
  const insets = useSafeAreaInsets();;
  // console.log(insets)
  const isDarkTheme = theme === "dark";
  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }
  
  const styles = StyleSheet.create({
    tabBar: {
      backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
      borderTopWidth: 1,
      borderTopColor: isDarkTheme ? "#333333" : "#E5E7EB",
      height:  60,
      paddingTop:  6,
      paddingHorizontal: 16,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
    },
    tabBarIcon: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: Platform.OS === "android" ? 10 : 0,
      objectFit: 'contain'
    },
    tabBarBadge: {
      backgroundColor: "#DC2626",
      color: "#FFFFFF",
      fontSize: 10,
      minWidth: 16,
      height: 16,
      borderRadius: 8,
      paddingHorizontal: 4,
      textAlign: "center",
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      lineHeight: 16,
      position: "absolute",
      top: -4,
      right: -8,
      fontFamily: "Livvic_700Bold"
    },
  });

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color }) => {
          const iconSize = 30;
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home";
              break;
            case "Settings":
              iconName = "settings";
              break;
            case "Wallet":
              iconName = "credit-card";
              break;
          }

          return (
            <View style={styles.tabBarIcon}>
              <Icon
                name={iconName}
                size={iconSize}
                color={focused ? "#DC2626" : isDarkTheme ? "#9CA3AF" : "#6B7280"}
              />
              {route.name === "Cart" && cart && cart.length > 0 && (
                <View style={styles.tabBarBadge}>
                  <Text style={{ color: "#FFFFFF", fontSize: 10, fontWeight: 'bold',fontFamily: "Livvic_700Bold" }}>{cart.length}</Text>
                </View>
              )}
            </View>
          );
        },
        tabBarLabel: ({ focused, color }) => (
          <Text style={{
            fontSize: 10,
            fontWeight: '500',
            color: focused ? "#DC2626" : color,
            marginBottom: Platform.OS === "android" ? 4 : 0,
            fontFamily: "Livvic_700Bold"
            
          }}>
            {route.name}
          </Text>
        ),
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
        headerStyle: {
          backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
        },
        headerTintColor: isDarkTheme ? "#FFFFFF" : "#000000",
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
     
      
      <Tab.Screen
        name="Wallet"
        component={WalletScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
      
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{ headerShown: false }}
        listeners={{
          tabPress: () =>
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppStack() {
  const { theme } = useContext(ThemeContext);
  const isDarkTheme = theme === "dark";

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: isDarkTheme ? "#1A1A1A" : "#FFFFFF",
        },
        headerTintColor: isDarkTheme ? "#FFFFFF" : "#000000",
      }}
    >
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Favorites"
        component={FavoritesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Info"
        component={DriverRegistration}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FoodDetails"
        component={FoodDetailsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="TrackOrder"
        component={TrackOrderScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Orders"
        component={OrdersScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Reviews"
        component={ReviewsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Incoming"
        component={IncomingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Profile"
        component={Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DeliveryAddress"
        component={AddNewAddress}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="PaymentMethods"
        component={PaymentMethod}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notification"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RideDetails"
        component={RideDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Performance"
        component={Performance}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CarType"
        component={CarType}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CallScreen"
        component={CallScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
    </Stack.Navigator>
  );
}

