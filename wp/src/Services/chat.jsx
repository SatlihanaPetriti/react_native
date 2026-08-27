import axios from "axios";

const URL = "http://localhost:3000/chat";

const start_conversation = async (userId) => {
    return axios.post(`${URL}/start/${userId}`);
};

const get_conversations = async () => {
    return axios.get(`${URL}/conversations`);
};

const get_messages = async (conversationId) => {
    return axios.get(`${URL}/conversations/${conversationId}/messages`);
};
const delete_conversation = async (conversationId) => {
    return axios.delete(`${URL}/conversations/${conversationId}`);
}

export { start_conversation, get_conversations, get_messages, delete_conversation };