// components/TransactionsList.tsx
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { getTransactionHistory } from "@/services/api";
import { TransactionResponseDTO } from "@/dto/transaction.dto";
import { useAuth } from "@/context/AuthContext";

export default function TransactionsList() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState<TransactionResponseDTO[]>([]);

    useEffect(() => {
        if (user?.cvu) {
            getTransactionHistory(user.cvu).then(setTransactions);
        }
    }, [user]);

    const renderItem = ({ item }: { item: TransactionResponseDTO }) => (
        <View style={styles.item}>
            <Text style={styles.type}>{item.type}</Text>
            <Text style={styles.detail}>Monto: ${item.amount} {item.currency}</Text>
            <Text style={styles.detail}>Fecha: {new Date(item.createdAt).toLocaleString()}</Text>
            <Text style={styles.detail}>Estado: {item.status}</Text>
            <Text style={styles.detail}>Desde: {item.payerCvu}</Text>
            <Text style={styles.detail}>Hacia: {item.payeeCvu}</Text>
        </View>
    );

    return (
        <FlatList
            data={transactions}
            keyExtractor={(item) => item.transactionId.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.container}
        />
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    item: {
        backgroundColor: '#f0f0f0',
        padding: 10,
        borderRadius: 8,
        marginVertical: 5,
    },
    type: {
        fontWeight: 'bold',
        marginBottom: 4,
    },
    detail: {
        fontSize: 14,
    },
});
