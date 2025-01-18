import React, { useContext } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import jwt_decode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { AuthContext, ThemeContext } from '../context/AuthContext';
import {
  useFonts,
  Livvic_400Regular,
  Livvic_700Bold,
} from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';
import profileBanner from "../assets/profilebanner.png";

const { width } = Dimensions.get('window');

const Settings = ({ navigation }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { logout } = useContext(AuthContext);
  const [token, settoken] = useState(null)
  const [fullname, setfullname] = useState("...")
  useEffect(() => {
    const getDeets = async () => {
      try {
        const deets = await AsyncStorage.getItem("token")
        const decodedToken = await jwt_decode(deets)
        const fullname = decodedToken.fullname
        console.log("fullname: ", decodedToken)
        setfullname(fullname)
      } catch (error) {
        console.log("Error: ", error)
      }
    }

    getDeets()
  }, [])  
 
  let [fontsLoaded] = useFonts({
    Livvic_400Regular,
    Livvic_700Bold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  const menuItems = [
   
    {
      icon: 'clock',
      title: 'History',
      route: 'Orders',
      badge: 2,
    },
    {
      icon: 'user',
      title: 'My Account',
      route: 'Profile',
      badge: 1,
    },
  ];

  const styles = getStyles(theme);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <Image source={profileBanner} style={styles.bannerImage} />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Icon name="chevron-left" size={24} color="#fff" />
      </TouchableOpacity>

      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileContent}>
          <View style={styles.profileImageContainer}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/150?img=3' }}
              style={styles.profileImage}
            />
          </View>
          <Text style={styles.name}>{fullname}</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Profile', {data: token})}>
            <Text style={styles.editProfile}>Edit Profile</Text>
          </TouchableOpacity>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>N50,000</Text>
              <Text style={styles.statLabel}>Total Earning</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>504.89 km</Text>
              <Text style={styles.statLabel}>Total Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>289 Hrs</Text>
              <Text style={styles.statLabel}>Total Login Hrs</Text>
            </View>
          </View>

          <View style={styles.menuContainer}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.menuItem}
                onPress={() => navigation.navigate(item.route)}
              >
                <View style={styles.menuItemLeft}>
                  <Icon name={item.icon} size={24} color={theme === 'light' ? '#000' : '#fff'} />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                {item.badge && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{item.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.menuItem} onPress={toggleTheme}>
              <View style={styles.menuItemLeft}>
                <Icon name="sun" size={24} color={theme === 'light' ? '#000' : '#fff'} />
                <Text style={styles.menuItemText}>Light Mode</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={logout} style={[styles.menuItem, styles.logoutItem]}>
              <View style={styles.menuItemLeft}>
                <Icon name="log-out" size={24} color="#f44336" />
                <Text style={[styles.menuItemText, styles.logoutText]}>Logout</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme === 'light' ? '#FFFFFF' : '#101112',
  },
  bannerImage: {
    width: width,
    height: 200,
    position: "absolute",
    top: 0,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
    width: 45,
    height: 45,
    backgroundColor: "rgba(0, 0, 0, 0.9)",
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  profileContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 120,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    fontSize: 24,
    fontFamily: 'Livvic_700Bold',
    textAlign: 'center',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 5,
  },
  editProfile: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: '#4A90E2',
    textAlign: 'center',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme === 'light' ? '#f5f5f5' : '#1A1B1E',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#888',
  },
  statDivider: {
    width: 1,
    backgroundColor: theme === 'light' ? '#ddd' : '#333',
    marginHorizontal: 10,
  },
  menuContainer: {
    width: '100%',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#f5f5f5' : '#1A1B1E',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#000' : '#fff',
    marginLeft: 15,
  },
  badge: {
    backgroundColor: '#f44336',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontFamily: 'Livvic_400Regular',
  },
  logoutItem: {
    marginTop: 20,
    borderBottomWidth: 0,
  },
  logoutText: {
    color: '#f44336',
  },
});

export default Settings;