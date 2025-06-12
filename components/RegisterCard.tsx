import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
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
    const { register, error, isLoading } = useAuth();
    const router = useRouter();

    const isSecurePassword = (pass: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);

    const handleRegister = async () => {
        setValidationError('');

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastname)) {
            setValidationError('Nombre y apellido deben contener solo letras.');
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(mail)) {
            setValidationError('El email ingresado no es válido.');
            return;
        }

        if (!isSecurePassword(password)) {
            setValidationError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.');
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

        if (!mail || !password || !name || !lastname || !dayOfBirth) {
            setValidationError('Todos los campos son obligatorios.');
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
        <View style={styles.container}>
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
            <PrimaryButton disabled={isLoading} title="Registrarme" onPress={handleRegister} />

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
    container: {
        width: '70%',
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    link: {
        marginTop: 10,
        color: '#6C63FF',
        textAlign: 'center',
    },
    error: {
        marginTop: 8,
        color: 'red',
        textAlign: 'center',
        maxWidth: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10, // para RN web moderno o podés usar marginRight
        width: '100%',
    }
});
