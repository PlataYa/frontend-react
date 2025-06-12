import {View, StyleSheet, Image, Text, Pressable} from "react-native";
import {useAuth} from "@/context/AuthContext";

export default function AddNavbar({children, withLogout}: {children: React.ReactNode, withLogout:boolean}) {
    const {logout} = useAuth();

    return (
        <View style={styles.container}>
            <View style={styles.navbar}>
                <Image style={styles.image} source={require("@/assets/logo.png")}/>
                {
                    withLogout &&
                    <Pressable style={styles.button} onPress={logout}>
                        <Text style={styles.buttonText}>Cerrar sesión</Text>
                    </Pressable>
                }
            </View>
            {children}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    navbar: {
        backgroundColor: '#5500fd',
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
    },
    image: {
        width: 80,
        height: 80,
    },
    button: {
        backgroundColor: "rgba(0,0,0,0.5)",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
    },
});