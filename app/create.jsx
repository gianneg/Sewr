// components
import {
    StyleSheet,
    Image,
    Text,
    TextInput,
    View,
    Pressable,
    Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import icons from "../constants/icons";
import { useRoute } from "@react-navigation/native";

import * as FileSystem from "expo-file-system";
import { decode } from "base64-arraybuffer";
import * as Location from "expo-location";
import * as ImagePicker from "expo-image-picker";

// SUPABASE CONNECTION
import { supabase } from "../lib/supabase";

const Create = ({ route }) => {
    const userID = route.params?.userID;
    console.log("User ID for create is:", userID);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [uploading, setUploading] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedImage, setSelectedImage] = useState(null);

    console.log("Home -> Create: ", userID);

    const pickImage = async () => {
        try {
            Alert.alert(
                "Select Image",
                "Choose an option to upload an image.",
                [
                    {
                        text: "Camera",
                        onPress: async () => {
                            const permissionResult =
                                await ImagePicker.requestCameraPermissionsAsync();
                            if (!permissionResult.granted) {
                                alert("Camera access is required.");
                                return;
                            }
                            const result = await ImagePicker.launchCameraAsync({
                                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                                allowsEditing: true,
                                quality: 1,
                            });

                            if (!result.canceled) {
                                setSelectedImage(result.assets[0]);
                                console.log(
                                    "Image selected from camera:",
                                    result
                                );
                            }
                        },
                    },
                    {
                        text: "Gallery",
                        onPress: async () => {
                            const permissionResult =
                                await ImagePicker.requestMediaLibraryPermissionsAsync();
                            if (!permissionResult.granted) {
                                alert("Gallery access is required.");
                                return;
                            }
                            const result =
                                await ImagePicker.launchImageLibraryAsync({
                                    mediaTypes:
                                        ImagePicker.MediaTypeOptions.Images,
                                    allowsEditing: true,
                                    quality: 1,
                                });

                            if (!result.canceled) {
                                setSelectedImage(result.assets[0]);
                                console.log(
                                    "Image selected from gallery:",
                                    result
                                );
                            }
                        },
                    },
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                ]
            );
        } catch (error) {
            console.error("Error picking an image:", error);
        }
    };

    const uploadFileToSupabase = async (file) => {
        try {
            setUploading(true);
            const fileUri = file.uri;
            const fileExtension = fileUri.split(".").pop();
            const contentType = fileExtension === "png" ? `image/${fileExtension}` : "image/jpeg";
            const fileName = `image_${Date.now()}.${fileExtension}`;

            const fileData = await FileSystem.readAsStringAsync(fileUri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            const fileBuffer = decode(fileData);

            const { data, error } = await supabase.storage
                .from("images")
                .upload(`images/report/${fileName}`, fileBuffer, {
                    cacheControl: "3600",
                    upsert: false,
                    contentType: "image/jpeg",
                });

            if (error) {
                console.error("Error uploading file:", error);
                setMessage("Upload failed");
                return null;
            }

            console.log("File uploaded successfully:", data);
            setMessage("Upload successful");
            return data.path;
        } catch (error) {
            console.error("Error uploading file:", error);
            setUploading(false);
            return null;
        } finally {
            setUploading(false);
        }
    };

    const handleCreate = async () => {
        if (
            title.trim().length === 0 ||
            location.trim().length === 0 ||
            !latitude ||
            !longitude
        ) {
            Alert.alert("Attention!", "Please input all the fields.");
            return;
        }

        if (!selectedImage) {
            Alert.alert("Attention!", "Please select an image.");
            return;
        }

        console.log("All fields are valid, proceeding...");
        const timeNow = new Date().toLocaleString("en-US", {
            timeZone: "Asia/Shanghai",
        });

        try {
            let imageUrl = null;
            if (selectedImage) {
                imageUrl = await uploadFileToSupabase(selectedImage);
            }

            console.log("Image URL:", imageUrl);

            const latitudeFloat = parseFloat(latitude);
            const longitudeFloat = parseFloat(longitude);

            const { data: insertedData, error: insertError } = await supabase
                .from("REPORT")
                .insert([
                    {
                        reportTitle: title,
                        reportLocation: location,
                        createdAt: timeNow,
                        userID: userID,
                        imageUrl: imageUrl,
                        reportLatitude: latitudeFloat,
                        reportLongitude: longitudeFloat,
                    },
                ]);

            if (insertError) {
                console.error("Insert Error:", insertError);
                throw insertError;
            } else {
                console.log("Inserted Data:", insertedData);
            }

            Alert.alert("Success", "Add successful!");

            setTitle("");
            setLocation("");
            setLatitude("");
            setLongitude("");
            setSelectedImage(null);
            setUploading(false);
            setMessage("");
        } catch (error) {
            console.error("Error during submission:", error);
            Alert.alert("Error", "Something went wrong during submission.");
        }
    };

    const handleLocationCoords = async () => {
        try {
            const { status } =
                await Location.requestForegroundPermissionsAsync();
            if (status !== "granted") {
                alert("Permission to access location was denied. Please enable it in settings.");
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            const currentLongitude = location.coords.longitude;
            const currentLatitude = location.coords.latitude;

            console.log(
                `Longitude: ${currentLongitude}, Latitude: ${currentLatitude}`
            );

            setLatitude(currentLatitude);
            setLongitude(currentLongitude);
        } catch (error) {
            console.error(`Error occurred: ${error.message}`);
            alert(error.message);
        }
    };

    useEffect(() => {
        handleLocationCoords();
    }, []);

    return (
        <View>
            <View style={styles.content}>
                <Text style={styles.create_label}>CREATE NEW REPORT</Text>

                {/* Report Title Input */}
                <Text style={styles.input_label}>Report Title</Text>
                <TextInput
                    style={styles.input}
                    placeholder={"i.e. Flooded Path"}
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={(text) => setTitle(text)}
                />

                {/* Location Input */}
                <Text style={styles.input_label}>Location</Text>
                <TextInput
                    style={styles.input}
                    placeholder={"i.e. Sta. Catalina Street"}
                    placeholderTextColor="#999"
                    value={location}
                    onChangeText={(text) => setLocation(text)}
                />

                {/* Attach Photo Section */}
                <View style={styles.attach_section}>
                    <Pressable onPress={pickImage} style={styles.attach_button}>
                        <Image source={icons.camera} style={styles.camera} />
                        <Text style={styles.attach}>Attach Photo</Text>
                    </Pressable>
                    
                    {uploading && <Text>Uploading image...</Text>}
                   
                    {message && <Text>{message}</Text>}
                </View>
                {selectedImage && (
                    <Image
                        source={{ uri: selectedImage.uri }}
                        style={styles.image}
                    />
                )}

                {/* Submit Button */}
                <Pressable style={styles.submit} onPress={handleCreate}>
                    <Text style={styles.submit_text}>SUBMIT FORM</Text>
                </Pressable>
            </View>
        </View>
    );
};

export default Create;

const styles = StyleSheet.create({
    content: {
        padding: 20,
        height: "100%",
    },
    create_label: {
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 18,
        marginBottom: 15,
        marginTop: -5,
        color: "#000",
        textAlign: "left",
    },
    input_label: {
        fontFamily: "Inter_300Light",
        fontWeight: "600",
        fontSize: 14,
        marginTop: 10,
        color: "#000",
        paddingLeft: 5,
    },
    input: {
        marginTop: 10,
        marginBottom: 5,
        paddingHorizontal: 15,
        width: "100%",
        height: 45,
        fontFamily: "Inter_300Light",
        fontWeight: "300",
        borderWidth: 2,
        borderRadius: 10,
        borderColor: "black",
        color: "#000",
        backgroundColor: "#f9f9f9",
    },
    attach_section: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
    },
    attach_button: {
        flexDirection: "row",
        alignItems: "center",
    },
    camera: {
        width: 35,
        height: 35,
        marginRight: 10,
    },
    attach: {
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 14,
        color: "#075EAE",
        marginRight: 10,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },
    submit: {
        marginTop: 230,
        height: 40,
        width: "100%",
        backgroundColor: "#075EAE",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: "center",
        position: "relative",
        bottom: "30%",
    },
    submit_text: {
        fontFamily: "Inter_600SemiBold",
        fontWeight: "600",
        fontSize: 16,
        color: "#FFF",
    },
});
