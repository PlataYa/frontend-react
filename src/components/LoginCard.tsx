import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrimaryButton from './PrimaryButton';
import TextInputField from './TextInputField';

const LoginCard: React.FC = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const { login, error } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const success = await login({ mail, password });
        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="card">
            <h2 className="text-center mb-3">Iniciar Sesión</h2>
            <TextInputField placeholder="Email" value={mail} onChangeText={setMail} keyboardType="email-address" />
            <TextInputField placeholder="Contraseña" value={password} onChangeText={setPassword} secureTextEntry />
            <PrimaryButton title="Iniciar Sesión" onPress={handleLogin} />
            {error ? <p style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}>Error al iniciar sesión.</p> : null}
            <button 
                onClick={() => navigate("/auth/register")}
                style={{ marginTop: '10px', color: '#6C63FF', textAlign: 'center', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
            >
                No tenés cuenta? Registrate
            </button>
        </div>
    );
};

export default LoginCard;
