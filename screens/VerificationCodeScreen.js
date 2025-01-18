import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useState, useRef, useContext } from 'react';
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

export default function VerificationCodeScreen() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);
  const route = useRoute()
  const [loading, setloading] = useState(false)
  const navigation = useNavigation()
  const {signup} = useContext(AuthContext)
  const [error, setError] = useState("")
  const [successMessage, setsuccessMessage] = useState("")
  const {email, fullName, password, phoneNumber, otp} = route.params

  const handleCodeChange = (text, index) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < 5) {
      inputs.current[index + 1].focus();
    }
  };

  const verifyOtp = async () => {
    setloading(true)
    try {
      const m = code.join('')

      console.log("Code: ", m, otp)
      if (parseFloat(code.join('')) === parseFloat(otp)){
        console.log("Correct otp")
        const userData = {
          email,
          fullName,
          password,
          phoneNumber
        }
        const main = await signup(userData)
        const {status, message} = main
        if (status === 201){
          navigation.navigate("Login")
        } else if (status === 409){
          setError("Email already registered")
        } else {
          setError("An error occurred")
        }
      }else{
        console.log("try harder")
        setError("Wrong OTP entered")
      }
    } catch (error) {
      console.error("Error: ", error)
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
        <Text style={styles.title}>Verification Code</Text>
        <Text style={styles.subtitle}>
          Please type the verification code sent to {email}
        </Text>
        {error !== "" && <Text style={{color: 'red', fontSize: 20, paddingVertical: 10}}>{error}</Text>}
        {successMessage !== "" && <Text style={{color: 'green', fontSize: 20, paddingVertical: 10}}>{successMessage}</Text>}
        <View style={styles.codeContainer}>
          {code.map((digit, index) => (
            <TextInput
              key={index}
              ref={(input) => (inputs.current[index] = input)}
              style={styles.codeInput}
              value={digit}
              onChangeText={(text) => handleCodeChange(text, index)}
              keyboardType="number-pad"
              maxLength={1}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.resendContainer}>
          <Text style={styles.resendText}>I don't receive a code. </Text>
          <Text style={styles.resendLink}>Please resend</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.continueButton}
          onPress={verifyOtp}
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
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    alignItems: 'center'
  },
  codeInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    width: 40,
    height: 47,
    color: '#FFFFFF',
    fontSize: 24,
    textAlign: 'center',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  resendText: {
    color: '#666',
  },
  resendLink: {
    color: '#DC2626',
  },
  continueButton: {
    backgroundColor: '#DC2626',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
