import React, { useState } from 'react';
import {Modal, View, Text, TextInput, StyleSheet, Button, Alert} from 'react-native';
import Toast from 'react-native-toast-message';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (cvu: string, amount: string) => void;
    type: 'transfer' | 'deposit' | 'withdraw';
}

const TransactionModal: React.FC<Props> = ({ visible, onClose, onSubmit, type }) => {
    const [cvu, setCvu] = useState('');
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');

    const title = {
        transfer: 'Transferir a CVU',
        deposit: 'Ingresar fondos',
        withdraw: 'Transferir a cuenta externa',
    }[type];

    const handleSubmit = () => {
        if (!amount) {
            setError("Monto requerido. Por favor, ingrese un monto.");
            return;
        }

        if (type === 'transfer' && !cvu) {
            setError("CVU requerido. Por favor, ingrese un CVU.");
            return;
        }

        if (type === 'transfer' && !/^\d{12}$/.test(cvu)) {
            setError("CVU inválido. Debe tener 12 dígitos.");
            return;
        }

        const monto = Number(amount);
        if (!/^\d+(\.\d{1,2})?$/.test(amount) || monto <= 0 || monto > 1000000) {
            setError("Monto inválido. Debe ser un número positivo y menor a 1,000,000.");
            return;
        }

        onSubmit(cvu, amount);
        setCvu('');
        setAmount('');
        onClose();
    };

    return (
        <Modal transparent={true} visible={visible} animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.card}>
                    <Text style={styles.title}>{title}</Text>
                    {type === 'transfer' && (
                        <TextInput placeholder="CVU destino" style={styles.input} onChangeText={setCvu} value={cvu} keyboardType="numeric" />
                    )}
                    <TextInput placeholder="Monto" style={styles.input} onChangeText={setAmount} value={amount} keyboardType="numeric" />
                    {error ? <Text style={{ color: 'red', marginBottom: 12 }}>{error}</Text> : null}
                    <View style={styles.actions}>
                        <Button title="Cancelar" onPress={onClose} />
                        <Button title="Confirmar" onPress={handleSubmit} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default TransactionModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#00000088',
    },
    card: {
        alignSelf: 'center',
        margin: 24,
        width: '60%',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        elevation: 5,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        borderRadius: 6,
        marginBottom: 12,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});
