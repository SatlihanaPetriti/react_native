import { createContext, useContext, useState } from 'react';

import { connect_socket, disconnect_socket, get_socket } from '../Services/socket';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [currentConversationId, setCurrentConversationId] = useState(null);
    const [lastMessage, setLastMessage] = useState(null);
    // Njoftimi i fundit qe dikush ka lexuar biseden
    const [lastReadUpdate, setLastReadUpdate] = useState(null);

    const connectSocket = () => {
        const socket = connect_socket();

        socket.off('connect');
        socket.off('disconnect');
        socket.off('messageReceived');
        socket.off('roomJoined');
        socket.off('roomError');
        socket.off('messageError');
        socket.off('messagesRead');

        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setSocketConnected(true);
        });

        socket.on('disconnect', () => {
            console.log('Socket disconnected');
            setSocketConnected(false);
        });

        socket.on('roomJoined', data => {
            console.log('ROOM JOINED SUCCESS:', data);
        });

        socket.on('messageReceived', message => {
            console.log('MESSAGE RECEIVED LIVE:', message);
            setLastMessage(message);
        });

        socket.on('roomError', error => {
            console.log('Room error:', error);
        });

        socket.on('messageError', error => {
            console.log('Message error:', error);
        });

        // Dikush lexoi biseden - perdoret per checkmarks blu live
        socket.on('messagesRead', data => {
            console.log('MESSAGES READ:', data);
            setLastReadUpdate(data);
        });

        return socket;
    };

    const joinRoom = (conversationId) => {
        const socket = get_socket();
        const id = Number(conversationId);

        if (!id) {
            console.log('Invalid conversation ID');
            return;
        }

        setCurrentConversationId(id);

        if (socket?.connected) {
            socket.emit('joinRoom', id);
            return;
        }

        socket?.once('connect', () => {
            socket.emit('joinRoom', id);
        });
    };

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

    // Njofton backend qe useri e lexoi biseden (per checkmarks live)
    // Njofton backend qe useri e lexoi biseden (per checkmarks live)
    const emitMarkAsRead = (conversationId) => {
        const socket = get_socket();
        const id = Number(conversationId);

        if (!id) {
            console.log('Invalid conversation ID');
            return;
        }

        // Nese socket eshte i lidhur, dergo menjehere
        if (socket?.connected) {
            socket.emit('markAsRead', { conversationId: id });
            return;
        }

        // Nese eshte ende duke u lidhur, prit derisa te lidhet
        socket?.once('connect', () => {
            socket.emit('markAsRead', { conversationId: id });
        });
    };

    const disconnectSocket = () => {
        disconnect_socket();
        setSocketConnected(false);
        setCurrentConversationId(null);
        setLastMessage(null);
        setLastReadUpdate(null);
    };

    return (
        <SocketContext.Provider
            value={{
                socketConnected,
                currentConversationId,
                lastMessage,
                lastReadUpdate,
                connectSocket,
                joinRoom,
                sendMessage,
                emitMarkAsRead,
                disconnectSocket,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

const useSocket = () => { return useContext(SocketContext) };

export { SocketProvider, useSocket };