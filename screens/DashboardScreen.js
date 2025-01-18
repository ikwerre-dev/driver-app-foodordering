import React, { useState, useRef, useContext, useMemo, useEffect } from "react";
import * as Location from 'expo-location'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Animated,
  Dimensions,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import jwt_decode from 'jwt-decode'
import Icon from "react-native-vector-icons/Feather";
import { ThemeContext } from "../context/AuthContext";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Livvic_400Regular, Livvic_700Bold } from "@expo-google-fonts/livvic";
import MenuOverlay from "../components/MenuOverlay";
import { BASE_URL } from "../config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSocket } from "../context/SocketContext";

const { width } = Dimensions.get("window");

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
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#000",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 20,
      paddingTop: Platform.OS === "android" ? 40 : 20,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    menuButton: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      justifyContent: "center",
      alignItems: "center",
    },
    iconButton: {
      width: 50,
      height: 50,
      borderRadius: 10,
      backgroundColor: "transparent",
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 24,
      fontWeight: "bold",
      fontFamily: "Livvic_700Bold",
    },
    content: {
      flex: 1,
      paddingHorizontal: 20,
    },
    onlineStatus: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginTop: 10,
    },
    onlineDotContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    onlineDot: {
      width: 19,
      height: 19,
      borderRadius: 40,
      backgroundColor: "#4CD964",
      marginRight: 5,
    },
    onlineText: {
      color: "#4CD964",
      fontSize: 20,
      fontFamily: "Livvic_700Bold",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
    },
    balanceCard: {
      backgroundColor: "#ff3b30",
      borderRadius: 15,
      padding: 20,
      marginTop: 0,
    },
    balanceLabel: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 14,
      fontFamily: "Livvic_400Regular",
    },
    balanceAmount: {
      color: "white",
      fontSize: 32,
      fontWeight: "bold",
      marginVertical: 10,
      fontFamily: "Livvic_700Bold",
    },
    withdrawButton: {
      backgroundColor: "white",
      borderRadius: 25,
      padding: 15,
      alignItems: "center",
    },
    withdrawText: {
      color: "#ff3b30",
      fontWeight: "600",
      fontFamily: "Livvic_700Bold",
    },
    statsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
    },
    statBox: {
      backgroundColor: theme === "light" ? "#F5F5F5" : "#222",
      borderRadius: 15,
      padding: 15,
      width: "30%",
      alignItems: "center",
    },
    statLabel: {
      color: theme === "light" ? "#666" : "#999",
      fontSize: 12,
      textAlign: "center",
      fontFamily: "Livvic_400Regular",
    },
    statValue: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 16,
      fontWeight: "bold",
      marginTop: 5,
      fontFamily: "Livvic_700Bold",
    },
    deliverySection: {
      marginTop: 20,
    },
    sectionHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    sectionTitle: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 18,
      fontWeight: "600",
      fontFamily: "Livvic_700Bold",
    },
    viewAll: {
      color: theme === "light" ? "#666" : "#999",
      fontSize: 14,
      fontFamily: "Livvic_400Regular",
    },
    deliveryItem: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: theme === "light" ? "#F5F5F5" : "#222",
      borderRadius: 15,
      padding: 15,
      marginTop:10
    },
    packageIcon: {
      backgroundColor: "#ff3b30",
      borderRadius: 25,
      width: 40,
      height: 40,
      justifyContent: "center",
      alignItems: "center",
    },
    deliveryInfo: {
      flex: 1,
      marginLeft: 15,
    },
    packageTitle: {
      color: theme === "light" ? "#000" : "#fff",
      fontSize: 16,
      fontWeight: "500",
      fontFamily: "Livvic_700Bold",
    },
    packageStatus: {
      color: theme === "light" ? "#666" : "#999",
      fontSize: 14,
      fontFamily: "Livvic_400Regular",
    },
    deliveryTime: {
      color: theme === "light" ? "#666" : "#999",
      fontSize: 12,
      fontFamily: "Livvic_400Regular",
    },
    alertBox: {
      marginTop: 20,
      backgroundColor: theme === "light" ? "#F5F5F5" : "#2A2A2A",
      borderRadius: 15,
      overflow: "hidden",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    alertContent: {
      flexDirection: "row",
      alignItems: "center",
      padding: 15,
    },
    alertIconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: "#DC2626",
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    alertTextContainer: {
      flex: 1,
      marginRight: 10,
    },
    alertTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: theme === "light" ? "#000" : "#fff",
      fontFamily: "Livvic_700Bold",
      marginBottom: 4,
    },
    alertDescription: {
      fontSize: 14,
      color: theme === "light" ? "#666" : "#999",
      fontFamily: "Livvic_400Regular",
    },
  });

