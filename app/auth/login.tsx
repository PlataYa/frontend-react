import {View, StyleSheet, Image} from "react-native";
import LoginCard from "@/components/LoginCard";
import AddNavbar from "@/components/AddNavbar";

export default function LoginScreen() {

    return(
        <AddNavbar withLogout={false}>
            <View style={styles.container}>
                <LoginCard/>
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