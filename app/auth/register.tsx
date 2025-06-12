import {View, StyleSheet, Text, Image} from "react-native";
import RegisterCard from "@/components/RegisterCard";
import AddNavbar from "@/components/AddNavbar";

export default function RegisterScreen() {
    return(
        <AddNavbar withLogout={false}>
            <View style={styles.container}>
                <RegisterCard/>
            </View>
        </AddNavbar>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0"
    },
    text: {
        fontSize: 24,
        color: "#333"
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 20
    }
});