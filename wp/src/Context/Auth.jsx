import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { register_user, login_user, logout_user } from "../Services/Auth";
import { save_session, get_session, clear_session } from "../Services/storage";
import { navigate } from "../navigation/navigationRef";

const UserContext = createContext({});

const setAuthHeader = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
    delete axios.defaults.headers.common.Authorization;
};

const UserProvider = (props) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Ne hapje te app-it, kontrollo nese ka session te ruajtur
    useEffect(() => {
        const restoreSession = async () => {
            const { token, user: storedUser } = await get_session();

            if (token && storedUser) {
                setAuthHeader(token);
                setUser(storedUser);
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
                await save_session(result.data.user, result.data.token);
                setAuthHeader(result.data.token);
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
                await save_session(result.data.user, result.data.token);
                setAuthHeader(result.data.token);
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

        await clear_session();
        clearAuthHeader();
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
