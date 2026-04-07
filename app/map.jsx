import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    Text,
    Alert,
    TextInput,
    ActivityIndicator,
} from "react-native";
import MapView, { Marker, Callout, UrlTile } from "react-native-maps";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";
import * as Location from "expo-location";

const Map = () => {
    const [currentLatitude, setLatitude] = useState(null);
    const [currentLongitude, setLongitude] = useState(null);
    const [markers, setMarkers] = useState([]);
    const [filteredMarkers, setFilteredMarkers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [searchLatitude, setSearchLatitude] = useState(null);
    const [searchLongitude, setSearchLongitude] = useState(null);

    const fetchLocations = async () => {
        try {
            const { data, error } = await supabase
                .from("REPORT")
                .select("*")
                .eq("status", "Active");
            if (error) throw error;
            setMarkers(data);
        } catch (error) {
            Alert.alert("Error", "Failed to fetch locations.");
        }
    };

    const handleLocationCoords = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                Alert.alert(
                    "Permission Denied",
                    "Location permission is required."
                );
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setLatitude(location.coords.latitude);
            setLongitude(location.coords.longitude);
            console.log("current latitude:", currentLatitude);
            console.log("current longitude:", currentLongitude);
        } catch {
            Alert.alert("Error", "Failed to fetch user location.");
        }
    };

    const refreshMap = async () => {
        setIsLoading(true);
        await handleLocationCoords();
        await fetchLocations();
        setIsLoading(false);
    };

    useFocusEffect(
        useCallback(() => {
            refreshMap();
        }, [])
    );

    useEffect(() => {
        const referenceLatitude = searchLatitude || currentLatitude;
        const referenceLongitude = searchLongitude || currentLongitude;

        if (referenceLatitude && referenceLongitude) {
            const filtered = markers.filter((marker) => {
                const lat = parseFloat(marker.reportLatitude);
                const lon = parseFloat(marker.reportLongitude);

                return (
                    !isNaN(lat) &&
                    !isNaN(lon) &&
                    (marker.reportLocation
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                        marker.reportTitle
                            .toLowerCase()
                            .includes(searchQuery.toLowerCase()))
                );
            });
            setFilteredMarkers(filtered);
        }
    }, [
        searchQuery,
        searchLatitude,
        searchLongitude,
        currentLatitude,
        currentLongitude,
        markers,
    ]);

    useEffect(() => {
        if (!searchQuery) {
            setSearchLatitude(null);
            setSearchLongitude(null);
        }
        const fetchData = async () => {
            await handleLocationCoords();
            await fetchLocations();
            setIsLoading(false);
        };
        fetchData();
    }, [searchQuery]);

    if (isLoading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
                <Text>Loading map...</Text>
            </View>
        );
    }

    const initialRegion = {
        latitude: currentLatitude || 9.3116,
        longitude: currentLongitude || 123.3073,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
    };

    const searchLocation = async (query) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
                    query
                )}&key=REDACTED`
            );
            const data = await response.json();

            if (data.length > 0) {
                const { lat, lon } = data[0];
                setSearchLatitude(parseFloat(lat));
                setSearchLongitude(parseFloat(lon));
            } else {
                // alert("No results found");
            }
        } catch (error) {
            console.error("Error fetching location:", error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Search Bar */}
            <TextInput
                style={styles.searchBar}
                placeholder="Search location"
                value={searchQuery}
                onSubmitEditing={(e) => searchLocation(e.nativeEvent.text)}
                onChangeText={setSearchQuery}
            />

            {/* OpenStreetMap Tile Layer */}
            <MapView
                style={styles.map}
                provider={MapView.PROVIDER_GOOGLE}
                initialRegion={initialRegion}>
                {currentLatitude && currentLongitude && (
                    <Marker
                        coordinate={{
                            latitude: currentLatitude,
                            longitude: currentLongitude,
                        }}
                        title="Your Location"
                    />
                )}
                {filteredMarkers.map((location, index) => {
                    const lat = parseFloat(location.reportLatitude);
                    const lon = parseFloat(location.reportLongitude);

                    if (isNaN(lat) || isNaN(lon)) {
                        console.warn(`Invalid coordinates for marker ${index}`);
                        return null;
                    }

                    return (
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: lat,
                                longitude: lon,
                            }}
                            title={location.reportLocation}
                            description={location.reportTitle}>
                            <Callout>
                                <Text>{location.reportLocation}</Text>
                            </Callout>
                        </Marker>
                    );
                })}
            </MapView>
        </View>
    );
};

export default Map;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        flex: 1,
    },
    searchBar: {
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 5,
        margin: 10,
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
});
