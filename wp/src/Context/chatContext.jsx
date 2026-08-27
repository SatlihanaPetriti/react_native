import { createContext, useContext, useState } from 'react';
import { start_conversation, get_conversations, get_messages, delete_conversation } from '../Services/chat';

const ChatContext = createContext();
const ChatProvider = ({ children }) => {

    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);

    const startConversation = async userId => {
        const response = await start_conversation(userId);
        return response.data;
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
            value={{ conversations, messages, setMessages, startConversation, loadConversations, loadMessages, deleteConversation }}
        >
            {children}
        </ChatContext.Provider>
    );
};

const useChat = () => useContext(ChatContext);

export { ChatProvider, useChat };