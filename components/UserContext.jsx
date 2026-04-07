import React, { createContext, useState, useContext } from "react";

// Create UserContext
const UserContext = createContext();

// UserProvider component to provide user context to the app
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState({
        userID: null,
        userFirstName: null,
        adminStatus: null,
        userEmail: null,
    });

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// Custom hook to access user context
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
