import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './PrimaryButton';
import TextInputField from './TextInputField';

const RegisterCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [dayOfBirth, setDayOfBirth] = useState('');
    const [validationError, setValidationError] = useState('');
    const { register, error } = useAuth();
    const navigate = useNavigate();

    const isSecurePassword = (pass: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);

    const isAdult = (date: Date) => {
        const today = new Date();
        const adultDate = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate());
        return today >= adultDate;
    };

    const isValidDateFormat = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    const handleRegister = async () => {
        setValidationError('');

        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(name) || !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(lastname)) {
            setValidationError('Nombre y apellido deben contener solo letras.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
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
            navigate("/auth/login");
        }
    };

    return (
        <div className="card">
            <h2 id="main-title" className="text-center mb-3">Registrarse</h2>
            <TextInputField id="register-name" placeholder="Nombre" value={name} onChangeText={setName} />
            <TextInputField id="register-lastname" placeholder="Apellido" value={lastname} onChangeText={setLastname} />
            <TextInputField id="register-email" placeholder="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField id="register-password" placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInputField id="register-birthdate" placeholder="Fecha de nacimiento (YYYY-MM-DD)" value={dayOfBirth} onChangeText={setDayOfBirth} />
            {(validationError || error) && <p style={{ marginTop: '8px', color: 'red', textAlign: 'center' }}>{validationError || error}</p>}
            <PrimaryButton id="register-button" title="Registrarme" onPress={handleRegister} />
            <button
                id="redirect-login-button"
                onClick={() => navigate("/auth/login")}
                style={{ marginTop: '10px', color: '#6C63FF', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
                ¿Ya tenés cuenta? Iniciá sesión
            </button>
        </div>
    );
};

export default RegisterCard;
