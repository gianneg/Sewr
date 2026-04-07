import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createStackNavigator } from "@react-navigation/stack";
import supabase from "../lib/supabase";
import LoginScreen from "./login";
import SignupScreen from "./signup";
import HomeScreen from "../components/tabs";
import ProfilePressScreen from "../components/profileStack";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const AuthStack = createStackNavigator();

import styles from "../styles/indexStyles";

const index = () => {
    return (
        <GestureHandlerRootView>
            <SafeAreaProvider>
                <NavigationContainer>
                    <SafeAreaView
                        style={styles.safeArea}
                        edges={["top", "left", "right"]}>
                        <AuthStack.Navigator>
                            <AuthStack.Screen
                                name="Login"
                                component={LoginScreen}
                                options={{ headerShown: false }}
                            />
                            <AuthStack.Screen
                                name="Signup"
                                component={SignupScreen}
                                options={{ headerShown: false }}
                            />
                            <AuthStack.Screen
                                name="Tabs"
                                component={HomeScreen}
                                options={{
                                    headerShown: false,
                                }}
                            />
                            <AuthStack.Screen
                                name="Profile"
                                component={ProfilePressScreen}
                                options={{ headerShown: false }}
                            />
                        </AuthStack.Navigator>
                    </SafeAreaView>
                </NavigationContainer>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
};

export default index;
