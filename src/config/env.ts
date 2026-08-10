// API_BASE_URL, CLOUDINARY_CLOUD_NAME, FCM keys

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? "http://10.0.2.2:8080";

export const GOOGLE_WEB_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;

if (!GOOGLE_WEB_CLIENT_ID) {
  throw new Error("Missing EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in environment variables");
}
