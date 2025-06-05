import React, { useEffect, useState } from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import ActionsContainer from "../components/ActionsContainer";
import {useNavigation} from "@react-navigation/native";
import { getWalletByMail } from '../api/api';
import WalletInfo from '../components/WalletInfo';
import {WalletResponseDTO} from "../dto/wallet.dto";
import {useAuth} from "../auth/AuthProvider";

const HomeScreen: React.FC = () => {
    const { user, removeUser } = useAuth();
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const navigation = useNavigation<any>();

    useEffect(() => {
        if (user?.mail) {
            loadWallet();
        }
    }, [user]);

    const loadWallet = async () => {
        try {
            const walletData = await getWalletByMail(user!.mail);
            setWallet(walletData);
        } catch (error) {
            console.error('Error loading wallet:', error);
        }
    };

    const handleLogout = async () => {
        await removeUser();
    };

    const buttonAction = () => {
        navigation.navigate('Transfer', {user});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido, {user!.name}!</Text>
            {wallet !== null && <WalletInfo wallet={wallet} />}
            <ActionsContainer action1={buttonAction} action2={buttonAction}/>
            <TouchableOpacity onPress={handleLogout}>
                <Text style={styles.title}>Salir</Text>
            </TouchableOpacity>
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
});
