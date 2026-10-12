import AsyncStorage from "@react-native-async-storage/async-storage";

import { createClient } from "@supabase/supabase-js";

import "react-native-url-polyfill/auto";

//Hello, if you're seeing this, the data found within this database are simply dummy data, and are not real. Please do not worry as there is no actual user data being exposed. This database is only used for testing and development purposes, and all data within it is fictitious. If you have any concerns or questions, please feel free to reach out to the developers. Thank you for your understanding!
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
