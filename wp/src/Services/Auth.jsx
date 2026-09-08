import axios from "axios";

const URL = "http://localhost:3000/auth";

const request_otp = async (phoneNumber) => {
    return axios.post(`${URL}/otp/request`, { phoneNumber });
};

const verify_otp = async (phoneNumber, code) => {
    return axios.post(`${URL}/otp/verify`, { phoneNumber, code });
};

const logout_user = async () => {
    const result = await axios.post(`${URL}/logout`);
    return result;
};

export { request_otp, verify_otp, logout_user };
