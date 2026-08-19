import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:3000';

let socket = null;

// Krijon lidhjen me Socket.IO server
const connect_socket = () => {
    if (socket) {
        return socket;
    }
    socket = io(SOCKET_URL, {
        transports: ['websocket'],
        withCredentials: true,
        autoConnect: false,
    });
    // ne backend websocketgateway
    socket.connect();
    return socket;
};

// Kthen socket ekzistues
const get_socket = () => {
    return socket;
};

// Mbyll lidhjen dhe pastron socket
const disconnect_socket = () => {
    if (!socket) {
        return;
    }
    socket.disconnect();
    socket = null;
};

export { connect_socket, get_socket, disconnect_socket };