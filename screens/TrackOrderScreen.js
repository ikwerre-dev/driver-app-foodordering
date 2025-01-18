import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Dimensions,
  Linking,
  ScrollView,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import Icon from "react-native-vector-icons/Feather";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import AppLoading from "../components/Loader";
import { ThemeContext } from "../context/AuthContext";
import * as Location from "expo-location";
import { useNavigation, useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("window");

const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    elementType: "labels.text.fill",
    stylers: [
      {
        color: "#757575",
      },
    ],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [
      {
        color: "#212121",
      },
    ],
  },
  {
    featureType: "road",
    elementType: "geometry.fill",
    stylers: [
      {
        color: "#2c2c2c",
      },
    ],
  },
];

const CustomMarker = ({ icon, color }) => {
  return (
    <View
      style={{
        backgroundColor: "rgba(0,0,0,0.7)",
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: color,
      }}
    >
      <Icon name={icon} size={20} color={color} />
    </View>
  );
};

const getStyles = (theme) =>
  StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    container: {
      flex: 1,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    headerBelow: {
      flexDirection: "row",
      alignItems: "center",
      padding: 20,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor:
        theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      color: theme === "light" ? "#000000" : "#FFFFFF",
      fontFamily: "Poppins_700Bold",
    },
    map: {
      width: width,
      height: width * 0.5,
    },
    scrollView: {
      flex: 1,
    },
    scrollViewContent: {
      flexGrow: 1,
      paddingBottom: 80,
    },
    contentContainer: {
      padding: 20,
    },
    infoCard: {
      backgroundColor: theme === "light" ? "#F3F4F6" : "rgba(32, 33, 35, 0.9)",
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor:
        theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
    },
    infoIcon: {
      width: 24,
      marginRight: 12,
    },
    infoLabel: {
      color: theme === "light" ? "#000000" : "#FFFFFF",
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
    },
    infoValue: {
      color: theme === "light" ? "#6B7280" : "#9CA3AF",
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
      marginLeft: "auto",
    },
    actionButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor: theme === "light" ? "#F3F4F6" : "rgba(32, 33, 35, 0.9)",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    actionButton: {
      alignItems: "center",
      flex: 1,
    },
    actionButtonText: {
      color: theme === "light" ? "#000000" : "#FFFFFF",
      marginTop: 4,
      fontSize: 14,
      fontFamily: "Livvic_400Regular",
    },
    separator: {
      width: 1,
      backgroundColor:
        theme === "light" ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.1)",
      marginHorizontal: 8,
    },
    callButtons: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 16,
    },
    callButton: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme === "light" ? "#F3F4F6" : "rgba(32, 33, 35, 0.9)",
      borderRadius: 25,
      padding: 12,
      marginHorizontal: 8,
    },
    callButtonText: {
      color: "#B25E09",
      marginLeft: 8,
      fontSize: 16,
      fontFamily: "Livvic_400Regular",
    },
    okayButtonContainer: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: theme === "light" ? "#FFFFFF" : "#101112",
    },
    okayButton: {
      backgroundColor: "#DC2626",
      borderRadius: 25,
      padding: 16,
      alignItems: "center",
    },
    okayButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontFamily: "Poppins_700Bold",
    },
  });

const TrackOrderScreen = () => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  const [isLoading, setIsLoading] = useState(false);

  const [currentLocation, setCurrentLocation] = useState(null);
  const [shopLocation, setShopLocation] = useState(null);
  const [homeLocation, setHomeLocation] = useState(null);
  const mapRef = useRef(null);
  const route = useRoute()
  const navigation = useNavigation()
  const {data} = route.params


  // Note: Replace 'YOUR_GOOGLE_MAPS_API_KEY' with your actual Google Maps API key
  const GOOGLE_MAPS_API_KEY = "AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY";
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      // Set shop and home locations
      setShopLocation({
        latitude: location.coords.latitude + 0.04,
        longitude: location.coords.longitude + 0.04,
      });
      setHomeLocation({
        latitude: location.coords.latitude - 0.01,
        longitude: location.coords.longitude - 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    if (currentLocation && shopLocation && homeLocation && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [currentLocation, shopLocation, homeLocation],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        },
      );
    }
  }, [currentLocation, shopLocation, homeLocation]);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const handlePhoneCall = async () => {
    setIsLoading(true);
    try {
      await Linking.openURL("tel:+2349163169949");
    } catch (error) {
      console.error("Failed to make the call:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBelow}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Icon
              name="chevron-left"
              color={theme === "light" ? "#000000" : "#FFFFFF"}
              size={24}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Past Rides</Text>
        </View>

        {currentLocation && shopLocation && homeLocation &&
          <MapView
            style={styles.map}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            customMapStyle={theme === "light" ? [] : darkMapStyle}
            mapType="standard"
            showsBuilding={true}
            showsTraffic
          
          
          >
          
            <MapViewDirections
              origin={shopLocation}
              destination={homeLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="#22C55E"
              optimizeWaypoints={true}
            />
            <MapViewDirections
              origin={currentLocation}
              destination={shopLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#FDB813"
              optimizeWaypoints={true}
            />
            
            <Marker coordinate={currentLocation}>
              <CustomMarker icon="navigation" color="#FDB813" />
            </Marker>
            <Marker coordinate={shopLocation}>
              <CustomMarker icon="shopping-bag" color="#DC2626" />
            </Marker>
            <Marker coordinate={homeLocation}>
              <CustomMarker icon="home" color="#22C55E" />
            </Marker>
          </MapView>
        }
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollViewContent}
          showsVerticalScrollIndicator={true}
          indicatorStyle={theme === "light" ? "black" : "white"}
        >
          <View style={styles.contentContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Icon
                  name="clock"
                  size={20}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                  style={styles.infoIcon}
                />
                <Text style={[styles.infoLabel,{
                  backgroundColor: '#FFA500',
                  paddingHorizontal: 5,
                  paddingVertical:5,
                  color: '#000',
                  fontWeight: "bold",
                  fontFamily: "Livvic_700Bold",
                  borderRadius:10,
                  fontSize:12
                }]}>{data.status}</Text>
              </View>
              <View style={styles.infoRow}>
                <Icon
                  name="user"
                  size={20}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoLabel}>Customer Name</Text>
                <Text style={styles.infoValue}>{data.customer_name}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Icon
                  name="map-pin"
                  size={20}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                  style={styles.infoIcon}
                />
                <Text style={styles.infoLabel}>
                   {data.delivery_address}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Icon
                  name="phone"
                  size={24}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                />
                <Text style={styles.actionButtonText}>Contact</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.actionButton}>
                <Icon
                  name="map"
                  size={24}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                />
                <Text style={styles.actionButtonText}>Get Directions</Text>
              </TouchableOpacity>
              <View style={styles.separator} />
              <TouchableOpacity style={styles.actionButton}>
                <Icon
                  name="file-text"
                  size={24}
                  color={theme === "light" ? "#000000" : "#FFFFFF"}
                />
                <Text style={styles.actionButtonText}>Details</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.callButtons}>
              <TouchableOpacity
                style={styles.callButton}
                onPress={() => navigation.push("CallScreen", { riderId: 100 })}
              >
                <Icon name="phone" size={20} color="#A45C27" />
                <Text style={styles.callButtonText}>In app Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.callButton}
                onPress={handlePhoneCall}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#A45C27" />
                ) : (
                  <>
                    <Icon name="phone" size={20} color="#A45C27" />
                    <Text style={styles.callButtonText}>Phone Call</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        <View style={styles.okayButtonContainer}>
          <TouchableOpacity
            style={styles.okayButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.okayButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrackOrderScreen;
