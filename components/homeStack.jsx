import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "../app/home";
import CreateScreen from "../app/create";
import Header from "./header";

const HomeStack = createStackNavigator();

function HomeStackScreen({ route }) {
    const { userID, userFirstName, adminStatus } = route.params;
    console.log("Tabs -> HomeStack: ", userID);

    return (
        <HomeStack.Navigator initialRouteName="Home">
            <HomeStack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    headerShown: true,
                    header: ({ navigation }) => (
                        <Header navigation={navigation} userID={userID} userFirstName={userFirstName} />
                    ),
                }}
                initialParams={{
                    userID: userID || null,
                    userFirstName: userFirstName || "Guest",
                    adminStatus: adminStatus || false,
                }}
            />
            <HomeStack.Screen
                name="Create"
                component={CreateScreen}
                options={{
                    headerShown: true,
                    header: ({ navigation }) => (
                        <Header navigation={navigation} userID={userID} showProfileIcon={false} showBackBtn={true} />
                    ),
                }}
            />
        </HomeStack.Navigator>
    );
}

export default HomeStackScreen;
