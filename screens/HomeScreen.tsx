// screens/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, Alert} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import {depositToWallet, getWalletByMail, sendP2PTransaction, withdrawFromWallet} from '../api/api';
import WalletInfo from '../components/WalletInfo';
import {WalletResponseDTO} from "../dto/wallet.dto";
import TransactionButton from "../components/TransactionButton";
import TransactionModal from "../components/TransactionModal";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ route }) => {
    const { user } = route.params;
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const [modalType, setModalType] = useState<'transfer' | 'deposit' | 'withdraw' | null>(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        fetchWallet();
    }, []);

    const fetchWallet = async () => {
        try {
            const wallet = await getWalletByMail(user.mail);
            setWallet(wallet);
        } catch (e) {
            console.error('Error getting wallet', e);
        }
    };

    const openModal = (type: 'transfer' | 'deposit' | 'withdraw') => {
        setModalType(type);
        setModalVisible(true);
    };

    const handleTransaction = async (cvu: string, amount: string) => {
        const payerCvu = wallet?.cvu;
        const amt = parseFloat(amount);
        try {
            if (modalType === 'transfer') {
                await sendP2PTransaction({ payerCvu: payerCvu!, payeeCvu: parseInt(cvu), currency: "ARS", amount: amt });
            } else if (modalType === 'deposit') {
                await depositToWallet({ payeeCvu: payerCvu!, amount: amt, currency: "ARS", externalReference: 'manual_deposit' });
            } else if (modalType === 'withdraw') {
                await withdrawFromWallet({ payerCvu: payerCvu!, amount: amt, currency: "ARS", externalReference: 'manual_withdraw' });
            }
            fetchWallet();
            Alert.alert('Éxito', 'Transacción realizada correctamente');
        } catch (e) {
            Alert.alert('Error', 'Falló la transacción');
            console.error(e);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{user.name.toUpperCase()} {user.lastname.toUpperCase()}</Text>
            {wallet !== null && <WalletInfo wallet={wallet} />}

            <View style={styles.buttons}>
                <TransactionButton label="Ingresar" onPress={() => openModal('deposit')} />
                <TransactionButton label="Transferir" onPress={() => openModal('transfer')} />
                <TransactionButton label="Sacar" onPress={() => openModal('withdraw')} />
            </View>

            {modalType && (
                <TransactionModal
                    visible={modalVisible}
                    type={modalType}
                    onClose={() => setModalVisible(false)}
                    onSubmit={handleTransaction}
                />
            )}
        </View>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    buttons: {
        flex: 1,
        flexDirection: "column",
        width: 100,
    },
});
