import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://be-proud-thunder-3266.fly.dev/');

// Helper for server-side auth check using cookies
export const initAuthFromCookie = (cookie: string | null) => {
    if (cookie) {
        // Load auth store from cookie
        pb.authStore.loadFromCookie(cookie);
    }
    return pb.authStore.isValid;
};