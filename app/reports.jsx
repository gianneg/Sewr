// basic components
import React, { useEffect, useState, useCallback } from "react";
import {
    FlatList,
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import DateTimePicker from "@react-native-community/datetimepicker";
// import Geolocation from "@react-native-community/geolocation";
import * as Location from "expo-location";
import { useFocusEffect } from "@react-navigation/native";
import RNPickerSelect from "react-native-picker-select";
import { Picker } from "@react-native-picker/picker";
// connection
import { supabase } from "../lib/supabase";

// constants
import icons from "../constants/icons";

import {
    filterByDate,
    onDateChange,
    fetchAndSortReportsByDistance,
} from "../components/filterByTimeAndDistanceFunctions";

const Reports = ({ adminStatus }) => {
    const [reports, setReports] = useState([]);
    const [message, setMessage] = useState("");
    const [activeButton, setActiveButton] = useState("viewAll");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedValue, setSelectedValue] = useState("viewAll");

    console.log("General Reports");

    const fetchReports = async () => {
        try {
            const { data, error } = await supabase
                .from("REPORT")
                .select(
                    "reportID, reportTitle, reportLocation, status, createdAt, imageUrl"
                )
                .eq("status", "Active")
                .order("createdAt", { ascending: false });

            if (error) {
                console.error("Error fetching reports:", error);
                setMessage("Failed to fetch reports. Please try again later.");
                return;
            }

            if (data.length === 0) {
                setMessage("No reports");
            } else {
                const currentTimestamp = new Date(); // Get current date and time

                // Loop through the reports and check the time difference
                const updatedReports = data.map((report) => {
                    const reportCreatedAt = new Date(report.createdAt); // Convert the createdAt timestamp to a Date object
                    const timeDifference = currentTimestamp - reportCreatedAt; // Get the time difference in milliseconds
                    const timeDifferenceInHours =
                        timeDifference / (1000 * 60 * 60); // Convert time difference to hours

                    // If the report is older than 72 hours, set its status to "Inactive"
                    if (timeDifferenceInHours > 72) {
                        // Update the status of the report
                        supabase
                            .from("REPORT")
                            .update({ status: "Inactive" })
                            .eq("reportID", report.reportID)
                            .then(({ error }) => {
                                if (error) {
                                    console.error(
                                        "Error updating status:",
                                        error
                                    );
                                } else {
                                    console.log(
                                        `Updated report ${report.reportID} to Inactive.`
                                    );
                                }
                            });
                    }
                    return {
                        ...report,
                        createdAt: reportCreatedAt.toLocaleString("en-US", {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                        }),
                    };
                });

                setReports(updatedReports);
                setMessage("");
            }
        } catch (err) {
            console.error("Unexpected error:", err);
            setMessage("An unexpected error occurred. Please try again later.");
        }
    };

    const setActive = async (reportID) => {
        const { error } = await supabase
            .from("REPORT")
            .update({ status: "Active" })
            .eq("reportID", reportID);

        if (error) {
            console.error("Failed to update status:", error);
        } else {
            fetchReports();
            console.log("Updated status");
        }
    };

    const handleDateFilter = async () => {
        const dateAtMidnight = new Date(selectedDate);
        dateAtMidnight.setHours(0, 0, 0, 0);

        await filterByDate(
            dateAtMidnight.toISOString(),
            setReports,
            setMessage,
            supabase
        );
    };

    const handleDistanceFilter = async () => {
        await fetchAndSortReportsByDistance(
            setReports,
            setMessage,
            adminStatus,
            supabase
        );
    };

    // Render each item in the list
    const renderItem = ({ item }) => {
        const imageUrl = `https://cqsgdjdtzmjokxyizqyk.supabase.co/storage/v1/object/public/images/${item.imageUrl}`;
        console.log(imageUrl);

        return (
            <View>
                <View style={styles.card}>
                    {/* Render Image if valid URL */}
                    {imageUrl ? (
                        <Image
                            source={{ uri: imageUrl }}
                            style={styles.image}
                        />
                    ) : (
                        <Text>No image available</Text>
                    )}

                    <View style={styles.textContainer}>
                        <View style={styles.row}>
                            <Image source={icons.floods} style={styles.icon} />
                            <View style={styles.textContent}>
                                <Text style={styles.title}>
                                    {item.reportTitle}
                                </Text>
                                <Text style={styles.time}>
                                    {item.createdAt}
                                </Text>
                                <Text style={styles.location}>
                                    {item.reportLocation}
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    const handleValueChange = (value) => {
        setActiveButton(value);
        setSelectedValue(value);
        if (value === "viewAll") {
            fetchReports();
        } else if (value === "filterByDate") {
            handleDateFilter();
        } else if (value === "filterByDistance") {
            handleDistanceFilter();
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReports();
        }, [])
    );

    useEffect(() => {
        fetchReports();
    }, []);

    return (
        <View style={styles.reportsContainer}>
            <StatusBar style="auto" />

            <View style={{ borderBottomWidth: 1, marginBottom: 20 }}>
                <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue) => handleValueChange(itemValue)}
                    style={{ width: "100%" }}>
                    <Picker.Item label="View All" value="viewAll" />
                    <Picker.Item label="Filter by Date" value="filterByDate" />
                    <Picker.Item
                        label="Filter by Distance"
                        value="filterByDistance"
                    />
                </Picker>
            </View>

            {activeButton === "filterByDate" && (
                <View>
                    <Text style={{ textAlign: "center" }}>
                        Selected Date:{"\n"}
                        <Text style={{ fontWeight: "bold" }}>
                            {selectedDate.toDateString()}
                        </Text>
                    </Text>

                    <View style={styles.DTPBtnContainer}>
                        <TouchableOpacity
                            style={styles.DTPBtn}
                            onPress={() => setShowDatePicker(true)}>
                            <Text style={styles.DTPContent}>Select Date</Text>
                        </TouchableOpacity>
                        {showDatePicker && (
                            <DateTimePicker
                                value={selectedDate}
                                mode="date"
                                display="spinner"
                                onChange={(event, date) =>
                                    onDateChange(
                                        event,
                                        date,
                                        setShowDatePicker,
                                        setSelectedDate
                                    )
                                }
                            />
                        )}
                    </View>
                    <TouchableOpacity
                        style={styles.filterBtn}
                        onPress={handleDateFilter}>
                        <Text style={styles.filterText}>Filter</Text>
                    </TouchableOpacity>
                </View>
            )}

            {message ? (
                <Text style={styles.message}>{message}</Text>
            ) : (
                <FlatList
                    data={reports}
                    keyExtractor={(item) =>
                        item.id ? item.id.toString() : String(Math.random())
                    }
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingBottom: 200 }}
                    style={styles.list}
                />
            )}
        </View>
    );
};

