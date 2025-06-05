import React, { useState } from 'react';
import { View, Alert, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { loginUser } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import {useAuth} from "../auth/AuthProvider";
import {LoginRequestDTO} from "../dto/user.dto";

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigation = useNavigation<any>();
    const [isLoading, setIsLoading] = useState(false);
    const { logUserIn } = useAuth();

    const handleLogin = async () => {
      if (!mail.trim() || !password.trim()) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }

      setIsLoading(true);
      try {
        const credentials: LoginRequestDTO = { mail: mail.trim(), password };
        const userData = await loginUser(credentials);
        await logUserIn(userData);
        // Navigation will automatically happen due to auth state change
      } catch (error: any) {
        console.error('Login error:', error);
        Alert.alert(
          'Login Failed',
          error.response?.data?.message || 'Invalid credentials. Please try again.'
        );
      } finally {
        setIsLoading(false);
      }
    };

    const navigateToRegister = () => {
      navigation.navigate('Register');
    };

      return (
          <View>
              <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
              <TextInputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
              <PrimaryButton title="Login" onPress={handleLogin} />
              <Pressable onPress={navigateToRegister}>
                  <Text style={styles.link}>¿No tenés cuenta? Registrate</Text>
              </Pressable>
          </View>
      );
};

export default LoginCard;

const styles = StyleSheet.create({
    link: {
        marginTop: 10,
        color: '#6C63FF',
        textAlign: 'center',
    },
});
