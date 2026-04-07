import { View, Image, StyleSheet, Text, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { supabase } from "../lib/supabase";

import images from "../constants/images";

const Header = ({
    navigation,
    showProfileIcon = true,
    showBackBtn = false,
    userID,
    userFirstName,
}) => {
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {

            console.log("Fetching user profile for userID:", userID);
            const { data, error } = await supabase
                .from("USER")
                .select("profilepicture")
                .eq("userID", userID)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error.message);
                throw error;
            }

            console.log("Fetched user profile data:", data);

            const profilePicUrl = data.profilepicture
                ? `https://cqsgdjdtzmjokxyizqyk.supabase.co/storage/v1/object/public/images/profile/${data.profilepicture}`
                : null;

            console.log(profilePicUrl);
            setProfilePicture(profilePicUrl);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
    };

    const handleBackPress = () => {
        navigation.goBack();
    };

    const handleUserProfile = () => {
        if (!userID || !userFirstName) {
            console.error(
                "User data is missing in Header. Redirecting to Login."
            );
            navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
        } else {
            navigation.navigate("Profile", {
                screen: "UserProfile",
                params: { userID, userFirstName },
            });
        }
    };

    fetchUserProfile();

    return (
        <View style={styles.header}>
            {/* Back Button */}
            {showBackBtn && (
                <TouchableOpacity
                    onPress={handleBackPress}
                    style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            )}

            {/* Logo */}
            <Image source={images.logoWhite} style={styles.logoIcon} />

            {/* Conditionally render the profile icon */}
            {showProfileIcon && (
                <TouchableOpacity
                    onPress={handleUserProfile}
                    style={styles.profileButton}>
                    <Image
                        source={
                            profilePicture
                                ? { uri: profilePicture }
                                : images.user
                        }
                        style={styles.profileIcon}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        backgroundColor: "#477EB0",
        height: 35,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    logoIcon: {
        width: 90,
        height: 90,
        resizeMode: "contain",
        alignSelf: "center",
    },
    profileButton: {
        position: "absolute",
        right: 15,
    },
    profileIcon: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: -10,
    },

    backButton: {
        position: "absolute",
        left: 20,
    },
});
