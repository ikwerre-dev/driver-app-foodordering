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
import { BASE_URL } from "../config";

const { width } = Dimensions.get("window");

const darkMapStyle = [
  {
    elementType: 'geometry',
    stylers: [{ color: '#212121' }],
  },
  {
    elementType: 'labels.text.fill',
    stylers: [{ color: '#757575' }],
  },
  {
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#212121' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.fill',
    stylers: [{ color: '#2c2c2c' }],
  },
];

const CustomMarker = ({ icon, color }) => (
  <View
    style={{
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 8,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: color,
    }}
  >
    <Icon name={icon} size={20} color={color} />
  </View>
);

const TrackOrderScreen = () => {
  const { theme } = useContext(ThemeContext);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [shopLocationc, setshopLocationc] = useState(null);
  const [deliveryAddress, setdeliveryAddress] = useState("...")
  const [homeLocation, setHomeLocation] = useState(null);
  const [customerName, setcustomerName] = useState("...")
  const route = useRoute()
  const navigation = useNavigation()
  const mapRef = useRef(null);
  const {data} = route.params

  const GOOGLE_MAPS_API_KEY = "AIzaSyADUgvqdCAHwvxaJaZVJCM7D6ozWai3lQY";

  useEffect(() => {
    const getCustomerName = async () => {
      try {
        const response = await fetch(`${BASE_URL}/getFullName`, {
          method: "POST",
          body: JSON.stringify({
            user_id: data.user_id,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch customer name");
        }
  
        const result = await response.json();
  
        if (result.status === 200) {
          // Handle the response here (e.g., store the customer name)
          console.log("Customer name:", result.fullname);
          const w = result.fullname.split(" ")[0]
          // If you want to store the name in state, you can set it here
          // setCustomerName(result.fullname);
          setcustomerName(result.fullname)
        } else {
          console.log("Error:", result.message);
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };
  
    if (data.user_id) {
      getCustomerName();
    }
  }, [data]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation
      });
      setCurrentLocation(location.coords);
      console.log("current location: ", location.coords)
      const d = parseFloat(data.shop_latitude) + parseFloat(0.039)
      const e = parseFloat(data.shop_longitude)+ parseFloat(0.039)
      setHomeLocation({
        latitude: parseFloat(data.delivery_latitude),
        longitude: parseFloat(data.delivery_longitude),
      });

      const address = await Location.reverseGeocodeAsync({
        latitude: parseFloat(data.delivery_latitude),
        longitude: parseFloat(data.delivery_longitude),
      });
      if (address && address.length > 0) {
        const { city, country, street } = address[0]; // Accessing the first address result
        console.log(`Address: ${street}, ${city}, ${country}`);
      }
      const { city, country, street, formattedAddress } = address[0]; // Accessing the first address result
      const main = `${street}, ${city}, ${country}`
      console.log("Address: ", address)
      setdeliveryAddress(formattedAddress)
      if (!isNaN(d) && !isNaN(e)) {
        console.log("Valid numbers")
        setshopLocationc({ latitude: d, longitude: e });
      } else {
        console.error("Invalid coordinates:", data.shop_latitude, data.shop_longitude);
      }
      console.log("Datasss: ", parseFloat(data.shop_latitude), parseFloat(data.shop_longitude))
      
    })();
  }, [data]);

  useEffect(() => {
    if (currentLocation && shopLocationc && homeLocation && mapRef.current) {
      mapRef.current.fitToCoordinates(
        [currentLocation, shopLocationc, homeLocation],
        {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        }
      );
    }
  }, [currentLocation, shopLocationc, homeLocation]);

  const handlePhoneCall = async () => {
    setIsLoading(true);
    try {
      await Linking.openURL('tel:+2349163169949');
    } catch (error) {
      console.error('Failed to make the call:', error);
    } finally {
      setIsLoading(false);
    }
  };
  

  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
    },
    container: {
      flex: 1,
    },
    headerBelow: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 20,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 16,
    },
    headerTitle: {
      fontSize: 20,
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      fontWeight: 'bold',
    },
    map: {
      width: width,
      height: width * 0.5,
    },
    contentContainer: {
      padding: 20,
    },
    infoCard: {
      backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(32,33,35,0.9)',
      borderRadius: 12,
      padding: 20,
      marginBottom: 16,
    },
    statusBadge: {
      backgroundColor: '#FFA500',
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    statusText: {
      color: '#000000',
      fontWeight: 'bold',
      fontSize: 12,
    },
    infoRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: theme === 'light' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.1)',
      gap:5
    },
    infoLabel: {
      color: theme === 'light' ? '#000000' : '#FFFFFF',
      flex: 1,
    },
    infoValue: {
      color: theme === 'light' ? '#6B7280' : '#9CA3AF',
    },
    actionButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(32,33,35,0.9)',
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
    },
    callButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    callButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === 'light' ? '#F3F4F6' : 'rgba(32,33,35,0.9)',
      borderRadius: 25,
      padding: 12,
      marginHorizontal: 8,
    },
    callButtonText: {
      color: '#B25E09',
      marginLeft: 8,
    },
    bottomButton: {
      backgroundColor: '#DC2626',
      borderRadius: 25,
      padding: 16,
      margin: 20,
    },
    bottomButtonText: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: 'bold',
    },
    acceptDeclineContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 20,
      backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
    },
    ignoreButton: {
      backgroundColor: '#DC2626',
      borderRadius: 25,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    acceptButton: {
      backgroundColor: '#22C55E',
      borderRadius: 25,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: 'bold',
      textAlign: 'center',
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerBelow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" color={theme === 'light' ? '#000000' : '#FFFFFF'} size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Incoming</Text>
        </View>

        {currentLocation && (
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
            customMapStyle={theme === 'light' ? [] : darkMapStyle}
          >
            {shopLocationc !== null && homeLocation !== null && (
              <MapViewDirections
              origin={shopLocationc}
              destination={homeLocation}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={4}
              strokeColor="#22C55E"
            />
            )}
            {currentLocation !== null && shopLocationc !== null && (
              <MapViewDirections
              origin={currentLocation}
              destination={shopLocationc}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={8}
              strokeColor="#FDB813"
            />
            )}

           {currentLocation !== null && (
             <Marker coordinate={currentLocation}>
             <CustomMarker icon="navigation" color="#FDB813" />
           </Marker>
           )}
            {shopLocationc && (
  <>
    {console.log("shopLocationc is valid:", shopLocationc)}
    {shopLocationc !== null && (
      <Marker coordinate={shopLocationc}>
      <CustomMarker icon="shopping-bag" color="#DC2626" />
    </Marker>
    )}
  </>
)}

            {homeLocation !== null && (
              <Marker coordinate={homeLocation}>
              <CustomMarker icon="home" color="#22C55E" />
            </Marker>
            )}
          </MapView>
        )}

        <ScrollView>
          <View style={styles.contentContainer}>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Incoming</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <Icon name="user" size={20} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                <Text style={styles.infoLabel}>Customer Name</Text>
                <Text style={styles.infoValue}>{customerName}</Text>
              </View>

              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Icon name="map-pin" size={20} color={theme === 'light' ? '#000000' : '#FFFFFF'} />
                <Text style={styles.infoLabel}>{deliveryAddress}</Text>
              </View>
            </View>
 

            
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.bottomButton} onPress={() => navigation.goBack()}>
          <Text style={styles.bottomButtonText}>Okay</Text>
        </TouchableOpacity>
        <View style={styles.acceptDeclineContainer}>
          <TouchableOpacity style={styles.ignoreButton} onPress={() => navigation.goBack()}>
            <Icon name="chevron-left" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Ignore Booking</Text>
            <Icon name="chevrons-left" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.acceptButton} onPress={() => navigation.replace('TrackOrder', {data: data})}>
            <Icon name="chevron-right" size={24} color="#FFFFFF" />
            <Text style={styles.buttonText}>Accept Booking</Text>
            <Icon name="chevrons-right" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default TrackOrderScreen;

