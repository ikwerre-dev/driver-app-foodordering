import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { ThemeContext } from '../context/AuthContext';
import {
  useFonts,
  Livvic_400Regular,
  Livvic_700Bold,
} from '@expo-google-fonts/livvic';
import AppLoading from '../components/Loader';

const RideDetails = ({ navigation, route }) => {
  const { theme } = useContext(ThemeContext);
  const { tripId } = route.params;

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
          <Text style={styles.headerTitle}>Ride Details</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>PICKUP & DESTINATION</Text>
            <View style={styles.locationCard}>
              <View style={styles.locationItem}>
                <Icon name="map-pin" size={20} color="#4CAF50" style={styles.locationIcon} />
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>Started: {tripId.created_at}</Text>
                  <Text style={styles.address}>
                    {tripId.shop_address}
                  </Text>
                </View>
              </View>
              <View style={styles.locationDivider} />
              <View style={styles.locationItem}>
                <Icon name="map-pin" size={20} color="#f44336" style={styles.locationIcon} />
                <View style={styles.timeContainer}>
                  <Text style={styles.time}>Ended: {tripId.updated_at}</Text>
                  <Text style={styles.address}>
                    {tripId.delivery_address}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRIP DETAILS</Text>
            <View style={styles.detailsCard}>
              <DetailRow label="Trip ID" value={`#${tripId.id}`} />
              <DetailRow label="Trip Type" value="Round Trip" />
              <DetailRow label="Distance" value={`${tripId.distance_calc} m`} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>FARE DETAILS</Text>
            <View style={styles.fareCard}>
              <DetailRow label="Base Fare" value={tripId.price * 0.8} />
              <DetailRow label="Distance Fare" value={`₦ ${tripId.price * 0.15}`} />
              <DetailRow label="Time Fare" value={`₦ ${tripId.price * 0.05}`} />
              <DetailRow label="Total Fare" value={`₦ ${tripId.price}`} isTotal />
              <View style={styles.earnedContainer}>
                <Text style={styles.earnedLabel}>Your Earnings</Text>
                <Text style={styles.earnedValue}>{`₦ ${tripId.price * 0.15}`}</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const DetailRow = ({ label, value, isLast, isTotal }) => {
  const { theme } = useContext(ThemeContext);
  const styles = getStyles(theme);
  
  return (
    <View style={[styles.detailRow, isLast && styles.lastDetailRow]}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={[styles.detailValue, isTotal && styles.totalValue]}>{value}</Text>
    </View>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: 'Livvic_700Bold',
    color: '#f44336',
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  locationCard: {
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme === 'light' ? '#000' : '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  locationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  locationDivider: {
    height: 1,
    backgroundColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    marginVertical: 16,
  },
  timeContainer: {
    flex: 1,
  },
  time: {
    fontSize: 14,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
    marginBottom: 4,
  },
  address: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#BBB',
    lineHeight: 20,
  },
  detailsCard: {
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme === 'light' ? '#000' : '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
  },
  lastDetailRow: {
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Livvic_400Regular',
    color: theme === 'light' ? '#666' : '#BBB',
  },
  detailValue: {
    fontSize: 14,
    fontFamily: 'Livvic_700Bold',
    color: theme === 'light' ? '#000' : '#fff',
  },
  fareCard: {
    backgroundColor: theme === 'light' ? '#F5F5F5' : '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: theme === 'light' ? '#000' : '#FFF',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  totalValue: {
    color: '#f44336',
    fontSize: 16,
  },
  earnedContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme === 'light' ? '#E0E0E0' : '#2C2C2C',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  earnedLabel: {
    fontSize: 16,
    fontFamily: 'Livvic_700Bold',
    color: '#4CAF50',
  },
  earnedValue: {
    fontSize: 18,
    fontFamily: 'Livvic_700Bold',
    color: '#4CAF50',
  },
});

export default RideDetails;

