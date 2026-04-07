//package imports
import React, { useState } from "react";
import {
    Image,
    Text,
    TextInput,
    View,
    Pressable,
    Alert,
    AppState,
    ScrollView,
} from "react-native";
import { supabase } from "../lib/supabase";
import * as Crypto from "expo-crypto";

//styling import
import styles from "../styles/signupStyles";

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

    //function to handle registration logic
    const handleRegister = async () => {
        // Validate input fields
        if (
            email.length === 0 ||
            firstName.length === 0 ||
            lastName.length === 0 ||
            password.length === 0 ||
            confirmPassword.length === 0
        ) {
            Alert.alert("Attention!", "Please input all the fields.");
            return;
        }

        if (!isPasswordValid(password)) {
            Alert.alert(
                "Error",
                "Password must be at least 8 characters long and contain at least one number."
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        try {
            console.log("Checking if user already exists...");

            // Query the database for the email
            const { data: existingUser, error: fetchError } = await supabase
                .from("USER")
                .select("*")
                .eq("userEmail", email);

            if (fetchError) {
                console.error("Fetch Error:", fetchError);
                throw fetchError;
            }

            if (existingUser && existingUser.length > 0) {
                Alert.alert("Error", "Email already used.");
                return;
            }

            // Hash password
            console.log("Hashing password...");
            const hashedPassword = await hashPassword(password);
            console.log("Hashed password:", hashedPassword);

            // Insert the new user into the database
            console.log("Inserting new user...");
            const { error: insertError } = await supabase.from("USER").insert([
                {
                    userFirstName: firstName,
                    userLastName: lastName,
                    userEmail: email,
                    userPassword: hashedPassword,
                },
            ]);

            if (insertError) {
                console.error("Insert Error:", insertError);
                throw insertError;
            }

            Alert.alert("Success", "Registration successful!");
            navigation.navigate("Login");
        } catch (error) {
            console.error("Error during registration:", error);
            Alert.alert("Error", "Something went wrong during registration.");
        }
    };

    return (
        <ScrollView style={styles.container2}>
            <View style={styles.container}>
                {/* First Name */}
                <Text style={styles.label}>First Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={firstName}
                    onChangeText={(text) => setFirstName(text)}
                />

                {/* Last Name */}
                <Text style={styles.label}>Last Name:</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={lastName}
                    onChangeText={(text) => setLastName(text)}
                />

                {/* E-mail */}
                <Text style={styles.label}>E-mail:</Text>
                <TextInput
                    style={styles.input}
                    keyboardType="email-address"
                    placeholder="Email@address.com"
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    autoCapitalize="none"
                />

                {/* Password */}
                <Text style={styles.label}>Password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Password"
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    autoCapitalize="none"
                />

                {/* Confirm Password */}
                <Text style={styles.label}>Confirm Password:</Text>
                <TextInput
                    style={styles.input}
                    secureTextEntry={true}
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    autoCapitalize="none"
                />

                {/* Sign-up Button */}
                <Pressable
                    style={styles.signupButton}
                    onPress={() => handleRegister()}>
                    <Text style={styles.signupButtonText}>Sign-up</Text>
                </Pressable>

                {/* Already Have an Account */}
                <Pressable
                    style={styles.loginLink}
                    onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.loginLinkText}>
                        I already have an account.
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
};

export default Signup;
