import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { request_otp, verify_otp, logout_user } from "../Services/Auth";
import { update_name } from "../Services/user";
import { save_session, save_user, get_session, clear_session } from "../Services/storage";
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

    // Kerkon nje kod OTP per numrin e dhene. Ne dev mode, backend e kthen kodin direkt.
    const requestOtp = async (phoneNumber) => {
        try {
            const result = await request_otp(phoneNumber);
            return result.data;
        } catch (error) {
            setError(error.response?.data?.message);
            throw error;
        }
    };

    // Verifikon kodin OTP dhe hyn ne llogari (ose e krijon nese eshte numer i ri)
    const verifyOtp = async (phoneNumber, code) => {
        try {
            const result = await verify_otp(phoneNumber, code);
            const { user: verifiedUser, token, isNewUser } = result.data;

            await save_session(verifiedUser, token);
            setAuthHeader(token);
            setUser(verifiedUser);

            navigate(isNewUser ? 'ProfileSetup' : 'Welcome');
        } catch (error) {
            setError(error.response?.data?.message);
            throw error;
        }
    };

    // Vendos emrin e vertete pas regjistrimit me OTP
    const updateProfileName = async (name) => {
        try {
            const result = await update_name(user.id, name);

            await save_user(result.data);
            setUser(result.data);

            navigate('Welcome');
        } catch (error) {
            setError(error.response?.data?.message);
            throw error;
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
        navigate('Phone');
    };

    const values = {
        user,
        error,
        setError,
        loading,
        requestOtp,
        verifyOtp,
        updateProfileName,
        logout,
    };
    return (
        <UserContext.Provider value={values}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserProvider };
