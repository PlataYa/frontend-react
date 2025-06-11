import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'expo-router';
import {useAuth} from "@/context/AuthContext";

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        const success = await login({ mail, password });
        if (success) {
            router.replace("/app/home");
        }
    };

    return (
        <View>
            <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title="Iniciar Sesión" onPress={handleLogin} />
            {error ? <Text style={{ color: 'red', textAlign: 'center' }}>Error al iniciar sesión.</Text> : null}
            <Pressable onPress={() => router.push("/auth/register")}>
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
