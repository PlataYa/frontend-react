import React, { useState } from 'react';
import { Modal, View, Text, TextInput, StyleSheet, Button } from 'react-native';

interface Props {
    visible: boolean;
    onClose: () => void;
    onSubmit: (cvu: string, amount: string) => void;
    type: 'transfer' | 'deposit' | 'withdraw';
}

const TransactionModal: React.FC<Props> = ({ visible, onClose, onSubmit, type }) => {
    const [cvu, setCvu] = useState('');
    const [amount, setAmount] = useState('');

    const title = {
        transfer: 'Transferir a CVU',
        deposit: 'Ingresar fondos',
        withdraw: 'Sacar fondos',
    }[type];

    const handleSubmit = () => {
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
        margin: 24,
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
