import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff",
        overflow: 'scroll',
    },

    // CONTENT ============================================
    content: {
        height: "100%",
    },

    top_content: {
        height: 200,
    },

    top_background: {
        height: 200,
    },

    top_title: {
        marginBottom: -10,
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 24,
        color: "white",
        paddingLeft: 15,
        textShadowColor: "gray",
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
    },

    top_text: {
        fontFamily: "Inter_600SemiBold",
        fontWeight: "300",
        fontSize: 16,
        color: "white",
        marginTop: 85,
        paddingLeft: 15,
        width: 300,
    },

    // MID CONTENT =========================================
    mid_content: {
        paddingVertical: 25,
    },
    
    greeting: {
        //styling
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 32,
        color: "#477EB0",
        //positioning
        paddingLeft: 15,
        marginTop: 5,
        marginBottom: 20,
    },

    widget: {
        //sizing
        width: 230,
        height: 190,
        //positioning
        alignSelf: "center",
        alignItems: "center",
        //styling
        borderWidth: 1,
        borderColor: "#075EAE",
        borderRadius: 30,
    },

    location: {
        marginTop: 10,
        flexDirection: "row",
    },

    pin: {
        height: 14,
        width: 14,
    },
    
    location_text: {
        //font styling
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        //positioning
        marginLeft: 5,
        marginTop: -3,
    },

    tempContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    
    temp: {
        fontFamily: "Inter_300Light",
        fontWeight: "300",
        fontSize: 48,
        color: "#000",
        textAlign: "center",
        borderBottomColor: "black",
        borderBottomWidth: 1,
        width: 180,
        alignContent: "center",
    },

    degree: {
        fontSize: 14,
        fontFamily: "Inter_300Light",
        fontWeight: "300",
        color: "#000",
        marginTop: 10,
        marginLeft: -60,
        marginHorizontal: 40,
    },

    // BOTTOM CONTENT ======================================
    btm_content: {
        marginTop: 20,
    },

    bottom_background: {
        display: "flex",
        height: 200,
        width: "100%",
    },

    bottom_title: {
        //font styling
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 28,
        color: "#477EB0",
        //stroke styling
        textShadowColor: "white",
        textShadowRadius: 3,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        //positioning
        marginTop: 40,
        alignSelf: "center",
    },

    report_btn: {
        //styling
        backgroundColor: "white",
        //sizing
        height: 50,
        width: 160,
        //positioning
        marginTop: 20,
        alignSelf: "center",
        //border styling
        borderWidth: 1,
        borderRadius: 15,
        borderColor: "white",
    },
    
    report_text: {
        //font styling
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 18,
        //positioning
        paddingTop: 10,
        paddingLeft: 17,
    },
});

export default styles;