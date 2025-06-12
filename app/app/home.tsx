// home.tsx
import {View, Text, StyleSheet, Image, Alert, ScrollView, Pressable} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { getWalletByMail, depositToWallet, validateCVU, sendP2PTransaction, withdrawToExternal } from "@/services/api";
import { WalletResponseDTO } from "@/dto/wallet.dto";
import WalletInfo from "@/components/WalletInfo";
import TransactionButton from "@/components/TransactionButton";
import TransactionModal from "@/components/TransactionModal";
import TransactionsList from "@/components/TransactionList";
import AddNavbar from "@/components/AddNavbar";

export default function Home() {
    const { user, logout } = useAuth();
    const [wallet, setWallet] = useState<WalletResponseDTO | null>(null);
    const [showTransfer, setShowTransfer] = useState(false);
    const [showDeposit, setShowDeposit] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);

    useEffect(() => {
        loadWallet();
    }, [user]);

    const loadWallet = async () => {
        if (!user || !user.mail) return;
        try {
            const result = await getWalletByMail(user.mail);
            setWallet(result);
        } catch (err) {
            Alert.alert("Error", "No se pudo obtener la billetera");
        }
    };

    const handleTransfer = async (cvu: string, amount: string) => {
        const valid = await validateCVU(Number(cvu));
        if (!valid) {
            Alert.alert("CVU inválido", "No se encontró una cuenta con ese CVU");
            return;
        }
        await sendP2PTransaction({
            payerCvu: user?.cvu!,
            payeeCvu: Number(cvu),
            amount: Number(amount),
            currency: "ARS",
        });
        setShowTransfer(false);
        await loadWallet();
        Alert.alert("Éxito", "Transferencia realizada");
    };

    const handleDeposit = async (_: string, amount: string) => {
        await depositToWallet({ payeeCvu: user?.cvu!, amount: Number(amount), currency: "ARS", externalReference: "manual_deposit" });
        setShowDeposit(false);
        await loadWallet();
        Alert.alert("Éxito", "Depósito realizado");
    };

    const handleWithdraw = async (_: string, amount: string) => {
        await withdrawToExternal({ payerCvu: user?.cvu!, amount: Number(amount), currency: "ARS", externalReference: "manual_withdraw" });
        setShowWithdraw(false);
        await loadWallet();
        Alert.alert("Éxito", "Extracción realizada");
    };

    return (
        <AddNavbar withLogout={true}>
            <ScrollView contentContainerStyle={styles.container}>
                <Image style={styles.image} source={require("@/assets/isologo.png")}/>
                <Text style={styles.text}>{user?.name} {user?.lastname}</Text>
                {wallet ? <WalletInfo wallet={wallet} /> : <Text style={styles.text}>Cargando billetera...</Text>}

                <View style={styles.buttons}>
                    <TransactionButton img={"transfer"} label="Transferir a PlataYa" onPress={() => setShowTransfer(true)} />
                    <TransactionButton img={"withdraw"} label="Transferir a cuenta externa" onPress={() => setShowWithdraw(true)} />
                    <TransactionButton img={"deposit"} label="Depositar" onPress={() => setShowDeposit(true)} />

                    <TransactionModal visible={showTransfer} onClose={() => setShowTransfer(false)} onSubmit={handleTransfer} type="transfer" />
                    <TransactionModal visible={showDeposit} onClose={() => setShowDeposit(false)} onSubmit={handleDeposit} type="deposit" />
                    <TransactionModal visible={showWithdraw} onClose={() => setShowWithdraw(false)} onSubmit={handleWithdraw} type="withdraw" />
                </View>

                <TransactionsList/>
            </ScrollView>
        </AddNavbar>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundColor: "#f5f5f5",
    },
    text: {
        fontSize: 20,
        marginVertical: 10,
        color: "#333",
    },
    logout: {
        marginTop: 30,
        fontSize: 16,
        color: "#6C63FF",
        textDecorationLine: "underline",
    },
    image: {
        width: 200,
        height: 100,
        marginBottom: 20,
    },
    buttons: {
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        margin: 20,
    },
});