const HomeScreen = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const translateX = useRef(new Animated.Value(-width)).current;
  const [driverid, setdriverid] = useState(null)
  const [driverEmail, setdriverEmail] = useState(null)
  const mainContentTranslateX = useRef(new Animated.Value(0)).current;
  const [loading, setloading] = useState(true)
  const [checkingStatus, setcheckingStatus] = useState(true)
  const [verificationStatus, setverificationStatus] = useState(null)
  const [loadingPast, setloadingPast] = useState(true)
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const [balance, setBalance] = useState("...")
  const [pastDeliveries, setpastDeliveries] = useState([])
  const {socket, incomingDeliveries, setincomingDeliveries} = useSocket()

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
    Livvic_400Regular,
    Livvic_700Bold,
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString); // Convert the string into a Date object
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = date.toLocaleDateString('en-GB', options); // Format the date (e.g., "28 Feb")
    const formattedTime = date.toLocaleTimeString('en-GB', timeOptions); // Format the time (e.g., "10:10 AM")

    return `${formattedDate}, ${formattedTime}`;  // Combine the date and time
  };

  const getFormattedAddress = async (latitude, longitude) => {
      try {
        const response = await Location.reverseGeocodeAsync({
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        });
    
        if (response && response.length > 0) {
          // Construct a formatted address from the response
          const { city, region, country, formattedAddress } = response[0];
          return `${formattedAddress}`;
        }
        return "Address not found";
      } catch (error) {
        console.log('Error fetching formatted address:', error);
        return "Address not found";
      }
    };
  
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (value) => (value * Math.PI) / 180;
      const R = 6371000; // Earth's radius in meters
    
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
    
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // Distance in meters
    };

    const getPastBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const decodedToken = await jwt_decode(token);
        const { id } = decodedToken;
    
        if (!driverid) {
          console.log("Driver ID is not available.");
          return;
        }
    
        console.log("Driverid: ", driverid);
        const response = await fetch(`${BASE_URL}/driver/getpast`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: id }), // Send the driver ID as a JSON payload
        });
    
        if (!response.ok) {
          console.log("Awaited response: ", await response.json());
          setpastDeliveries([]);
          return;
        }
    
        const data = await response.json();
        console.log("data: ", data);
    
        if (data.status === 200) {
          const bookingsWithAddresses = await Promise.all(data.bookings.map(async (booking) => {
            console.log("W: ", booking.shop_latitude, booking.shop_longitude)
            console.log("Y: ", booking.delivery_latitude, booking.delivery_longitude)
            const shopAddress = await getFormattedAddress(booking.shop_latitude, booking.shop_longitude);
            const deliveryAddress = await getFormattedAddress(booking.delivery_latitude, booking.delivery_longitude);
            const distanceCalc = calculateDistance(
              parseFloat(booking.shop_latitude),
              parseFloat(booking.shop_longitude),
              parseFloat(booking.delivery_latitude),
              parseFloat(booking.delivery_longitude)
            );
    
            return {
              ...booking,
              shop_address: shopAddress,
              delivery_address: deliveryAddress,
              distance_calc: distanceCalc
            };
          }));
    
          setpastDeliveries(bookingsWithAddresses);
        } else {
          setpastDeliveries([]);
        }
        return data.bookings;
      } catch (error) {
        console.log('Error fetching past bookings:', error);
      } finally {
        setloadingPast(false);
      }
    };

  const getIncomingDeliveries = async () => {
    try {
      if (!driverid) {
        console.log("Driver ID is not available right now.");
        return;
      }

      console.log("DriverEmail: ", driverEmail);
      const response = await fetch(`${BASE_URL}/driver/getincoming`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: driverid }),  // Send the driver ID as a JSON payload
      });

      if (!response.ok) {
        console.log("Awaited response: ", await response.json());
        setincomingDeliveries([]);
        return;
      }

      const data = await response.json();
      if (data.status === 200) {
        setincomingDeliveries(data.deliveries);
      } else {
        setincomingDeliveries([]);
      }
      return data.deliveries;
    } catch (error) {
      console.log('Error fetching incoming deliveries:', error);
    } finally{
      setloading(false)
    }
  };

  const getBalance = async () => {
    try {
      // Retrieve the token from AsyncStorage
      const token = await AsyncStorage.getItem("token");
      
      if (!token) {
        console.log("Token not found");
        return;
      }

      // Decode the token to extract the email
      const decodedToken = await jwt_decode(token);
      const { email, id } = decodedToken;

      // Set driver id and email
      setdriverid(id);
      setdriverEmail(email);

      // Make a request to fetch the balance
      const response = await fetch(`${BASE_URL}/fetch_balance`, {
        method: "POST",
        body: JSON.stringify({ email, user_id: id }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        console.log("Failed to fetch balance");
        return;
      }

      // Parse the response
      const data = await response.json();
      if (data.status === 200) {
        console.log("User balance: ", data.balance);
        setBalance(data.balance);
      } else {
        console.log("Failed to retrieve balance: ", data.message);
      }
    } catch (error) {
      console.log("Error fetching balance: ", error);
    }
  };

  useEffect(() => {
    // Call the function to fetch balance
    getBalance();
  }, []);  // This runs only once when the component mounts

  // Run these functions when driver_id and driver_email are updated
  useEffect(() => {
    if (driverid && driverEmail) {
      getPastBookings();
      getIncomingDeliveries();
    }
  }, [driverid, driverEmail]);  // Runs when driverId or driverEmail changes

  const checkStatus = async () => {
    setcheckingStatus(true)
    try {
      const token = await AsyncStorage.getItem("token")
      const decodedToken = await jwt_decode(token)
      const {id} = decodedToken
      const response = await fetch(`${BASE_URL}/driver/check-status`, {
        method: "POST",
        body: JSON.stringify({
          driver_id: id
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok){
        console.log("response: ", response)
        console.log("m: ", await response.json())
        return
      }

      const reps2 = await response.json()
      console.log("resp2: ", reps2)
      if (reps2.status === 200){
        console.log("resp2: n success: ", reps2)
        setverificationStatus(reps2.verification_status)
      }
      else{
        console.log("resp2.wda: ", reps2)
        setverificationStatus('failed')
      }
    } catch (error) {
      console.error("Error: ", error)
    } finally{
      setcheckingStatus(false)
    }
  }
  

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("token")
        const decodedToken = await jwt_decode(token)
        const {id} = decodedToken
        const response = await fetch(`${BASE_URL}/driver/check-status`, {
          method: "POST",
          body: JSON.stringify({
            driver_id: id
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })

        if (!response.ok){
          console.log("response: ", response)
          console.log("m: ", await response.json())
          return
        }

        const reps2 = await response.json()
        console.log("resp2: ", reps2)
        if (reps2.status === 200){
          console.log("resp2: n success: ", reps2)
          setverificationStatus(reps2.verification_status)
        }
        else{
          console.log("resp2.wda: ", reps2)
          setverificationStatus('failed')
        }
      } catch (error) {
        console.error("Error: ", error)
      }
    }

    checkStatus()
  }, [])

  const styles = useMemo(() => getStyles(theme), [theme]);

  const toggleMenu = () => {
    const toValue = isMenuOpen ? -width : 0;
    const contentToValue = isMenuOpen ? 0 : width * 0.7;
    const opacityToValue = isMenuOpen ? 0 : 0.5;

    Animated.parallel([
      Animated.timing(overlayOpacity, {
        toValue: opacityToValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(mainContentTranslateX, {
        toValue: contentToValue,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsMenuOpen(!isMenuOpen);
    });
  };

  if (!fontsLoaded) {
    return null; // or a loading component
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <MenuOverlay
        isOpen={isMenuOpen}
        onClose={toggleMenu}
        translateX={translateX}
      />

      {isMenuOpen && (
        <TouchableOpacity
          style={[StyleSheet.absoluteFill, { zIndex: 999 }]}
          activeOpacity={1}
          onPress={toggleMenu}
        >
          <Animated.View
            style={[styles.overlay, { opacity: overlayOpacity }]}
          />
        </TouchableOpacity>
      )}

      <Animated.View
        style={[
          styles.container,
          {
            transform: [{ translateX: mainContentTranslateX }],
          },
        ]}
      >
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Icon
                name="menu"
                size={24}
                color={theme === "light" ? "#000" : "#fff"}
              />
            </TouchableOpacity>
          </View>
          {/* <Text style={styles.headerTitle}>
            {" "}
            <View style={styles.onlineStatus}>
              <View style={styles.onlineDotContainer}>
                <View style={styles.onlineDot} />
              </View>
              <Text style={styles.onlineText}>Online</Text>
            </View>
          </Text> */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
              <Icon
                name={theme === "light" ? "sun" : "moon"}
                color={theme === "light" ? "#000" : "#fff"}
                size={24}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("Notification")}
              style={styles.iconButton}
            >
              <Icon
                name="bell"
                color={theme === "light" ? "#000" : "#fff"}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={ <RefreshControl
      refreshing={loading}
      onRefresh={async () => {
        setloading(true);  // Set loading to true to show the activity indicator
        await getBalance();
        await getIncomingDeliveries();
        await getPastBookings();
        await checkStatus()
        setloading(false); // Set loading to false after data has been fetched
      }}
    />}>
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>₦ {balance}</Text>
            <TouchableOpacity style={styles.withdrawButton}>
              <Text style={styles.withdrawText}>Withdraw Money</Text>
            </TouchableOpacity>
          </View>
          {verificationStatus === null ? (
  <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
    <ActivityIndicator size="large" color={theme === "light" ? "#000" : "#fff"} />
    <Text style={{ color: theme === "light" ? "#000" : "#fff", fontFamily: "Livvic_700Bold", fontSize: 16, marginTop: 10 }}>
      Checking status...
    </Text>
  </View>
) : (
  verificationStatus === "rejected" ? (
    <TouchableOpacity
      style={styles.alertBox}
      onPress={() => navigation.navigate("Info")}
    >
      <View style={styles.alertContent}>
        <View style={styles.alertIconContainer}>
          <Icon name="info" size={24} color="#fff" />
        </View>
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertTitle}>Verify Account</Text>
          <Text style={styles.alertDescription}>
            Tap here to Upload Details to Verify Account
          </Text>
        </View>
        <Icon
          name="chevron-right"
          size={24}
          color={theme === "light" ? "#000" : "#fff"}
        />
      </View>
    </TouchableOpacity>
  ) : verificationStatus === 'pending' ? (
    <Text style={{
      color: 'white',
      fontFamily: "Livvic_700Bold",
      fontSize: 18,
      paddingVertical: 10,
      textAlign: 'center'
    }}>
      Verification in progress...
    </Text>
  ) : verificationStatus === 'accepted' ? (
    <Text style={{
      color: 'white',
      fontFamily: "Livvic_700Bold",
      fontSize: 18,
      paddingVertical: 10,
      textAlign: 'center'
    }}>
      Verification successful...
    </Text>
  ) : (
    <TouchableOpacity
      style={styles.alertBox}
      onPress={() => navigation.navigate("Info")}
    >
      <View style={styles.alertContent}>
        <View style={styles.alertIconContainer}>
          <Icon name="info" size={24} color="#fff" />
        </View>
        <View style={styles.alertTextContainer}>
          <Text style={styles.alertTitle}>Verify Account</Text>
          <Text style={styles.alertDescription}>
            Tap here to Upload Details to Verify Account
          </Text>
        </View>
        <Icon
          name="chevron-right"
          size={24}
          color={theme === "light" ? "#000" : "#fff"}
        />
      </View>
    </TouchableOpacity>
  )
)}

          
          <TouchableOpacity
            style={styles.alertBox}
            onPress={() => navigation.navigate("CarType")}
          >
            <View style={styles.alertContent}>
              <View style={styles.alertIconContainer}>
                <Icon name="info" size={24} color="#fff" />
              </View>
              <View style={styles.alertTextContainer}>
                <Text style={styles.alertTitle}>Upload Vehicle Details</Text>
                <Text style={styles.alertDescription}>
                  Tap here to Upload Details to Verify Account
                </Text>
              </View>
              <Icon
                name="chevron-right"
                size={24}
                color={theme === "light" ? "#000" : "#fff"}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Today's{"\n"}Earning</Text>
              <Text style={styles.statValue}>₦500</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Today's{"\n"}Delivery</Text>
              <Text style={styles.statValue}>10</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Today's{"\n"}Login Hrs</Text>
              <Text style={styles.statValue}>17 Hrs</Text>
            </View>
          </View>

          <View style={styles.deliverySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Incoming Delivery</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {loading ? (
              <ActivityIndicator size="small" color="red" style={{paddingVertical: 15}}/>  // Show loading indicator
            ) : incomingDeliveries.length > 0 ? (
              incomingDeliveries.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.deliveryItem}
                  onPress={() => navigation.navigate("Incoming", {data: item})}
                >
                  <View style={styles.packageIcon}>
                    <Icon name="package" size={20} color="white" />
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.packageTitle}>Package #{item.item_id} to {item.shop_location.split(" ")[0]}</Text>
                    <Text style={styles.packageStatus}>{item.status}</Text>
                  </View>
                  <Text style={styles.deliveryTime}>{formatDate(item.created_at)}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{color: 'white', fontFamily: "Livvic_700Bold", fontSize: 16, textAlign: 'center', paddingVertical: 15}}>No incoming deliveries at the moment</Text>  // Message when no deliveries exist
            )}
          </View>

          <View style={styles.deliverySection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Past Deliveries</Text>
              <TouchableOpacity>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {loadingPast ? (
              <ActivityIndicator size="small" color="red" /> // Show loading indicator while fetching data
            ) : pastDeliveries.length > 0 ? (
              pastDeliveries.map((item, index) => (
                <TouchableOpacity
                  key={index} // It's good to include a unique key for each item
                  style={styles.deliveryItem}
                  disabled={true}
                  onPress={() => navigation.navigate("TrackOrder", { data: item })} // Pass necessary data if needed
                >
                  <View style={styles.packageIcon}>
                    <Icon name="package" size={20} color="white" />
                  </View>
                  <View style={styles.deliveryInfo}>
                    <Text style={styles.packageTitle}>
                      Package {item.item_id} to {item.shop_location.split(" ")[0]}
                    </Text>
                    <Text style={styles.packageStatus}>{item.status}</Text>
                  </View>
                  <Text style={styles.deliveryTime}>
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}{" "}
                    {new Date(item.created_at).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={{marginBottom: 20, color: 'white', fontFamily: "Livvic_700Bold", fontSize: 17, paddingTop: 5}}>No past deliveries at the moment</Text> // Message when there are no past bookings
            )}

          </View>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
};

export default HomeScreen;
