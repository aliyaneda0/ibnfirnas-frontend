import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Link, router } from 'expo-router';

export default function SignUpScreen() {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Validation
  const validateForm = () => {
    if (!fullName.trim()) {
      Alert.alert('Error', 'Full name is required');
      return false;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number (min 10 digits)');
      return false;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }
    return true;
  };

  // Handle sign-up
  const handleSignUp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Replace with your Spring Boot sign-up endpoint
      const response = await fetch('YOUR_BACKEND_URL/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          email,
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success – you can auto-login or redirect to login
        Alert.alert(
          'Account Created!',
          'Please log in with your credentials.',
          [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
        );
      } else {
        // Show error from backend
        Alert.alert('Sign Up Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      keyboardShouldPersistTaps="handled"
    >
      <View className="p-6">
        <Text className="text-3xl font-bold text-center mb-2">
          Create Account
        </Text>
        <Text className="text-gray-500 text-center mb-8">
          Join us with your email and phone
        </Text>

        {/* Full Name */}
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

        {/* Email */}
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        {/* Phone */}
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />

        {/* Password */}
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-4 text-base"
          placeholder="Password (min 6 characters)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Confirm Password */}
        <TextInput
          className="border border-gray-300 rounded-lg p-4 mb-6 text-base"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        {/* Sign Up Button */}
        <TouchableOpacity
          className={`bg-blue-500 rounded-lg p-4 items-center ${
            isLoading ? 'opacity-50' : ''
          }`}
          onPress={handleSignUp}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* Link to Login */}
        <Link href="/(auth)/login" className="mt-4 text-center text-blue-500">
          Already have an account? Log in
        </Link>
      </View>
    </ScrollView>
  );
}