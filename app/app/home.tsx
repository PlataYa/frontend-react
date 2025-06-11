import { Text, View, StyleSheet, Pressable } from "react-native";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "expo-router";

export default function Home() {
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.replace("/auth/login");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>INICIO.</Text>
            <Pressable style={styles.button} onPress={handleLogout}>
                <Text style={styles.buttonText}>Cerrar sesión</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
        padding: 20,
    },
    text: {
        fontSize: 24,
        color: "#333",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#6C63FF",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});
