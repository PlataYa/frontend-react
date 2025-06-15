import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './PrimaryButton';
import TextInputField from './TextInputField';

const MAX_ATTEMPTS = 5;

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [validationError, setValidationError] = useState('');
    const [attempts, setAttempts] = useState(1);
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const isSecurePassword = (pass: string) =>
        /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(pass);

    const handleLogin = async () => {
        setValidationError('');

        if (!mail || !password) {
            setValidationError('Todos los campos son obligatorios.');
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail)) {
            setValidationError('Email inválido');
            return;
        }

        if (!isSecurePassword(password)) {
            setValidationError('La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un símbolo.');
            return;
        }

        if (attempts >= MAX_ATTEMPTS) {
            setValidationError('Demasiados intentos. Por favor, espere o reinicie la app.');
            return;
        }

        const success = await login({ mail, password });
        if (success) {
            navigate("/");
        } else {
            const nextAttempts = attempts + 1;
            setAttempts(nextAttempts);
            if (nextAttempts >= MAX_ATTEMPTS) {
                setValidationError('Demasiados intentos. Por favor, espere o reinicie la app.');
            } else {
                setValidationError('Email o contraseña incorrectos');
            }
        }
    };

    return (
        <div className="card">
            <h2 id="main-title" className="text-center mb-3">Iniciar Sesión</h2>
            <TextInputField id="login-email" placeholder="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField id="login-password" placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            {(validationError || error) && (
                <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>
                    {validationError || error}
                </p>
            )}
            <PrimaryButton
                id="login-button"
                title="Iniciar Sesión"
                onPress={handleLogin}
                disabled={attempts >= MAX_ATTEMPTS}
            />
            <button
                id="redirect-register-button"
                onClick={() => navigate("/auth/register")}
                style={{
                    marginTop: '10px',
                    color: '#6C63FF',
                    textAlign: 'center',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                }}
                accessKey="register"
            >
                No tenés cuenta? Registrate
            </button>
        </div>
    );
};

export default LoginCard;
