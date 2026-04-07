import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ImageBackground,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as Location from "expo-location";
import axios from "axios";

// CONSTANT IMPORTS
import images from "../constants/images"; // Import the images.js file

// Weather API Key and Default Location
const API_KEY = "REDACTED";
const DEFAULT_LOCATION = {
    latitude: 9.3116,
    longitude: 123.3073,
};

const Home = ({ route }) => {
    const navigation = useNavigation();
    const { userID, userFirstName } = route.params;

    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        askLocationPermission();
    }, []);

    useEffect(() => {
        if (weather) {
            console.log("Resolved Location Name:", weather.name);
            console.log("Weather Icon Code:", weather.weather[0]?.icon);
        }
    }, [weather]);

    const askLocationPermission = () => {
        Alert.alert(
            "Location Access",
            "Do you allow the app to access your location for precise weather forecasts?",
            [
                {
                    text: "Deny",
                    onPress: () =>
                        fetchWeather(
                            DEFAULT_LOCATION.latitude,
                            DEFAULT_LOCATION.longitude
                        ),
                    style: "cancel",
                },
                {
                    text: "Allow",
                    onPress: requestLocationPermission,
                },
            ],
            { cancelable: false }
        );
    };

    const requestLocationPermission = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status === "granted") {
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });
                console.log(
                    "Fetched Coordinates:",
                    location.coords.latitude,
                    location.coords.longitude
                );
                fetchWeather(
                    location.coords.latitude,
                    location.coords.longitude
                );
            } else {
                Alert.alert(
                    "Notice",
                    "Permission denied. Using default location."
                );
                fetchWeather(
                    DEFAULT_LOCATION.latitude,
                    DEFAULT_LOCATION.longitude
                );
            }
        } catch (error) {
            console.error("Location error:", error);
            Alert.alert(
                "Error",
                "Unable to fetch location. Using default location."
            );
            fetchWeather(DEFAULT_LOCATION.latitude, DEFAULT_LOCATION.longitude);
        }
    };

    const fetchWeather = async (latitude, longitude) => {
        try {
            const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
            );
            console.log("Weather API Response:", response.data);
            setWeather(response.data);
        } catch (error) {
            console.error("Error fetching weather data:", error);
            Alert.alert("Error", "Failed to fetch weather data.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return (
        <ScrollView>
            <View style={styles.content}>
                {/* Top Content */}
                <View style={styles.top_content}>
                    <ImageBackground
                        source={images.topBG}
                        style={styles.top_background}>
                        <Text style={styles.top_title}>{"SECURITY."}</Text>
                        <Text style={styles.top_title}>{"SAFETY."}</Text>
                        <Text style={styles.top_text}>
                            {
                                "Welcome to Sewr. The one-stop app for water safety. Be safe out there, Dumaguetenos!"
                            }
                        </Text>
                    </ImageBackground>
                </View>

                {/* Mid Content */}
                <View style={styles.mid_content}>
                    <Text
                        style={
                            styles.greeting
                        }>{`Hello, ${userFirstName}.`}</Text>
                    <View style={styles.widget}>
                        {/* Location Row */}
                        <View style={styles.location}>
                            <Image source={images.pin} style={styles.pin} />
                            <Text style={styles.location_text}>
                                {weather?.name || "Dumaguete"}
                            </Text>
                        </View>

                        {/* Temperature Display */}
                        <View style={styles.tempContainer}>
                            <Text style={styles.temp}>
                                {weather ? Math.round(weather.main.temp) : "--"}
                            </Text>
                            <Text style={styles.degree}>°C</Text>
                        </View>

                        {/* Divider */}
                        <View style={styles.divider} />

                        {/* Weather Icon */}
                        {weather?.weather[0]?.icon && (
                            <Image
                                source={
                                    images.weatherIcons[weather.weather[0].icon]
                                } // Use weatherIcons from images.js
                                style={styles.weatherIcon}
                            />
                        )}

                        {/* Weather Description */}
                        <Text style={styles.weatherText}>
                            {weather ? weather.weather[0].description : "--"}
                        </Text>
                    </View>
                </View>

                {/* Bottom Content */}
                <View style={styles.btm_content}>
                    <ImageBackground
                        source={images.bottomBG}
                        style={styles.bottom_background}>
                        <Text style={styles.bottom_title}>
                            {"Found a flooded area?"}
                        </Text>
                        <TouchableOpacity
                            style={styles.report_btn}
                            onPress={() =>
                                navigation.navigate("Create", { userID })
                            }>
                            <Text style={styles.report_text}>
                                {"Report it here!"}
                            </Text>
                        </TouchableOpacity>
                    </ImageBackground>
                </View>
            </View>
        </ScrollView>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: "#fff",
        overflow: "scroll",
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
        marginTop: 20,
    },

    greeting: {
        //styling
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 32,
        color: "#477EB0",
        //positioning
        paddingLeft: 15,
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
        backgroundColor: "#DEDEDE",
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

    weatherIcon: {
        width: 60,
        height: 60,
    },

    // BOTTOM CONTENT ======================================
    btm_content: {
        marginTop: 30,
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
