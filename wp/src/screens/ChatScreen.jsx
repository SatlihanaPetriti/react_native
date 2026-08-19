import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
} from 'react-native';

import { useChat } from '../Context/chatContext';
import { useSocket } from '../Context/socketContext';
import { useUserContext } from '../Context/Auth';

const ChatScreen = ({ route }) => {
    const { conversationId } = route.params;

    const [content, setContent] = useState('');

    // User i loguar
    const { user } = useUserContext();

    // HTTP
    const {
        messages,
        setMessages,
        loadMessages,
    } = useChat();

    // Socket
    const {
        socketConnected,
        connectSocket,
        joinRoom,
        sendMessage,
        lastMessage,
    } = useSocket();

    // Merr historikun dhe lidh socket
    useEffect(() => {
        loadMessages(conversationId);

        connectSocket();

        joinRoom(conversationId);
    }, [conversationId]);
    // Kur vjen mesazh live, shtoje ne liste
    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        

        setMessages(currentMessages => [
            ...currentMessages,
            lastMessage,
        ]);
    }, [lastMessage, conversationId]);

    const handleSend = () => {
        if (!content.trim()) {
            return;
        }

        sendMessage(content);
        setContent('');
    };

    return (
        <View style={styles.container}>

            <Text style={styles.status}>
                {socketConnected
                    ? 'Connected'
                    : 'Disconnected'}
            </Text>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => {
                    const isMine =
                        Number(item.senderId) ===
                        Number(user?.id);

                    return (
                        <View
                            style={[
                                styles.messageBubble,
                                isMine
                                    ? styles.myMessage
                                    : styles.otherMessage,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.messageText,
                                    isMine &&
                                    styles.myMessageText,
                                ]}
                            >
                                {item.content}
                            </Text>
                        </View>
                    );
                }}
            />

            <View style={styles.inputContainer}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Message..."
                    style={styles.input}
                />

                <Pressable
                    onPress={handleSend}
                    style={styles.sendButton}
                >
                    <Text style={styles.sendButtonText}>
                        Send
                    </Text>
                </Pressable>
            </View>

        </View>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: '#f5f5f5',
    },

    status: {
        textAlign: 'center',
        marginBottom: 10,
    },

    messagesList: {
        paddingBottom: 10,
    },

    messageBubble: {
        maxWidth: '75%',
        padding: 10,
        marginVertical: 5,
        borderRadius: 12,
    },

    // Mesazhet e user-it te loguar
    myMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#25D366',
    },

    // Mesazhet e user-it tjeter
    otherMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#dddddd',
    },

    messageText: {
        color: '#222222',
        fontSize: 16,
    },

    myMessageText: {
        color: '#ffffff',
    },

    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },

    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#cccccc',
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: '#ffffff',
    },

    sendButton: {
        backgroundColor: '#25D366',
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 20,
    },

    sendButtonText: {
        color: '#ffffff',
        fontWeight: 'bold',
    },
});