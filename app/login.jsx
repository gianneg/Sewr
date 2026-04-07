import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Touchable } from "react-native";
import { supabase } from "../lib/supabase";
import * as Crypto from "expo-crypto";
import images from "../constants/images";
import styles from "../styles/loginStyles";

const Login = ({ navigation }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function hashPassword(password) {
        return await Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, password);
    }

    const handleLogin = async () => {
        if (email.trim() === "" || password.trim() === "") {
            Alert.alert("Empty Input", "Please fill in both email and password.");
            return;
        }

        try {
            const { data: existingUser, error } = await supabase
                .from("USER")
                .select("userID, userEmail, userPassword, userFirstName, adminStatus")
                .eq("userEmail", email)
                .single();

            if (error) {
                console.error("Fetch Error:", error);
                Alert.alert("Login Failed", "Invalid email or account does not exist.");
                return;
            }

            const hashedPassword = await hashPassword(password);
            if (hashedPassword !== existingUser.userPassword) {
                Alert.alert("Login Failed", "Invalid password.");
                return;
            }

            Alert.alert("Login Successful", `Welcome, ${existingUser.userFirstName}!`);

            navigation.reset({
                index: 0,
                routes: [
                    {
                        name: "Tabs",
                        params: {
                            userID: existingUser.userID,
                            userFirstName: existingUser.userFirstName,
                            userEmail: existingUser.userEmail,
                            adminStatus: existingUser.adminStatus,
                        },
                    },
                ],
            });
        } catch (error) {
            console.error("Login Error:", error);
            Alert.alert("Error", "An unexpected error occurred. Please try again.");
        }
    };

    return (
        <View style={styles.container}>
            <Image source={images.logo} style={styles.logoIcon} />
            <Text style={styles.label}>E-mail:</Text>
            <TextInput
                style={styles.input}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                placeholder="Email@address.com"
                autoCapitalize="none"
            />
            <Text style={styles.label}>Password:</Text>
            <TextInput
                style={styles.input}
                secureTextEntry={true}
                value={password}
                onChangeText={setPassword}
                placeholder="Password"
                autoCapitalize="none"
            />
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            

            {/* Sign-up Section */}
            <View style={styles.signUpContainer}>
                <Text style={styles.signUpText}>New here?</Text>

                <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
                    <Text style={styles.signUpButtonText}>Sign-up</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default Login;
