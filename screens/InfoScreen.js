import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'
import jwt_decode from 'jwt-decode'
import { BASE_URL } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverRegistration({ navigation }) {
  const [activeTab, setActiveTab] = useState('private');
  const [frontsidebase64, setFrontSideBase64] = useState(null)
  const [loading, setloading] = useState(false)
  const [isModalVisible, setIsModalVisible] = useState(false); // To manage modal visibility
  const [selectedOption, setSelectedOption] = useState(null); // To store selected value

  const [backsidebase64, setBackSideBase64] = useState(null)
  const [error, seterror] = useState("")
  const [success, setsuccess] = useState("")
  const dropdownItems = [
    { label: 'Driver', value: 'driver' },
    { label: 'Rider', value: 'Rider' }
  ];
  const toggleModal = () => setIsModalVisible(!isModalVisible);
  const handleSelectOption = (option) => {
    setSelectedOption(option); // Update selected option
    setIsModalVisible(false);  // Close modal after selection
  };
  const [formData, setFormData] = useState({
    joinAs: '',
    firstName: '',
    lastName: '',
    gender: '',
    licenseNumber: '',
    issueDate: '',
    expiryDate: '',
    aadharNumber: ''
  });

  const handleDateChange2 = (text, type) => {
    // Allow only digits and slashes
    let formattedText = text.replace(/[^0-9\/]/g, ''); // Remove anything that is not a number or slash
  
    // Automatically insert slashes when the user reaches two digits for day/month
    if (formattedText.length === 2 || formattedText.length === 5) {
      formattedText = formattedText + '/';
    }
  
    // Limit the length to 10 characters (DD/MM/YYYY)
    if (formattedText.length <= 10) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [type]: formattedText, // Dynamically update issueDate or expiryDate based on the type
      }));
    }
  };
  
  const handleDateChange = (text, type) => {
    // Allow only digits and slashes
    let formattedText = text.replace(/[^0-9\/]/g, ''); // Remove anything that is not a number or slash
  
    // Automatically insert slashes when the user reaches two digits for day/month
    if (formattedText.length === 2 || formattedText.length === 5) {
      formattedText = formattedText + '/';
    }
  
    // Limit the length to 10 characters (DD/MM/YYYY)
    if (formattedText.length <= 10) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [type]: formattedText, // Dynamically update issueDate or expiryDate based on the type
      }));
    }
  };
  
  // Function to convert DD/MM/YYYY to YYYY-MM-DD
  const formatDate = (date) => {
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  };

  const uploadDocs = async () => {
    setloading(true)
    try {
      if (!formData.licenseNumber || !formData.issueDate || !formData.expiryDate || !formData.aadharNumber || !frontsidebase64 || !backsidebase64) {
        Alert.alert('Validation Error', 'Please fill in all required fields and upload both sides of the card.');
        return; // Stop further execution if validation fails
      }
      const token = await AsyncStorage.getItem("token")
      const decodedToken = await jwt_decode(token)
      const {id, email} = decodedToken
      const response = await fetch(`${BASE_URL}/upload_documents`, {
        method: "POST",
        body: JSON.stringify({
          driver_id: id,
          driving_license_number: formData.licenseNumber,
          issue_date: formatDate(formData.issueDate),
          expiry_date: formatDate(formData.expiryDate),
          aadhar_card_number: formData.aadharNumber,
          front_side_card_base64: frontsidebase64,
          back_side_card_base64: backsidebase64
        }),
        headers: {
          "Content-Type": "application/json"
        }
      })

      if (!response.ok){
        console.log("Error occurred: ", response)
        console.log("main: ", await response.json())
        return
      }

      const resp2 = await response.json()
      console.log("Resp2: ", resp2)
      if (resp2.status === 201){
        console.log("resp2: ", resp2)
        setsuccess("Driver Details sent for verification")
      } else{
        console.log("Omo: ", resp2)
        seterror("Error sending driver details")
      }

    } catch (error) {
      console.error("Error: ", error)
      seterror("Error sending driver details")
    } finally{
      setloading(false)
    }
  }

  const pickImage = async (side) => {
    // Launch the image picker with the specified options
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'], // Only allow images
      allowsEditing: true,  // Allow editing
      aspect: [4, 3],      // Aspect ratio
      quality: 1,          // Image quality
      base64: true
    });

    console.log("result: ", result)

    if (!result.canceled) {
      console.log("Not canceled")
      // Convert the image to base64
      const base64 = result.assets[0].base64;
      console.log("base: ", base64)
      // Set the base64 string based on the side of the card
      if (side === 'front') {
        setFrontSideBase64(base64);
      } else if (side === 'back') {
        setBackSideBase64(base64);
      }
    }
  };

  


  

  const renderPrivateInfo = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Personal Information</Text>
      <Text style={styles.formSubtitle}>
        Only your first name and vehicle details are visible to clients during the booking
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          I want to join Tiva as: <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.dropdown} onPress={toggleModal}>
          {selectedOption !== null ? (
            <Text style={styles.dropdownText}>{selectedOption.value}</Text>
          ) : (
            <Text style={styles.dropdownText}>Select option</Text>
          )}
          <Feather name="chevron-down" size={20} color="#666" />
        </TouchableOpacity>
        <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <TouchableOpacity style={styles.modalBackground} onPress={toggleModal}>
          <View style={styles.modalContainer}>
            <FlatList
              data={dropdownItems}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelectOption(item)}
                >
                  <Text style={styles.optionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.value}
            />
          </View>
        </TouchableOpacity>
      </Modal>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          First name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="First name"
          placeholderTextColor="#666"
          value={formData.firstName}
          onChangeText={(text) => setFormData({ ...formData, firstName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Last name <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Last name"
          placeholderTextColor="#666"
          value={formData.lastName}
          onChangeText={(text) => setFormData({ ...formData, lastName: text })}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Gender <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.dropdown}>
        <TextInput
  style={{ color: 'white', fontFamily: "Livvic_700Bold", fontSize: 16}}
  placeholder='Type Gender'
  placeholderTextColor='white'
  value={formData.gender}
  onChangeText={(text) => setFormData({ ...formData, gender: text })}
/>
          <Feather name="chevron-left" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <Text style={styles.helperText}>
        If you are a female gender, we will send communications specific to females
      </Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setActiveTab('drivers')}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );

  const renderDriversInfo = () => (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>Drivers Information</Text>
      <Text style={styles.formSubtitle}>
        Your national ID and license details will kept private
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Driving License Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter driving license number"
          placeholderTextColor="#666"
          value={formData.licenseNumber}
          onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
        />
      </View>

      <View style={styles.dateContainer}>
        <View style={[styles.inputGroup, { flex: 1, marginRight: 10 }]}>
          <Text style={styles.label}>
            Issue Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.dateInput}
            placeholder="DD/MM/YYYY"
            value={formData.issueDate}
            placeholderTextColor='#666'
            onChangeText={(text) => handleDateChange(text, 'issueDate')}
            keyboardType="numeric" // Only numeric input for the date
          />
        </View>

        <View style={[styles.inputGroup, { flex: 1, marginLeft: 10 }]}>
          <Text style={styles.label}>
            Expiry Date <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.dateInput}
            placeholder="DD/MM/YYYY"
            value={formData.expiryDate}
            placeholderTextColor='#666'
            onChangeText={(text) => handleDateChange(text, 'expiryDate')}
            keyboardType="numeric" // Only numeric input for the date
          />
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Front Side of Card <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage('front')}>
          {frontsidebase64 !== null ? (
            <AntDesign name='checkcircle' size={23} color='red'/>
          ) : (
            <>
              <Feather name="upload" size={24} color="#666" />
          <Text style={styles.uploadText}>Click to Upload Front Side of Card</Text>
          <Text style={styles.uploadSubtext}>(Max. File size: 25 MB)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Back Side of Card <Text style={styles.required}>*</Text>
        </Text>
        <TouchableOpacity style={styles.uploadBox} onPress={() => pickImage('back')}>
          {backsidebase64 !== null ? (
            <AntDesign name='checkcircle' size={23} color='red'/>
          ) : (
            <>
              <Feather name="upload" size={24} color="#666" />
          <Text style={styles.uploadText}>Click to Upload Back Side of Card</Text>
          <Text style={styles.uploadSubtext}>(Max. File size: 25 MB)</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>
          Aadhar Card Number <Text style={styles.required}>*</Text>
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Aadhar card number"
          placeholderTextColor="#666"
          value={formData.aadharNumber}
          onChangeText={(text) => setFormData({ ...formData, aadharNumber: text })}
        />
      </View>

      <TouchableOpacity style={styles.button} disabled={loading} onPress={uploadDocs}>
        {loading ? (
          <ActivityIndicator color='white' size={20}/>
        ) : (
          <Text style={styles.buttonText}>Done</Text>
        )}
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.redCircle} />
      
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.brandText}>
          <Text style={styles.brandHighlight}>TIVA</Text> DRIVER
        </Text>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'private' && styles.activeTab]}
          onPress={() => setActiveTab('private')}
        >
          <Text style={styles.tabText}>Private info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'drivers' && styles.activeTab]}
          onPress={() => setActiveTab('drivers')}
        >
          <Text style={styles.tabText}>Drivers info</Text>
        </TouchableOpacity>
      </View>

      {success && <Text style={{color: 'green', fontSize: 16, paddingVertical: 10}}>{success}</Text>}
      {error && <Text style={{color: 'red', fontSize: 16, paddingVertical: 10}}>{error}</Text>}
      <ScrollView style={styles.content}>
        {activeTab === 'private' ? renderPrivateInfo() : renderDriversInfo()}
      </ScrollView>
    </View>
  );
}

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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 70 : 50,
  },
  backButton: {
    marginRight: 15,
  },
  brandText: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  brandHighlight: {
    color: '#DC2626',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  tab: {
    marginRight: 20,
    paddingBottom: 10,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626',
  },
  tabText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  formContainer: {
    padding: 20,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
  formSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#FFFFFF',
    marginBottom: 8,
    fontSize: 16,
  },
  required: {
    color: '#DC2626',
  },
  input: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 18,
    color: '#FFFFFF',
    fontSize: 18,
  },
  dropdown: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownText: {
    color: '#fff',
    fontSize: 18,
  },
  helperText: {
    color: '#666',
    fontSize: 14,
    marginTop: -10,
    marginBottom: 30,
  },
  dateContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  dateInput: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 18,
    fontSize: 18,
    color: '#666',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateInputText: {
    color: '#666',
    fontSize: 18,
  },
  uploadBox: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 30,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: '#666',
    alignItems: 'center',
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
  uploadSubtext: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#DC2626',
    borderRadius: 30,
    padding: 18,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  // Modal container style
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
  option: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 10,
    borderRadius: 10
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontFamily: "Livvic_700Bold"
  },
});

