import React, { useState } from 'react';
import { Platform, View, Alert, Text, Pressable, StyleSheet } from 'react-native';
import TextInputField from './TextInputField';
import PrimaryButton from './PrimaryButton';
import { useRouter } from 'expo-router';
import {useAuth} from "@/context/AuthContext";

const RegisterCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [dayOfBirth, setDayOfBirth] = useState('');
    const [validationError, setValidationError] = useState('');
    const { register, error } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        setValidationError('');

        if (!mail || !password || !name || !lastname || !dayOfBirth) {
            setValidationError('Todos los campos son obligatorios.');
            return;
        }

        if (!isValidDateFormat(dayOfBirth)) {
            setValidationError('La fecha debe tener formato YYYY-MM-DD.');
            return;
        }

        const birthdate = new Date(dayOfBirth);
        if (isNaN(birthdate.getTime())) {
            setValidationError('La fecha ingresada no es válida.');
            return;
        }

        if (!isAdult(birthdate)) {
            setValidationError('Debés tener al menos 18 años.');
            return;
        }

        const success = await register({ mail, password, name, lastname, dayOfBirth });
        if (success) {
            router.replace("/auth/login");
        }
    };

    const isAdult = (date: Date) => {
        const today = new Date();
        const adultDate = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate());
        return today >= adultDate;
    };

    const isValidDateFormat = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    return (
        <View>
            <View style={styles.row}>
                <TextInputField label="Nombre" value={name} onChangeText={setName} />
                <TextInputField label="Apellido" value={lastname} onChangeText={setLastname} />
            </View>
            <TextInputField label="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField label="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInputField
                label="Fecha de nacimiento (YYYY-MM-DD)"
                value={dayOfBirth}
                onChangeText={setDayOfBirth}
                placeholder="Ej: 2000-05-10"
            />
            <PrimaryButton title="Registrarme" onPress={handleRegister} />

            {(validationError || error) && (
                <Text style={styles.error}>{validationError || error}</Text>
            )}

            <Pressable onPress={() => router.push("/auth/login")}>
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
    error: {
        marginTop: 8,
        color: 'red',
        textAlign: 'center',
    },
    row: {
        flexDirection: Platform.OS === 'web' ? 'row' : 'column',
        justifyContent: 'space-between',
        gap: 10,
    },
});
