import { createContext, useContext, useState } from 'react';

import { connect_socket, disconnect_socket, get_socket } from '../Services/socket';

const SocketContext = createContext();

const SocketProvider = ({ children }) => {
    //  A eshte socekt i lidhur me backend
    const [socketConnected, setSocketConnected] = useState(false);
    // Ne cilen conversation ndodhet useri aktualisht
    const [currentConversationId, setCurrentConversationId] = useState(null);
    // Mesazhi i fundit i marre nga socket
    const [lastMessage, setLastMessage] = useState(null);

    // Lidh socket me backend
    const connectSocket = () => {
        const socket = connect_socket();
        // Hiq event listeners e vjetra per te shmangur dyfishimin e tyre
        socket.off('connect');
        socket.off('disconnect');
        socket.off('messageReceived');
        socket.off('roomJoined');
        socket.off('roomError');
        socket.off('messageError');
        // kemi nje listener per krijimin e connection dhe disconnection te socket
        // Kjo do te thote qe kur socket lidhet me backend, do te thirret ky callback
        // dhe do te vendoset socketConnected ne true
        socket.on('connect', () => {
            console.log('Socket connected:', socket.id);
            setSocketConnected(true);
        });
        //
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

        return socket;
    };

    // Fut userin ne room
    const joinRoom = (conversationId) => {
        const socket = get_socket();
        const id = Number(conversationId);

        if (!id) {
            console.log('Invalid conversation ID');
            return;
        }

        setCurrentConversationId(id);

        // Nëse socket është lidhur
        if (socket?.connected) {
            socket.emit('joinRoom', id);
            return;
        }

        // Nëse është ende duke u lidhur
        // once- te degjoje eventin vetemm nje here
        socket?.once('connect', () => {
            socket.emit('joinRoom', id);
        });
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
