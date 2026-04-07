import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: 20,
        justifyContent: "center",
    },
    logoIcon: {
        width: 250,
        height: 150,
        resizeMode: "contain",
        alignSelf: "center",
        marginBottom: 40,
    },
    label: {
        fontFamily: "Inter_300Light",
        fontWeight: "400",
        fontSize: 17,
        color: "#075EAE",
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
    loginButton: {
        backgroundColor: "#075EAE",
        borderRadius: 10,
        paddingVertical: 12,
        alignItems: "center",
        marginTop: 60,
    },
    loginButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
        fontFamily: "Inter_600SemiBold",
    },
    signUpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 40,
    },
    signUpText: {
        fontSize: 17,
        color: "#8B8B8B",
        fontFamily: "Inter_300Light",
        fontWeight: "bold",
    },
    signUpButtonText: {
        fontSize: 17,
        fontWeight: "bold",
        color: "#075EAE",
        fontFamily: "Inter_600SemiBold",
        textDecorationLine: "underline",
        marginLeft: 5,
    },
});

export default styles;
