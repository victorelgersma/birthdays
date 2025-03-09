import PocketBase from 'pocketbase';

export const pb = new PocketBase('https://be-proud-thunder-3266.fly.dev/');

export const isUserValid = () => {
    return pb.authStore.isValid;
};

export const login = async (email: string, password: string) => {
    return await pb.collection('users').authWithPassword(email, password);
};

export const logout = () => {
    pb.authStore.clear();
};

export const register = async (email: string, password: string, passwordConfirm: string) => {
    return await pb.collection('users').create({
        email,
        password,
        passwordConfirm,
    });
};