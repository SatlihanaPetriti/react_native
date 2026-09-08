import axios from "axios";

const URL = "http://localhost:3000/user";

const update_name = async (userId, name) => {
    return axios.patch(`${URL}/${userId}/name`, { name });
};

export { update_name };
