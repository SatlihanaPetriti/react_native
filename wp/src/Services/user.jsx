import axios from "axios";

const URL = "http://localhost:3000/user";

const get_all_users = async () => {
    return axios.get(`${URL}/all`);
};

const update_name = async (userId, name) => {
    return axios.patch(`${URL}/${userId}/name`, { name });
};

export { get_all_users, update_name };
