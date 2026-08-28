import axios from "axios";

const URL = "http://localhost:3000/chat";

const start_conversation = async (userId) => {
    return axios.post(`${URL}/start/${userId}`);
};

const create_group = async (data) => {
    return axios.post(`${URL}/group`, data);
};

const get_conversations = async () => {
    return axios.get(`${URL}/conversations`);
};

const get_messages = async (conversationId) => {
    return axios.get(`${URL}/conversations/${conversationId}/messages`);
};

const mark_as_read = async (conversationId) => {
    return axios.post(`${URL}/conversations/${conversationId}/read`);
};

const add_participant = async (conversationId, userId) => {
    return axios.post(`${URL}/conversations/${conversationId}/participants`, { userId });
};

const remove_participant = async (conversationId, userId) => {
    return axios.delete(`${URL}/conversations/${conversationId}/participants/${userId}`);
};

const delete_conversation = async (conversationId) => {
    return axios.delete(`${URL}/conversations/${conversationId}`);
};

export {
    start_conversation,
    create_group,
    get_conversations,
    get_messages,
    mark_as_read,
    add_participant,
    remove_participant,
    delete_conversation,
};