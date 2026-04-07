import React, { useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    ScrollView,
    Pressable,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "../lib/supabase";
import Header from "../components/header";
import * as Crypto from "expo-crypto";
import edit from "../assets/images/edit.png";

const EditUserProfile = ({ navigation, route }) => {
    const { userID, userFirstName } = route.params || {};
    const [firstName, setFirstName] = useState(userFirstName || "");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                console.log(`Fetching user profile for userID: ${userID}`);
                const { data, error } = await supabase
                    .from("USER")
                    .select(
                        "userFirstName, userLastName, userEmail, profilepicture"
                    )
                    .eq("userID", userID)
                    .single();

                if (error) throw error;

                console.log("Fetched user profile:", data);

                setFirstName(data.userFirstName);
                setLastName(data.userLastName);
                setEmail(data.userEmail);

                const profilePicUrl = data.profilepicture
                    ? `https://cqsgdjdtzmjokxyizqyk.supabase.co/storage/v1/object/public/images/profile/${data.profilepicture}`
                    : null;

                setProfilePicture(profilePicUrl);
            } catch (error) {
                console.error("Error fetching user profile:", error.message);
                Alert.alert("Error", "Failed to fetch user profile.");
            }
        };

        if (userID) {
            fetchUserProfile();
        } else {
            Alert.alert("Session Expired", "Please log in again.");
            navigation.reset({
                index: 0,
                routes: [{ name: "LoginScreen" }],
            });
        }
    }, [userID, navigation]);

    const handleProfilePictureUpdate = async () => {
        try {
            console.log("Opening image picker...");
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });
    
            if (!result.canceled) {
                const { uri } = result.assets[0];
                const fileName = `${userID}-profile.jpg`;
    
                console.log("Selected image URI:", uri);
    
                // Convert the local file into a format suitable for upload
                const formData = new FormData();
                formData.append("file", {
                    uri,
                    name: fileName,
                    type: "image/jpeg", // Adjust the type based on the selected file
                });
    
                console.log("Deleting old profile picture...");
                const { error: deleteError } = await supabase.storage
                    .from("images")
                    .remove([`profile/${fileName}`]);
    
                if (deleteError && deleteError.status !== 404) {
                    console.error("Error deleting old profile picture:", deleteError.message);
                    Alert.alert("Error", "Failed to delete old profile picture.");
                    return;
                }
    
                console.log("Uploading image to storage...");
                const { error: uploadError } = await supabase.storage
                    .from("images")
                    .upload(`profile/${fileName}`, formData, {
                        contentType: "multipart/form-data",
                        upsert: true,
                    });
    
                if (uploadError) {
                    console.error("Error uploading profile picture:", uploadError.message);
                    Alert.alert("Error", "Failed to upload profile picture.");
                    return;
                }
    
                console.log("Updating user profile...");
                const { error: updateError } = await supabase
                    .from("USER")
                    .update({ profilepicture: fileName })
                    .eq("userID", userID);
    
                if (updateError) {
                    console.error("Error updating user profile:", updateError.message);
                    Alert.alert("Error", "Failed to update profile picture.");
                    return;
                }
    
                const profilePicUrl = `https://cqsgdjdtzmjokxyizqyk.supabase.co/storage/v1/object/public/images/profile/${fileName}`;
                setProfilePicture(profilePicUrl);
    
                Alert.alert("Success", "Profile picture updated successfully!");
            } else {
                console.log("Image picker canceled.");
            }
        } catch (error) {
            console.error("Unexpected error during profile picture update:", error.message);
            Alert.alert("Error", "An unexpected error occurred.");
        }
    };
    

    async function hashPassword(password) {
        const hashedPassword = await Crypto.digestStringAsync(
            Crypto.CryptoDigestAlgorithm.SHA256,
            password
        );
        return hashedPassword;
    }

    function isPasswordValid(password) {
        // (?=.*\d): This part ensures that the password contains at least one digit.
        // .{8,}: This part ensures that the password is at least 8 characters long.
        const passwordRegex = /^(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }

    const handleSubmission = async () => {
        // Validate form inputs
        if (!firstName || !lastName || !email) {
            Alert.alert("Error", "All fields are required.");
            return;
        }

        if (!email.includes("@")) {
            Alert.alert("Error", "Please enter a valid email.");
            return;
        }
        
        if (!isPasswordValid(newPassword)) {
            Alert.alert(
                "Error",
                "Password must be at least 8 characters long and contain at least one number."
            );
            return;
        }

        if (newPassword || confirmPassword) {
            if (newPassword !== confirmPassword) {
                Alert.alert("Error", "Passwords do not match.");
                return;
            }

            try {
                console.log("Updating password...");
                console.log(newPassword);
                const hashedPassword = await hashPassword(newPassword);
                console.log(hashedPassword);
                const { error: passwordError } = await supabase
                    .from("USER")
                    .update({ userPassword: hashedPassword })
                    .eq("userID", userID);

                if (passwordError) {
                    console.error(
                        "Error updating password:",
                        passwordError.message
                    );
                    throw passwordError;
                }

                console.log("Password updated successfully!");
                Alert.alert("Success", "Password updated successfully!");
            } catch (error) {
                console.error("Error updating password:", error.message);
                Alert.alert(
                    "Error",
                    "Failed to update password. Please try again."
                );
                return;
            }
        }

        try {
            console.log("Updating user profile in database...");
            const { data, error } = await supabase
                .from("USER")
                .update({
                    userFirstName: firstName,
                    userLastName: lastName,
                    userEmail: email,
                })
                .eq("userID", userID);

            if (error) {
                console.error("Error updating profile:", error.message);
                throw error;
            }

            console.log("Updated user profile data:", data);

            Alert.alert("Success", "Profile updated successfully!");
            navigation.navigate("UserProfile", {
                userID,
                refreshTimestamp: Date.now(),
            });
        } catch (error) {
            console.error("Error updating profile:", error.message);
            Alert.alert("Error", "Failed to update profile. Please try again.");
        }
    };

    return (
        <>
            <Header
                navigation={navigation}
                userID={userID}
                userFirstName={firstName}
                showBackBtn={true}
                showProfileIcon={false}
            />
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <Pressable onPress={handleProfilePictureUpdate}>
                        <Image
                            source={
                                profilePicture ? { uri: profilePicture } : edit
                            }
                            style={styles.userImage}
                        />
                    </Pressable>
                    <Text style={styles.label}>First Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={firstName}
                        onChangeText={setFirstName}
                        placeholder="First Name"
                    />
                    <Text style={styles.label}>Last Name:</Text>
                    <TextInput
                        style={styles.input}
                        value={lastName}
                        onChangeText={setLastName}
                        placeholder="Last Name"
                    />
                    <Text style={styles.label}>E-mail:</Text>
                    <TextInput
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                        placeholder="Email"
                        keyboardType="email-address"
                    />
                    <Text style={styles.label}>New Password:</Text>
                    <TextInput
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="New Password"
                        secureTextEntry={true}
                    />
                    <Text style={styles.label}>Confirm Password:</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                    />
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={handleSubmission}>
                        <Text style={styles.confirmButtonText}>
                            CONFIRM CHANGES
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </>
    );
};

export default EditUserProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    scrollViewContent: {
        flexGrow: 1,
        width: "100%",
    },
    userImage: {
        width: 150,
        height: 150,
        borderRadius: 75,
        marginTop: 5,
    },
    label: {
        width: "85%",
        fontSize: 16,
        fontFamily: "Inter_300Light",
        fontWeight: "600",
        color: "black",
        marginBottom: 5,
        marginLeft: 20,
        textAlign: "left",
    },
    input: {
        width: "85%",
        height: 55,
        borderColor: "#ccc",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "black",
        paddingHorizontal: 10,
        marginBottom: 15,
        fontFamily: "Inter_300Light",
    },
    confirmButton: {
        backgroundColor: "#075EAE",
        borderRadius: 12,
        width: "85%",
        height: 45,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    confirmButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontFamily: "Inter_600SemiBold",
    },
});
