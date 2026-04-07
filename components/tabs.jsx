import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Image, StyleSheet, Text } from "react-native";

import HomeStackScreen from "../components/homeStack";
import ReportsScreen from "./reportsRouting";
import Map from "../app/map";
import Header from "./header";

import icons from "../constants/icons";

const Tab = createBottomTabNavigator();

const TabIcon = ({ icon, name, focused, style }) => (
    <View style={styles.tabIconContainer}>
        <Image source={icon} resizeMode="contain" style={style} />
        <Text style={focused ? styles.activeTab : styles.inactiveTab}>
            {name}
        </Text>
    </View>
);

const Tabs = ({ route }) => {
    const { userID, userFirstName, adminStatus } = route.params || {};

    return (
        <Tab.Navigator
            initialRouteName="home"
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: { height: 51, backgroundColor: "#E4EBF2" },
                tabBarItemStyle: {
                    width: 100,
                    justifyContent: "center",
                    alignItems: "center",
                },
            }}>
            <Tab.Screen
                name="map"
                component={Map}
                options={{
                    header: ({ navigation }) => (
                        <Header
                            navigation={navigation}
                            userID={userID}
                            userFirstName={userFirstName}
                            adminStatus={adminStatus}
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.map}
                            name="Map"
                            focused={focused}
                            style={{ width: 30, height: 32, marginTop: 3 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="home"
                component={HomeStackScreen}
                initialParams={{ userID, userFirstName, adminStatus }}
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.home}
                            name=""
                            focused={focused}
                            style={{ width: 70, height: 70 }}
                        />
                    ),
                }}
            />
            <Tab.Screen
                name="reports"
                component={ReportsScreen}
                initialParams={{ userID, userFirstName, adminStatus }}
                options={{
                    header: ({ navigation }) => (
                        <Header
                            navigation={navigation}
                            userID={userID}
                            userFirstName={userFirstName}
                            adminStatus={adminStatus}
                        />
                    ),
                    tabBarIcon: ({ focused }) => (
                        <TabIcon
                            icon={icons.reports}
                            name="Reports"
                            focused={focused}
                            style={{ width: 35, height: 35, marginTop: 3 }}
                        />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default Tabs;

const styles = StyleSheet.create({
    tabIconContainer: {
        alignItems: "center",
        justifyContent: "center",
        width: 40,
    },
    activeTab: {
        fontWeight: "bold",
        fontSize: 10,
        color: "#477EB0",
        textAlign: "center",
    },
    inactiveTab: {
        fontWeight: "normal",
        fontSize: 10,
        color: "#477EB0",
        textAlign: "center",
    },
});
