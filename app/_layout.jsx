// basic packages
import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import * as Font from "expo-font";

import * as ImagePicker from "expo-image-picker";

import { Inter_300Light } from "@expo-google-fonts/inter";
import { Inter_600SemiBold } from "@expo-google-fonts/inter";

import Index from "./index";

import styles from "../styles/_layoutStyles";

const App = () => {
    const [location, setLocation] = useState(null);
    const [permissionGranted, setPermissionGranted] = useState(false);
    const [fontLoaded, setFontLoaded] = useState(false);

    const requestPermissions = async () => {
        // Request media library permissions
        const { status: mediaStatus } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (mediaStatus !== "granted") {
            Alert.alert("Permission Denied", "We need access to your gallery.");
        }
    };

    const loadFonts = async () => {
        await Font.loadAsync({
            Inter_300Light: Inter_300Light,
            Inter_600SemiBold: Inter_600SemiBold,
        });
        setFontLoaded(true);
    };

    useEffect(() => {
        loadFonts();
        requestPermissions();
    }, []);

    if (!fontLoaded) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    return <Index />;
};

export default App;
