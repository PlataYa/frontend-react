import React, { useState } from 'react';
import { View, Alert, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { registerUser } from '../api/api';
import { useNavigation } from '@react-navigation/native';

const RegisterCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [dayOfBirth, setdayOfBirth] = useState('');
    const navigation = useNavigation<any>();

    const handleRegister = async () => {
        try {
            await registerUser({ mail, password, name, lastname, dayOfBirth});
            navigation.navigate('Login');
        } catch {
            Alert.alert('Error', 'Register failed');
        }
    };

    return (
        <View>
            <TextInputField label="Nombre" value={name} onChangeText={setName} />
            <TextInputField label="Apellido" value={lastname} onChangeText={setLastname} />
            <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title="Registrarme" onPress={handleRegister} />
            <Pressable onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>¿Ya tenés cuenta? Iniciá sesión</Text>
            </Pressable>
        </View>
    );
};

export default RegisterCard;

const styles = StyleSheet.create({
    link: {
        marginTop: 10,
        color: '#6C63FF',
        textAlign: 'center',
    },
});
