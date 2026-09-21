import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { request_otp, verify_otp, logout_user } from "../Services/Auth";
import { update_profile } from "../Services/user";
import { save_session, save_user, get_session, clear_session } from "../Services/storage";
import { resetTo } from "../navigation/navigationRef";

const UserContext = createContext({});

const setAuthHeader = (token) => {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
};

const clearAuthHeader = () => {
    delete axios.defaults.headers.common.Authorization;
};

// Profili eshte i plote kur useri ka mbiemer dhe email (emri vendoset gjithmone gjate krijimit)
const isProfileComplete = (user) => !!user?.lastname && !!user?.email;

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
            const { user: verifiedUser, token } = result.data;

            await save_session(verifiedUser, token);
            setAuthHeader(token);
            setUser(verifiedUser);

            resetTo(isProfileComplete(verifiedUser) ? 'Welcome' : 'ProfileSetup');
        } catch (error) {
            setError(error.response?.data?.message);
            throw error;
        }
    };

    // Plotëson profilin (emri, mbiemri, email) pas regjistrimit me OTP
    const updateProfile = async (data) => {
        try {
            const result = await update_profile(user.id, data);

            await save_user(result.data);
            setUser(result.data);

            resetTo('Welcome');
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
        resetTo('Phone');
    };

    const values = {
        user,
        error,
        setError,
        loading,
        profileComplete: isProfileComplete(user),
        requestOtp,
        verifyOtp,
        updateProfile,
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
