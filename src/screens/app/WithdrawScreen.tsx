import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { withdrawFromWallet } from '../../services/api';
import { toast } from 'react-toastify';
import TextInputField from '../../components/TextInputField';

const WithdrawScreen: React.FC = () => {
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/');
    };

    const handleSubmit = async () => {
        setError('');

        if (!amount) {
            setError("Monto requerido. Por favor, ingrese un monto.");
            return;
        }

        const monto = Number(amount);
        if (!/^\d+(\.\d{1,2})?$/.test(amount) || monto <= 0 || monto > 1000000) {
            setError("Monto inválido. Debe ser un número positivo y menor a 1,000,000.");
            return;
        }

        try {
            await withdrawFromWallet({
                payerCvu: user.cvu,
                amount: Number(amount),
                currency: "ARS",
                externalReference: "manual_withdraw"
            });
            toast.success('Extracción realizada');
            navigate('/');
        } catch (error) {
            toast.error('No se pudo completar la extracción');
        }
    };

    return (
        <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
            <img
                style={{ width: '100px', height: '100px', marginBottom: '20px' }}
                src={require("../../assets/logo.png")}
                alt="Logo"
            />
            <div className="card" style={{
                margin: '24px auto',
                backgroundColor: '#fff',
                borderRadius: '12px',
                padding: '20px',
                maxWidth: '500px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
                <h3 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Transferir a cuenta externa</h3>
                <div style={{ marginBottom: '16px' }}>
                    <TextInputField
                        placeholder="Monto"
                        value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric"
                    />
                </div>
                {error && <p style={{ color: 'red', marginBottom: '16px' }}>{error}</p>}
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px' }}>
                    <button
                        className="button"
                        onClick={handleCancel}
                        style={{
                            backgroundColor: '#ccc',
                            color: '#000',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            width: '48%'
                        }}
                    >
                        Cancelar
                    </button>
                    <button
                        className="button"
                        onClick={handleSubmit}
                        style={{
                            backgroundColor: '#6C63FF',
                            color: '#fff',
                            padding: '12px 24px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            width: '48%'
                        }}
                    >
                        Confirmar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WithdrawScreen;
