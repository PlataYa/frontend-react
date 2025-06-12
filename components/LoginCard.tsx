import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'expo-router';
import {useAuth} from "@/context/AuthContext";

const MAX_ATTEMPTS = 5;

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const { login, isLoading } = useAuth();
    const router = useRouter();
    const [attempts, setAttempts] = useState(0);

    const handleLogin = async () => {
        setValidationError('');

        if (attempts >= MAX_ATTEMPTS) {
            setValidationError('Demasiados intentos. Por favor, espere o reinicie la app.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
            setValidationError('Email inválido');
            return;
        }
        if (password.length < 8) {
            setValidationError('La contraseña debe tener al menos 8 caracteres');
            return;
        }

        const success = await login({ mail, password });

        if (success) {
            router.replace("/app/home");
        } else {
            setValidationError('Email o contraseña incorrectos');
            setAttempts(prev => prev + 1);
        }
    };


    return (
        <View>
            <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton disabled={isLoading || attempts >= MAX_ATTEMPTS} title="Iniciar Sesión" onPress={handleLogin} />
            {validationError ? <Text style={{ color: 'red', textAlign: 'center' }}>{validationError}</Text> : null}
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
