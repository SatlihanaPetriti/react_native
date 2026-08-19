import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChat } from '../Context/chatContext';
import { useSocket } from '../Context/socketContext';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from './theme';

// Payloads coming from the socket / REST API don't always agree on the
// field name for "who sent this" (senderId, userId, sender.id, ...), and
// ids sometimes arrive as a string from one source and a number from
// another (e.g. "3" vs 3). A strict `===` breaks in both cases, so we
// normalize everything to a string and check a few likely field names.
const isMessageMine = (message, user) => {
    if (!message || !user) {
        return false;
    }

    const senderId =
        message.senderId ??
        message.userId ??
        message.sender?.id ??
        message.user?.id ??
        message.authorId;

    if (senderId === undefined || senderId === null || user.id === undefined || user.id === null) {
        return false;
    }

    return String(senderId) === String(user.id);
};

const ChatScreen = ({ route, navigation }) => {
    const { conversationId } = route.params;

    const [content, setContent] = useState('');

    const {
        messages,
        setMessages,
        loadMessages,
    } = useChat();

    const {
        socketConnected,
        connectSocket,
        joinRoom,
        sendMessage,
        lastMessage,
    } = useSocket();

    const { user } = useUserContext();

    useEffect(() => {
        loadMessages(conversationId);
        connectSocket();
    }, [conversationId]);

    useEffect(() => {
        if (socketConnected) {
            joinRoom(conversationId);
        }
    }, [socketConnected, conversationId]);

    useEffect(() => {
        if (!lastMessage) {
            return;
        }

        setMessages(currentMessages => {
            // Guard against the same message being appended twice
            // (e.g. the server echoing 'messageReceived' back to the
            // sender, or a listener firing more than once).
            const alreadyExists = currentMessages.some(
                message => message.id === lastMessage.id
            );

            if (alreadyExists) {
                return currentMessages;
            }

            return [...currentMessages, lastMessage];
        });
    }, [lastMessage]);

    const handleSend = () => {
        if (!content.trim()) {
            return;
        }

        sendMessage(content);
        setContent('');
    };

    return (
        <SafeAreaView style={styles.safeArea}>

            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                    hitSlop={8}
                >
                    <Text style={styles.backButtonText}>‹</Text>
                </Pressable>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        Bisedë {conversationId}
                    </Text>
                    <Text style={styles.headerStatus}>
                        {socketConnected ? 'Online' : 'Duke u lidhur…'}
                    </Text>
                </View>

                <View style={styles.backButton} />
            </View>

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={messages}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    ItemSeparatorComponent={() => <View style={styles.messageSpacer} />}
                    renderItem={({ item }) => {
                        const isMine = isMessageMine(item, user);

                        return (
                            <View
                                style={[
                                    styles.bubbleRow,
                                    isMine ? styles.bubbleRowMine : styles.bubbleRowTheirs,
                                ]}
                            >
                                <View
                                    style={[
                                        styles.bubble,
                                        isMine ? styles.bubbleMine : styles.bubbleTheirs,
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styles.bubbleText,
                                            isMine ? styles.bubbleTextMine : styles.bubbleTextTheirs,
                                        ]}
                                    >
                                        {item.content}
                                    </Text>
                                </View>
                            </View>
                        );
                    }}
                />

                <View style={styles.inputBar}>
                    <TextInput
                        value={content}
                        onChangeText={setContent}
                        placeholder="Shkruaj një mesazh…"
                        placeholderTextColor={colors.textSecondary}
                        style={styles.input}
                        multiline
                    />

                    <Pressable
                        onPress={handleSend}
                        disabled={!content.trim()}
                        style={({ pressed }) => [
                            styles.sendButton,
                            !content.trim() && styles.sendButtonDisabled,
                            pressed && !!content.trim() && styles.sendButtonPressed,
                        ]}
                    >
                        <Text style={styles.sendButtonText}>Dërgo</Text>
                    </Pressable>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    flex: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    backButton: {
        width: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
    },
    backButtonText: {
        fontSize: 28,
        color: colors.primary,
        lineHeight: 30,
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    headerStatus: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    listContent: {
        padding: spacing.md,
        flexGrow: 1,
    },
    messageSpacer: {
        height: spacing.xs,
    },
    bubbleRow: {
        flexDirection: 'row',
    },
    bubbleRowMine: {
        justifyContent: 'flex-end',
    },
    bubbleRowTheirs: {
        justifyContent: 'flex-start',
    },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.lg,
    },
    bubbleMine: {
        backgroundColor: colors.bubbleMine,
        borderBottomRightRadius: radii.sm,
    },
    bubbleTheirs: {
        backgroundColor: colors.bubbleTheirs,
        borderBottomLeftRadius: radii.sm,
    },
    bubbleText: {
        ...typography.body,
    },
    bubbleTextMine: {
        color: colors.bubbleMineText,
    },
    bubbleTextTheirs: {
        color: colors.bubbleTheirsText,
    },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
        gap: spacing.sm,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.background,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        color: colors.textPrimary,
        ...typography.body,
    },
    sendButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm + 2,
        borderRadius: radii.lg,
        backgroundColor: colors.primary,
    },
    sendButtonPressed: {
        backgroundColor: colors.primaryDark,
    },
    sendButtonDisabled: {
        backgroundColor: colors.border,
    },
    sendButtonText: {
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
});