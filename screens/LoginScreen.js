import React, { useContext, useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity,KeyboardAvoidingView,Platform, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { AuthContext } from '../context/AuthContext';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#101112',
  },
  redCircle: {
    position: 'absolute',
    top: -125,
    right: -125,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#DC2626',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    color: '#666',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 16,
    padding: 20,
    color: '#FFFFFF',
    fontSize: 16,
    height: 60,
  },
  eyeIcon: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  forgotPassword: {
    alignItems: 'flex-end',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#DC2626',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#DC2626',
    borderRadius: 30,
    padding: 20,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
  },
  signUpText: {
    color: '#666',
    fontSize: 16,
  },
  signUpLink: {
    color: '#DC2626',
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 45,
    height: 45,
    backgroundColor: '#2A2A2A',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
});

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { login } = useContext(AuthContext);
  const [loading, setloading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    // Example user data
    try {
      setloading(true)
      const userData = JSON.stringify({
        email,
        password
      });
      const main = await login(userData);
      console.log("Main: ", main)
      const {message, status} = main
      if (status === 404 || status === 401){
        setError(message)
      }
    } catch (error) {
      console.log("Error: ", error)
    } finally{
      setloading(false)
    }
  };
  
  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={styles.container}
  >
    {/* Red Circle Decoration */}
    <View style={styles.redCircle} />
    
    <View style={styles.content}>
      
      <Text style={styles.title}>Login</Text>
      {error !== '' && <Text style={{color: 'red', fontSize: 20, paddingVertical: 10, fontFamily: "Livvic_700Bold"}}>{error}</Text>}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          style={[
            styles.input,
            focusedInput === 'email' && { borderColor: '#0066FF', borderWidth: 1 },
          ]}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Password</Text>
        <View style={{ position: 'relative' }}>
          <TextInput
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            style={[
              styles.input,
              focusedInput === 'password' && { borderColor: '#0066FF', borderWidth: 1 },
            ]}
            onFocus={() => setFocusedInput('password')}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
            <Icon name={showPassword ? "eye" : "eye-off"} size={24} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.forgotPassword}
        onPress={() => navigation.navigate('ForgotPassword')}
      >
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.loginButton}
        onPress={handleLogin}
      
      >
        {loading ? (
          <ActivityIndicator color='white' size={22}/>
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity style={styles.signUpContainer}
        onPress={() => navigation.navigate('SignUp')}
      
      >
        <Text style={styles.signUpText}>Don't have an account? </Text>
        <Text style={styles.signUpLink}>Sign Up</Text>
      </TouchableOpacity>
    </View>
  </KeyboardAvoidingView>
  );
};

export default LoginScreen;

