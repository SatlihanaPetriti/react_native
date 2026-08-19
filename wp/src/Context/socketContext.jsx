import { createContext, useContext, useState } from 'react';

import { connect_socket, disconnect_socket, get_socket } from '../Services/socket';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);

    // Lidh socket me backend
    const connectSocket = () => {
        const socket = connect_socket();

        socket.off('connect');
        socket.off('disconnect');
        socket.off('messageReceived');
        socket.off('roomJoined');
        socket.off('roomError');
        socket.off('messageError');

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        socket.on('roomJoined', data => {
            console.log('Room joined:', data);
        });

        socket.on('messageReceived', message => {
            console.log('Message received:', message);
            setLastMessage(message);
        });

        socket.on('roomError', error => {
            console.log('Room error:', error);
        });

        socket.on('messageError', error => {
            console.log('Message error:', error);
        });

        return socket;
    };

    // Fut userin ne room
    const joinRoom = conversationId => {
        const socket = get_socket();
        const id = Number(conversationId);

        if (!socket?.connected) {
            console.log('Socket is not connected');
            return;
        }

        if (!id) {
            console.log('Invalid conversation ID');
            return;
        }

        setCurrentConversationId(id);

        socket.emit('joinRoom', id);
    };

    // Dergo mesazhin
    const sendMessage = content => {
        const socket = get_socket();
        const cleanContent = content.trim();

        if (!socket?.connected) {
            console.log('Socket is not connected');
            return;
        }

        if (!currentConversationId) {
            console.log('No conversation selected');
            return;
        }

        if (!cleanContent) {
            return;
        }

        socket.emit('sendMessage', {
            conversationId: currentConversationId,
            content: cleanContent,
        });
    };

    // Mbyll socket
    const disconnectSocket = () => {
        disconnect_socket();
        setSocketConnected(false);
        setCurrentConversationId(null);
        setLastMessage(null);
    };

    return (
        <SocketContext.Provider
            value={{
                socketConnected,
                currentConversationId,
                lastMessage,
                connectSocket,
                joinRoom,
                sendMessage,
                disconnectSocket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => { return useContext(SocketContext) };

export { SocketProvider, useSocket };
