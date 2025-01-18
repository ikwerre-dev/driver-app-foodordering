import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { AuthContext } from '../context/AuthContext';

export default function PhoneRegistrationScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const navigation = useNavigation()
  const route = useRoute()
  const {fullName, email, password} = route.params
  const {verifyEmail} = useContext(AuthContext)
  const [error, setError] = useState("")
  const [loading, setloading] = useState(false)

  const verifyNow = async () => {
    try {
      setloading(true)
      const userData = JSON.stringify({
        email: email
      })
      const main = await verifyEmail(userData)
      const {otp, status, message} = main
      if (status === 201){
        navigation.navigate('VerificationCode', {email: email, password: password, fullName: fullName, otp: otp, phoneNumber: phoneNumber})
      } else{
        setError(message)
      }


    } catch (error) {
      console.error('error: ', error)
    } finally{
      setloading(false)
    }
  }


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
       <Icon name="chevron-left" color="#FFFFFF" size={24} />
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.title}>Registration</Text>
        <Text style={styles.subtitle}>
          Enter your phone number
        </Text>
        {error !== "" && <Text style={{color: 'red', fontSize: 20, paddingVertical: 10}}>{error}</Text>}

        <View style={styles.phoneContainer}>
          <View style={styles.countryCode}>
            <Text style={styles.countryCodeText}>🇳🇬 +234</Text>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="Phone number"
            placeholderTextColor="#666"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
        </View>

        <TouchableOpacity
          style={styles.continueButton}
          disabled={phoneNumber === ''}
          onPress={verifyNow}
        >
          {loading ? (
            <ActivityIndicator color='white' size={20}/>
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101112',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  phoneContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  countryCode: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 15,
    marginRight: 10,
  },
  countryCodeText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 15,
    color: '#FFFFFF',
    fontSize: 16,
  },
  continueButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
