import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Image,
    Text,
    View,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
} from "react-native";
import { supabase } from "../lib/supabase";
import Header from "../components/header";
import prof from "../assets/images/userprof.png";
import { useFocusEffect } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";

const UserProfile = ({ route, navigation }) => {
    const { userID } = route.params || {};
    const [userEmail, setUserEmail] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [firstName, setFirstName] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async () => {
        try {
            console.log("Fetching user profile for userID:", userID);
            const { data, error } = await supabase
                .from("USER")
                .select(
                    "userEmail, profilepicture, userFirstName, userLastName"
                )
                .eq("userID", userID)
                .single();

            if (error) {
                console.error("Error fetching user profile:", error.message);
                throw error;
            }

            console.log("Fetched user profile data:", data);

            const maskedEmail = data.userEmail.replace(
                /(.{1}).*(@.*)/,
                "$1***$2"
            );
            setUserEmail(maskedEmail);

            const profilePicUrl = data.profilepicture
                ? `https://cqsgdjdtzmjokxyizqyk.supabase.co/storage/v1/object/public/images/profile/${data.profilepicture}`
                : null;

            setProfilePicture(profilePicUrl);
            setFirstName(data.userFirstName);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch user profile.");
        } finally {
            setLoading(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            console.log("Screen focused. Re-fetching user profile...");
            setLoading(true);
            fetchUserProfile();
        }, [route.params?.refreshTimestamp]) // Re-fetch when refreshTimestamp changes
    );

    const handleEditProfile = () => {
        navigation.navigate("EditProfile", { userID });
    };

    const handleLogout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: "Login" }],
                })
            );
        } catch (error) {
            console.error("Error logging out:", error.message);
            Alert.alert("Logout Failed", "Please try again.");
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#075EAE" />
            </View>
        );
    }

    return (
        <>
            <Header
                navigation={navigation}
                userID={userID}
                userFirstName={firstName}
                showBackBtn={false}
                showProfileIcon={false}
            />
            <View style={styles.container}>
                <Image
                    source={profilePicture ? { uri: profilePicture } : prof}
                    style={styles.userImage}
                />
                <Text style={styles.username}>{firstName}</Text>
                <Text style={styles.email}>
                    E-mail: {userEmail || "Not available"}
                </Text>
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleEditProfile}>
                    <Text style={styles.editButtonText}>EDIT USER PROFILE</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={handleLogout}>
                    <Text style={styles.logoutButtonText}>LOG OUT</Text>
                </TouchableOpacity>
            </View>
        </>
    );
};

export default UserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    userImage: {
        width: 180,
        height: 180,
        borderRadius: 90,
        marginBottom: 20,
        marginTop: 15,
    },
    username: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        marginBottom: 10,
        fontFamily: "Inter_600SemiBold",
    },
    email: {
        fontSize: 17,
        fontWeight: "600",
        color: "black",
        marginBottom: 30,
        fontFamily: "Inter_300Light",
        textAlign: "center",
    },
    editButton: {
        backgroundColor: "#075EAE",
        borderRadius: 12,
        width: 350,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 30,
    },
    editButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Inter_600SemiBold",
    },
    logoutButton: {
        backgroundColor: "#075EAE",
        borderRadius: 12,
        width: 350,
        height: 45,
        justifyContent: "center",
        alignItems: "center",
    },
    logoutButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Inter_600SemiBold",
    },
});
