import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { sendP2PTransaction, validateCVU } from '../../services/api';
import { toast } from 'react-toastify';

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
        if (!error) setError('');

        if (!cvu && !amount) {
            setError("Todos los campos son obligatorios.");
            return;
        }

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
            const parsedAmount = Number(amount);
            const parsedCvu = Number(cvu);

            const valid = await validateCVU(parsedCvu);
            if (!valid) {
                setError('CVU inválido: No se encontró una cuenta con ese CVU');
                return;
            }

            await sendP2PTransaction({
                payerCvu: user.cvu,
                payeeCvu: parsedCvu,
                amount: parsedAmount,
                currency: "ARS",
            });
            toast.success('Transferencia realizada exitosamente');
            navigate('/');
        } catch (error: any) {
            setError(error.message);
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
            <input
                id="cvu-input"
                placeholder="CVU destino PlataYa"
                className="input"
                onChange={(e) => setCvu(e.target.value)}
                value={cvu}
                style={{ marginBottom: '12px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            <input
                id="amount-input"
                placeholder="Monto"
                className="input"
                onChange={(e) => setAmount(e.target.value)}
                value={amount}
                style={{ marginBottom: '12px', width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
            />
            {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}
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
                    id="submit-button"
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
