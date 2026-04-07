import React from "react";
import ReportsAdmin from "../app/reportsAdmin";
import Reports from "../app/reports";

const ReportsScreen = ({ route }) => {
    const { userID, userFirstName, adminStatus } = route.params;
    console.log("Admin Status (type):", typeof adminStatus);
    console.log("Admin Status (value):", adminStatus);

    console.log("Is Admin:", adminStatus);

    return adminStatus ? (
        <ReportsAdmin
            userID={userID}
            userFirstName={userFirstName}
            adminStatus={adminStatus}
        />
    ) : (
        <Reports
            userID={userID}
            userFirstName={userFirstName}
            adminStatus={adminStatus}
        />
    );
};

export default ReportsScreen;
