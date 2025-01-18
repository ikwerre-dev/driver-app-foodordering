import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/AuthContext';
import {
  useFonts,
  Livvic_400Regular,
  Livvic_700Bold,
} from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';
import jwt_decode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../config';
import * as Location from 'expo-location';

const History = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [loadingPast, setloadingPast] = useState(true)
  const [pastDeliveries, setpastDeliveries] = useState([])

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

  let driverid;
  const getPastBookings = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const decodedToken = await jwt_decode(token);
      const { id } = decodedToken;
      driverid = id;
  
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
        body: JSON.stringify({ id: driverid }), // Send the driver ID as a JSON payload
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
        console.log("Bookingwithaddress: ", bookingsWithAddresses)
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

  useEffect(() => {
    let driverid;
    const getPastBookings = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const decodedToken = await jwt_decode(token);
        const { id } = decodedToken;
        driverid = id;
    
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
          body: JSON.stringify({ id: driverid }), // Send the driver ID as a JSON payload
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

      getPastBookings()
  }, [])

  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);

  const historyData = [
    {
      id: '31/01/2023',
      name: 'Nikolas Jackson',
      tripId: '#0CAC6C64',
      pickup: 'Chicken Republic',
      dropoff: '41B Remi Fani Kayode Street',
      distance: '5.36km',
      duration: '10min',
    },
    {
      id: '31/01/2023',
      name: 'Jadon Sancho',
      tripId: '#0CAC6C64',
      pickup: 'Chicken Republic',
      dropoff: '41B Remi Fani Kayode Street',
      distance: '5.36km',
      duration: '10min',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={24} color={theme === 'light' ? '#000' : '#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>History</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={loadingPast} onRefresh={async () => {
          await getPastBookings()
        }}/>}>
          
          {loadingPast ? (
            <ActivityIndicator color='white' size={20} style={{display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center'}}/>
          ) : (
            <>
              {pastDeliveries.map((item, index) => (
            <View key={index} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <View style={styles.tripHeaderLeft}>
                  <Text style={styles.tripName}>{item.customer_name}</Text>
                  <Text style={styles.tripId}>{item.id}</Text>
                </View>
                <Text style={styles.tripDate}>{item.created_at.split(" ")[4]}</Text>
              </View>

              <View style={styles.locationContainer}>
                <View style={styles.locationItem}>
                  <Icon name="circle" size={10} color="#4CAF50" />
                  <Text style={styles.locationText}>{item.shop_address}</Text>
                </View>
                <View style={styles.locationItem}>
                  <Icon name="circle" size={10} color="#f44336" />
                  <Text style={styles.locationText}>{item.delivery_address}</Text>
                </View>
              </View>

              <View style={styles.tripFooter}>
                <View style={styles.tripInfo}>
                  <Icon name="repeat" size={14} color={theme === 'light' ? '#666' : '#888'} />
                  <Text style={styles.tripInfoText}>Round Trip</Text>
                </View>
                <View style={styles.tripInfo}>
                  <Icon name="map" size={14} color={theme === 'light' ? '#666' : '#888'} />
                  <Text style={styles.tripInfoText}>{item.id}</Text>
                </View>
                <View style={styles.tripInfo}>
                  <Icon name="clock" size={14} color={theme === 'light' ? '#666' : '#888'} />
                  <Text style={styles.tripInfoText}>{item.id}</Text>
                </View>
              </View>

              <TouchableOpacity 
                style={styles.detailsButton}
                onPress={() => navigation.navigate('RideDetails', { tripId: item })}
              >
                <Text style={styles.detailsButtonText}>Details</Text>
              </TouchableOpacity>
            </View>
          ))}
            </>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
  },
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#f0f0f0' : '#2C2C2C',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginLeft: 15,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 15,
  },
  tripCard: {
    backgroundColor: theme === 'light' ? '#f9f9f9' : '#1E1E1E',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: theme === 'light' ? '#000' : '#fff',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  tripHeaderLeft: {
    flex: 1,
  },
  tripName: {
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  tripId: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
    marginTop: 2,
  },
  tripDate: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: '#f44336',
  },
  locationContainer: {
    marginBottom: 15,
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#333' : '#ccc',
    marginLeft: 10,
  },
  tripFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: theme === 'light' ? '#eee' : '#333',
  },
  tripInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripInfoText: {
    fontSize: 13,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
    marginLeft: 5,
  },
  detailsButton: {
    alignItems: 'center',
    marginTop: 15,
    paddingVertical: 8,
    backgroundColor: theme === 'light' ? '#f0f0f0' : '#2C2C2C',
    borderRadius: 8,
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: 'Livvic_700Bold',
    color: '#4A90E2',
  },
});

export default History;

