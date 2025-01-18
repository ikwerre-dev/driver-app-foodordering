import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import jwt_decode from 'jwt-decode'
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/AuthContext';
import {
  useFonts,
  Livvic_400Regular,
  Livvic_700Bold,
} from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Entypo from '@expo/vector-icons/Entypo';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ReviewCard = ({ customer_name, created_at, message_from_user, rating_number }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);

  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          <Entypo name="user" size={24} color="black" style={styles.avatar}/>          
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{customer_name}</Text>
            <Text style={styles.reviewDate}>{formatDate(created_at)}</Text>
          </View>
        </View>
        <TouchableOpacity>
          <Icon name="more-vertical" size={20} color={theme === 'light' ? '#666' : '#888'} />
        </TouchableOpacity>
      </View>
      <Text style={styles.reviewText}>{message_from_user}</Text>
    </View>
  );
};


const Performance = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const [rating, setRating] = useState('');
  const [ratings, setRatings] = useState([])
  const [checking, setChecking] = useState(false)


  const checkRatingsNow = async () => {
    setChecking(true)
    try {
      const token = await AsyncStorage.getItem("token")
      const decodedToken = await jwt_decode(token)
      const {id, email} = decodedToken
      const response = await fetch(`${BASE_URL}/ratings`, {
        method: "POST",
        body: JSON.stringify({
          driver_id: id
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok){
        return
      }

      const resp2 = await response.json()
      console.log("Resp2: ", resp2)
      if (resp2.status === 200 && resp2.ratings.length > 0){
        setRatings(resp2.ratings)
      } else if (resp2.status === 200 && resp2.ratings.length === 0){
        setRatings([])
      } else{
        setError(resp2.message)
      }
    } catch (error) {
      console.error("Error: ", error)
    } finally{
      setChecking(false)
    }
  }

  useEffect(() => {
    const checkRatingsNow2 = async () => {
      setChecking(true)
      try {
        const token = await AsyncStorage.getItem("token")
        const decodedToken = await jwt_decode(token)
        const {id, email} = decodedToken
        const response = await fetch(`${BASE_URL}/ratings`, {
          method: "POST",
          body: JSON.stringify({
            driver_id: id
          }),
          headers: {
            "Content-Type": "application/json"
          }
        })
  
        if (!response.ok){
          console.log("Response: ", await response.json())
          return
        }
  
        const resp2 = await response.json()
        console.log("Resp2: ", resp2)
        if (resp2.status === 200 && resp2.ratings.length > 0){
          setRatings(resp2.ratings)
        } else if (resp2.status === 200 && resp2.ratings.length === 0){
          setRatings([])
        } else{
          setError(resp2.message)
        }
      } catch (error) {
        console.error("Error: ", error)
      } finally{
        setChecking(false)
      }
    }
    const getNow = async () => {
      await checkRatingsNow2()
    }

    getNow()
  }, [])

  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const styles = getStyles(theme);


  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} />
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Icon name="chevron-left" size={24} color={theme === 'light' ? '#000' : '#fff'} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Performance</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false} refreshControl={<RefreshControl refreshing={checking} onRefresh={checkRatingsNow}/>}>
          {checking ? (
            <ActivityIndicator color='white' size={20} style={{alignSelf: 'center', justifyContent: 'center'}}/>
          ) : (
            ratings.length > 0 ? (
              ratings.map((review, index) => (
                <ReviewCard key={index} {...review} />
              ))
            ) : (
              <Text style={{color: 'white', fontFamily: "Livvic_700Bold", fontSize: 17, textAlign: 'center'}}>No ratings found yet...</Text>
            )
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginLeft: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  reviewCard: {
    backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1B1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  reviewDate: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#333' : '#ccc',
    lineHeight: 20,
  },
});

export default Performance;

