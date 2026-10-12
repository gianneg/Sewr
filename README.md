# Sewr

A mobile app for reporting floods and drainage problems. Reports are tied to a location and shown on an interactive map, so people can see what's happening near them.

## Features

- Sign up and log in
- Create geotagged reports of flooded or blocked areas
- Interactive map of reports, with search
- Filter reports by time and by distance
- Reports list, plus an admin view for reviewing reports
- Profile and edit-profile screens
- Local weather on the home screen

## Tech

Expo (React Native, Expo Router) · Supabase · Google Maps · OpenWeatherMap

## Project structure

```
app/          # Screens (home, map, reports, create, login, signup, profile)
components/   # Navigation, user context, filter helpers
lib/          # Supabase client
styles/       # Screen styles
```

## Run it locally

```bash
npm install
cp .env.example .env     # then fill in your own keys
npx expo start
```

### Environment variables

| Variable | Description |
| --- | --- |
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon (public) key. Turn on row-level security. |
| `EXPO_PUBLIC_OPENWEATHER_API_KEY` | OpenWeatherMap API key |
| `EXPO_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Maps key used for place search |
| `GOOGLE_MAPS_API_KEY` | Same Maps key, read by `app.config.js` for the Android build |

Restrict the Google key to this app and only the APIs it needs. Never commit your `.env`.

## Notes

Built as a school project. The data in the test database is dummy data.
