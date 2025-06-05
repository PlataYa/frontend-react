import React, { useState } from 'react';
import { View, Alert, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { loginUser } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {RootStackParamList} from "../navigation/types";

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');

    type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
    const navigation = useNavigation<NavigationProp>();

    const handleLogin = async () => {
        try {
            const user = await loginUser({ mail, password });
            navigation.navigate('Home', { user });
        } catch {
            Alert.alert('Error', 'Login failed');
        }
    };

    return (
        <View>
            <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title="Login" onPress={handleLogin} />
            <Pressable onPress={() => navigation.navigate('Register')}>
                <Text style={styles.link}>No tenés cuenta? Registrate</Text>
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
