import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { register_user, login_user, logout_user } from "../Services/Auth";
import { navigate } from "../navigation/navigationRef";

const UserContext = createContext({});

// Ruan token+user ne AsyncStorage dhe e vendos token-in si header per axios
const persistSession = async (user, token) => {
    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('user', JSON.stringify(user));
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearSession = async () => {
    await AsyncStorage.multiRemove(['token', 'user']);
    delete axios.defaults.headers.common.Authorization;
};

const UserProvider = (props) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ne hapje te app-it, kontrollo nese ka session te ruajtur
    useEffect(() => {
        const restoreSession = async () => {
            const [token, storedUser] = await AsyncStorage.multiGet(['token', 'user']).then(
                pairs => pairs.map(([, value]) => value)
            );

            if (token && storedUser) {
                axios.defaults.headers.common.Authorization = `Bearer ${token}`;
                setUser(JSON.parse(storedUser));
                navigate('Welcome');
            }

            setLoading(false);
        };

        restoreSession();
    }, []);

    const register = async (data) => {
        try {
            const result = await register_user(data);

            if (result.status === 201) {
                await persistSession(result.data.user, result.data.token);
                setUser(result.data.user);
                navigate('Welcome');
            }
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const login = async (data) => {
        try {
            const result = await login_user(data);

            if (result.status === 201) {
                await persistSession(result.data.user, result.data.token);
                setUser(result.data.user);
                navigate('Welcome');
            }
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const logout = async () => {
        try {
            await logout_user();
        } catch (error) {
            // vazhdo edhe nese kerkesa deshton, sesioni lokal duhet fshire gjithsesi
        }

        await clearSession();
        setUser(null);
        navigate('Login');
    };

    const values = { register, login, logout, user, error, setError, loading };
    return (
        <UserContext.Provider value={values}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserProvider };