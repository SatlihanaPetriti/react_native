import { createContext, useContext, useState } from "react";
import { register_user, login_user, logout_user } from "../Services/Auth";
import { navigate } from "../navigation/navigationRef";

const UserContext = createContext({});

const UserProvider = (props) => {
    const [user, setUser] = useState(null);
    const [error, setError] = useState(null);

    const register = async (data) => {
        try {
            const result = await register_user(data);

            if (result.status === 201) {
                setUser(result.data);
                navigate('Welcome');
            }
        } catch (error) {
            setError(error.response?.data?.message);
        }
    };

    const login = async (data) => {
        console.log("LOGIN CALLED WITH:", data);
        try {
            const result = await login_user(data);
            console.log("LOGIN RESULT STATUS:", result.status);
            console.log("LOGIN RESULT DATA:", result.data);
            if (result.status === 201) {
                setUser(result.data);
                navigate('Welcome');
            }
        } catch (error) {
            console.log("LOGIN ERROR:", error.message);
            console.log("LOGIN ERROR RESPONSE:", error.response?.data);
            setError(error.response?.data?.message);
        }
    };

    const logout = async () => {
        try {
            await logout_user();
            setUser(null);
            navigate('Login');
        } catch (error) {
            return error;
        }
    };
    const values = { register, login, logout, user, error, setError };
    return (
        <UserContext.Provider value={values}>
            {props.children}
        </UserContext.Provider>
    );
};

const useUserContext = () => useContext(UserContext);

export { useUserContext, UserProvider };