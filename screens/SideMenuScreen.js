import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

export default function SideMenuScreen() {
  const menuItems = [
    { icon: 'shopping-bag', title: 'My Orders' },
    { icon: 'user', title: 'My Profile' },
    { icon: 'map-pin', title: 'Delivery Address' },
    { icon: 'credit-card', title: 'Payment Methods' },
    { icon: 'sun', title: 'Light Mode' },
    { icon: 'star', title: 'Your Ratings' },
    { icon: 'log-out', title: 'Log Out' },
  ];
  const [email, setEmail] = useState("")
  const [fullname, setfullname] = useState("")
  
  return (
    <View style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: 'https://placeholder.com/100x100' }}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Jon Snow</Text>
            <Text style={styles.profileEmail}>jonsnow@gmail.com</Text>
          </View>
        </View>

        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Icon name={item.icon} size={24} color="#fff" />
            <Text style={styles.menuItemText}>{item.title}</Text>
          </TouchableOpacity>
        ))}

        <View style={styles.ratingSection}>
          <Text style={styles.ratingTitle}>Your Ratings</Text>
          <View style={styles.ratingItems}>
            <Image
              source={{ uri: 'https://placeholder.com/40x40' }}
              style={styles.ratingImage}
            />
            <Image
              source={{ uri: 'https://placeholder.com/40x40' }}
              style={styles.ratingImage}
            />
            <Image
              source={{ uri: 'https://placeholder.com/40x40' }}
              style={styles.ratingImage}
            />
          </View>
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.logoutButton}>
        <LogOut color="#DC2626" size={24} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101112',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  profileEmail: {
    color: '#666',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  menuItemText: {
    color: '#fff',
    marginLeft: 15,
    fontSize: 16,
  },
  ratingSection: {
    marginTop: 20,
  },
  ratingTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ratingItems: {
    flexDirection: 'row',
  },
  ratingImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#2A2A2A',
  },
  logoutText: {
    color: '#DC2626',
    marginLeft: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

