import axios from "axios";

const URL = "http://localhost:3000/user";

const get_all_users = async () => {
    return axios.get(`${URL}/all`);
};

const update_profile = async (userId, data) => {
    return axios.patch(`${URL}/${userId}/profile`, data);
};

export { get_all_users, update_profile };
