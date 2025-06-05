import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import ActionsContainer from "../components/ActionsContainer";
import {useNavigation} from "@react-navigation/native";
import { getWalletByMail } from '../api/api';
import WalletInfo from '../components/WalletInfo';
import {WalletResponseDTO} from "../dto/wallet.dto";

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ route }) => {
    const { user } = route.params;
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);

    useEffect(() => {
        const fetchWallet = async () => {
            try {
                const wallet = await getWalletByMail(user.mail);
                setWallet(wallet);
            } catch (e) {
                console.error('Error getting wallet', e);
            }
        };
        fetchWallet();
    }, []);
    const navigation = useNavigation<any>();

    const buttonAction = () => {
        navigation.navigate('Transfer', {user});
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Bienvenido, {user.name}!</Text>
            {wallet !== null && <WalletInfo wallet={wallet} />}
            <ActionsContainer action1={buttonAction} action2={buttonAction}/>
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