export default Reports;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    filterContainer: {
        flexDirection: "row",
        justifyContent: "space-around",
        marginTop: 10,
    },
    filterButtonv: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#808080",
        width: 80,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    filterButtont: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#808080",
        width: 130,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    filterButtond: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: "#808080",
        width: 140,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    filterText: {
        color: "#FFF",
        fontSize: 16,
        textAlign: "center",
    },
    listContent: {
        paddingBottom: 100,
    },
    card: {
        backgroundColor: "#D9D9D9",
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 20,
        padding: 10,
    },
    image: {
        width: "100%",
        height: 180,
        borderRadius: 10,
        marginBottom: 10,
    },
    textContainer: {
        paddingVertical: 5,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        width: 24,
        height: 24,
        marginRight: 5,
        marginTop: -20,
    },
    textContent: {
        flex: 1,
    },
    title: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
    time: {
        fontWeight: "bold",
        fontSize: 16,
        color: "#000",
    },
    location: {
        color: "#000",
        fontSize: 14,
        marginTop: 2,
    },
    DTPBtnContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
    },
    DTPBtn: {
        backgroundColor: "#075EAE",
        borderColor: "white",
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        width: "47.3%",
    },
    DTPContent: {
        textAlign: "center",
        color: "white",
        fontWeight: "bold",
    },

    filterBtn: {
        backgroundColor: "#075EAE",
        borderColor: "white",
        borderWidth: 1,
        paddingTop: 5,
        paddingBottom: 5,
        marginLeft: 10,
        marginRight: 10,
        color: "white",
        textAlign: "center",
    },

    activeButton: {
        backgroundColor: "#075EAE", // Active button color
    },
});
