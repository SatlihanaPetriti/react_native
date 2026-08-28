import { createContext, useContext, useState } from 'react';
import {
    start_conversation,
    create_group,
    get_conversations,
    get_messages,
    mark_as_read,
    add_participant,
    remove_participant,
    delete_conversation,
} from '../Services/chat';

const ChatContext = createContext();
const ChatProvider = ({ children }) => {

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    const startConversation = async userId => {
        const response = await start_conversation(userId);
        return response.data;
    };

    // Krijon nje grup te ri dhe e shton ne fillim te listes se conversations
    const createGroup = async (dto) => {
        try {
            const response = await create_group(dto);

            setConversations(prevConversations => [
                response.data,
                ...prevConversations,
            ]);

            return response.data;
        } catch (error) {
            console.log('CREATE GROUP ERROR:', error);
            throw error;
        }
    };

    const loadConversations = async () => {
        const response = await get_conversations();
        setConversations(response.data);
        return response.data;
    };

    const loadMessages = async conversationId => {
        const response = await get_messages(conversationId);
        setMessages(response.data);
        return response.data;
    };

    // Shenon biseden si te lexuar per userin aktual
    const markAsRead = async (conversationId) => {
        try {
            const response = await mark_as_read(conversationId);
            return response.data;
        } catch (error) {
            console.log('MARK AS READ ERROR:', error);
            throw error;
        }
    };

    // Shton nje pjesemarres te ri ne grup
    const addParticipant = async (conversationId, userId) => {
        try {
            const response = await add_participant(conversationId, userId);
            return response.data;
        } catch (error) {
            console.log('ADD PARTICIPANT ERROR:', error);
            throw error;
        }
    };

    // Heq nje pjesemarres nga grupi (ose del vete nga grupi)
    const removeParticipant = async (conversationId, userId) => {
        try {
            const response = await remove_participant(conversationId, userId);
            return response.data;
        } catch (error) {
            console.log('REMOVE PARTICIPANT ERROR:', error);
            throw error;
        }
    };

    const deleteConversation = async (conversationId) => {
        try {
            const response = await delete_conversation(conversationId);

            setConversations(prevConversations =>
                prevConversations.filter(
                    conversation =>
                        Number(conversation.id) !== Number(conversationId)
                )
            );

            return response.data;
        } catch (error) {
            console.log('DELETE CONVERSATION ERROR:', error);
            throw error;
        }
    };

    return (
        <ChatContext.Provider
            value={{
                conversations,
                messages,
                setMessages,
                startConversation,
                createGroup,
                loadConversations,
                loadMessages,
                markAsRead,
                addParticipant,
                removeParticipant,
                deleteConversation,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };