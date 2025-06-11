import {View, StyleSheet, Text} from "react-native";
import RegisterCard from "@/components/RegisterCard";

export default function RegisterScreen() {
    return(
        <View style={styles.container}>
            <RegisterCard/>
        </View>
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
    }
});