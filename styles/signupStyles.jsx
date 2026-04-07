import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container2: {
        paddingTop: 30,
        backgroundColor: "#fff",
    },
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    label: {
        fontFamily: "Inter_300Light",
        fontWeight: "680",
        fontSize: 17,
        color: "#075EAE",
        marginTop: 10,
        marginBottom: 5,
        marginLeft: 5,
    },
    input: {
        width: "100%",
        height: 45,
        borderBottomColor: "black",
        borderBottomWidth: 2,
        marginBottom: 20,
        paddingHorizontal: 10,
        fontFamily: "Inter_300Light",
        fontSize: 14,
        color: "#000",
    },
    signupButton: {
        backgroundColor: "#075EAE",
        borderRadius: 12,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 40,
    },
    signupButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Inter_600SemiBold",
    },
    loginLink: {
        alignItems: "center",
        marginTop: 20,
    },
    loginLinkText: {
        fontSize: 15,
        color: "black",
        fontFamily: "Inter_600SemiBold",
        textDecorationLine: "underline",
    },
});

export default styles;
