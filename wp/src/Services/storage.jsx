import AsyncStorage from "@react-native-async-storage/async-storage";

const save_session = async (user, token) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
};

const get_session = async () => {
    const { token, user } = await AsyncStorage.getMany(['token', 'user']);

    return {
        token,
        user: user ? JSON.parse(user) : null,
    };
};

const clear_session = async () => {
    await AsyncStorage.removeMany(['token', 'user']);
};

export { save_session, get_session, clear_session };
