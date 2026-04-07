import { createStackNavigator } from "@react-navigation/stack";
import UserProfile from "../app/userprofile";
import EditProfile from "../app/edituser";

const ProfileStack = createStackNavigator();

const ProfilePressScreen = () => {
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen
                name="UserProfile"
                component={UserProfile}
                options={{
                    headerShown: false,
                }}
            />
            <ProfileStack.Screen
                name="EditProfile"
                component={EditProfile}
                options={{
                    headerShown: false, 
                }}
            />
        </ProfileStack.Navigator>
    );
};

export default ProfilePressScreen;
