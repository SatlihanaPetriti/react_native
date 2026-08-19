import axios from "axios";

const URL = "http://localhost:3000/auth";

const register_user = async (data) => {
    return axios.post(`${URL}/register`, data);
};

const login_user = async (data) => {
    console.log("Login payload:", data);
    const response = await axios.post(`${URL}/phone-login`, data);
    console.log("Response from backend:", response);
    console.log("User from backend:", response.data);

    return response;
};

const logout_user = async () => {
    const result = await axios.post(`${URL}/logout`);
    return result;
};

export { register_user, login_user, logout_user };