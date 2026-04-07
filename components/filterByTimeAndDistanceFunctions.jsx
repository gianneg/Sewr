export const filterByDate = async (
    userInputDate,
    setReports,
    setMessage,
    supabase
) => {
    if (!userInputDate) {
        console.error("Invalid date provided");
        setMessage("Invalid date. Please provide a valid date.");
        return;
    }

    // Parse the input date string into a Date object
    const parsedDate = new Date(userInputDate);
    if (isNaN(parsedDate.getTime())) {
        console.error("Invalid date format");
        setMessage("Invalid date format. Please provide a valid date.");
        return;
    }

    const startOfDay = new Date(Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        0, 0, 0, 0
    ));

    const endOfDay = new Date(Date.UTC(
        parsedDate.getFullYear(),
        parsedDate.getMonth(),
        parsedDate.getDate(),
        23, 59, 59, 999
    ));

    try {
        const { data, error } = await supabase
            .from("REPORT")
            .select(
                "reportID, reportTitle, reportLocation, status, createdAt, imageUrl"
            )
            .gte("createdAt", startOfDay.toISOString())
            .lt("createdAt", endOfDay.toISOString())
            .in("status", ["Active", "Inactive"])
            .order("createdAt", { ascending: true });

        if (error) {
            console.error(error);
            setMessage("Error fetching reports.");
        } else {
            if (data.length === 0) {
                setMessage("No reports found.");
            } else {
                const formattedData = data.map((report) => ({
                    ...report,
                    createdAt: new Date(report.createdAt).toLocaleString(
                        "en-US",
                        {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                        }
                    ),
                }));

                setReports(formattedData);
                setMessage("");
            }
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        setMessage("An unexpected error occurred. Please try again later.");
    }
};

export const onDateChange = (
    event,
    selectedDate,
    setShowDatePicker,
    setSelectedDate
) => {
    setShowDatePicker(false);
    if (selectedDate) {
        const newDate = new Date(selectedDate);
        newDate.setHours(0, 0, 0, 0);
        setSelectedDate(newDate);
    }
};

// FILTER BY DISTANCE ========================================================================
import * as Location from "expo-location";

export const fetchAndSortReportsByDistance = async (
    setReports,
    setMessage,
    adminStatus,
    supabase
) => {
    const currentLocation = await getCurrentLocation();
    if (!currentLocation) return;

    let data, error;

    try {
        const query = supabase
            .from("REPORT")
            .select(
                "reportID, reportTitle, reportLocation, status, createdAt, imageUrl, reportLatitude, reportLongitude"
            );

        if (!adminStatus) {
            query.eq("status", "Active");
        } else if (adminStatus) {
            query.in("status", ["Active", "Pending"]);
        }

        ({ data, error } = await query);

        if (error) {
            console.error("Error fetching reports:", error);
            setMessage("Failed to fetch reports. Please try again later.");
        } else {
            const sortedReports = data
                .map((report) => {
                    const distance = calculateDistance(
                        currentLocation.latitude,
                        currentLocation.longitude,
                        report.reportLatitude,
                        report.reportLongitude
                    );
                    return { ...report, distance };
                })
                .sort((a, b) => a.distance - b.distance);

            const formattedData = sortedReports.map((report) => ({
                ...report,
                createdAt: new Date(report.createdAt).toLocaleString("en-US", {
                    month: "long",
                    day: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }));

            setReports(formattedData);
            setMessage("");
        }
    } catch (err) {
        console.error("Unexpected error:", err);
        setMessage("An unexpected error occurred. Please try again later.");
    }
};

export const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        alert("Permission to access location was denied");
        return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
    };
};

export const toRadians = (degrees) => degrees * (Math.PI / 180);

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
};
