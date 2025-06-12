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
            navigate("/auth/login");
        }
    };

    const isAdult = (date: Date) => {
        const today = new Date();
        const adultDate = new Date(date.getFullYear() + 18, date.getMonth(), date.getDate());
        return today >= adultDate;
    };

    const isValidDateFormat = (date: string) => /^\d{4}-\d{2}-\d{2}$/.test(date);

    return (
        <div className="card">
            <h2 className="text-center mb-3">Registrarse</h2>
            <TextInputField placeholder="Nombre" value={name} onChangeText={setName} />
            <TextInputField placeholder="Apellido" value={lastname} onChangeText={setLastname} />
            <TextInputField placeholder="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <TextInputField
                placeholder="Fecha de nacimiento (YYYY-MM-DD)"
                value={dayOfBirth}
                onChangeText={setDayOfBirth}
            />
            <PrimaryButton title="Registrarme" onPress={handleRegister} />

            {(validationError || error) && (
                <p style={{ marginTop: '8px', color: 'red', textAlign: 'center' }}>
                    {validationError || error}
                </p>
            )}

            <button 
                onClick={() => navigate("/auth/login")}
                style={{ marginTop: '10px', color: '#6C63FF', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
                ¿Ya tenés cuenta? Iniciá sesión
            </button>
        </div>
    );
};

export default RegisterCard;
