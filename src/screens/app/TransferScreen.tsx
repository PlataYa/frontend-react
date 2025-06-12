import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sendP2PTransaction, validateCVU } from '../../services/api';
import { toast } from 'react-toastify';
import TextInputField from '../../components/TextInputField';

const TransferScreen: React.FC = () => {
    const [cvu, setCvu] = useState('');
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

        if (!cvu) {
            setError("CVU requerido. Por favor, ingrese un CVU.");
            return;
        }

        if (!/^\d{12}$/.test(cvu)) {
            setError("CVU inválido. Debe tener 12 dígitos.");
            return;
        }

        const monto = Number(amount);
        if (!/^\d+(\.\d{1,2})?$/.test(amount) || monto <= 0 || monto > 1000000) {
            setError("Monto inválido. Debe ser un número positivo y menor a 1,000,000.");
            return;
        }

        try {
            const valid = await validateCVU(Number(cvu));
            if (!valid) {
                toast.error('CVU inválido: No se encontró una cuenta con ese CVU');
                return;
            }

            await sendP2PTransaction({
                payerCvu: user.cvu,
                payeeCvu: Number(cvu),
                amount: Number(amount),
                currency: "ARS",
            });
            toast.success('Transferencia realizada');
            navigate('/');
        } catch (error) {
            toast.error('No se pudo completar la transferencia');
        }
    };

    return (
        <div className="container" style={{ padding: '20px', textAlign: 'center' }}>
            <img
                style={{ width: '100px', height: '100px', marginBottom: '20px' }}
                src={require("../../assets/logo.png")}
                alt="Logo"
            />
            <h3 style={{ fontWeight: 'bold', fontSize: '24px', marginBottom: '20px' }}>Transferir a PlataYa</h3>
            <TextInputField
              placeholder="CVU destino"
              value={cvu}
              onChangeText={setCvu}
            />
            <TextInputField
              placeholder="Monto"
              value={amount}
              onChangeText={setAmount}
            />
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

    );
};

export default TransferScreen;
