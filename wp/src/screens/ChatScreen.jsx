import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    FlatList,
    StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChat } from '../Context/chatContext';
import { useSocket } from '../Context/socketContext';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from './theme';

const formatTime = (date) => {
    const d = date ? new Date(date) : new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const ChatScreen = ({ route, navigation }) => {
    const { conversationId, title } = route.params;

    const [content, setContent] = useState('');
    const { user } = useUserContext();

    const { messages, setMessages, loadMessages } = useChat();
    const {
        socketConnected,
        connectSocket,
        joinRoom,
        sendMessage,
        emitMarkAsRead,
        lastMessage,
        lastReadUpdate,
    } = useSocket();

    useEffect(() => {
        loadMessages(conversationId);
        connectSocket();
        joinRoom(conversationId);
        emitMarkAsRead(conversationId);
    }, [conversationId]);

    // Mesazh i ri live
    useEffect(() => {
        if (!lastMessage) return;

        setMessages(prev => {
            const exists = prev.some(
                message => Number(message.id) === Number(lastMessage.id)
            );

            if (exists) {
                return prev;
            }

            return [...prev, lastMessage];
        });

        if (Number(lastMessage.senderId) !== Number(user?.id)) {
            emitMarkAsRead(conversationId);
        }
    }, [lastMessage, conversationId]);

    // Dikush lexoi biseden - perditeso checkmarks live
    useEffect(() => {
        if (!lastReadUpdate) return;
        if (Number(lastReadUpdate.conversationId) !== Number(conversationId)) return;

        const readerId = lastReadUpdate.userId;
        const readAt = new Date(lastReadUpdate.readAt);

        setMessages(prev =>
            prev.map(message => {
                // Vetem mesazhet e dikujt tjeter, te derguara para readAt
                if (Number(message.senderId) === Number(readerId)) return message;
                if (new Date(message.createdAt) > readAt) return message;

                const currentReadBy = message.readBy || [];
                if (currentReadBy.includes(readerId)) return message;

                return { ...message, readBy: [...currentReadBy, readerId] };
            })
        );
    }, [lastReadUpdate, conversationId]);

    const handleSend = () => {
        if (!content.trim()) return;
        sendMessage(content);
        setContent('');
    };

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

            <View style={styles.header}>
                <Pressable onPress={() => navigation.goBack()} hitSlop={10}>
                    <Text style={styles.back}>‹</Text>
                </Pressable>

                <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                        {(title || 'C').charAt(0).toUpperCase()}
                    </Text>
                </View>

                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title || `Bisedë ${conversationId}`}
                    </Text>
                    <Text style={styles.headerStatus}>
                        {socketConnected ? 'online' : 'duke u lidhur...'}
                    </Text>
                </View>
            </View>

            <FlatList
                data={messages}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => {
                    const isMine = Number(item.senderId) === Number(user?.id);
                    const isRead = isMine && item.readBy && item.readBy.length > 0;

                    return (
                        <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
                            <View
                                style={[
                                    styles.bubble,
                                    isMine ? styles.bubbleMine : styles.bubbleTheirs,
                                ]}
                            >
                                <Text style={isMine ? styles.textMine : styles.textTheirs}>
                                    {item.content}
                                </Text>

                                <View style={styles.metaRow}>
                                    <Text style={[styles.time, isMine && styles.timeMine]}>
                                        {formatTime(item.createdAt)}
                                    </Text>

                                    {isMine && (
                                        <Text style={[
                                            styles.check,
                                            isRead && styles.checkRead,
                                        ]}>
                                            {isRead ? '✓✓' : '✓'}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                    );
                }}
            />

            <View style={styles.inputBar}>
                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Shkruaj një mesazh..."
                    placeholderTextColor={colors.textSecondary}
                    style={styles.input}
                    multiline
                />
                <Pressable onPress={handleSend} style={styles.sendButton}>
                    <Text style={styles.sendIcon}>➤</Text>
                </Pressable>
            </View>

        </SafeAreaView>
    );
};

export default ChatScreen;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primary,
    },
    back: { color: colors.textOnPrimary, fontSize: 28, marginRight: 4 },
    avatar: {
        width: 38, height: 38, borderRadius: radii.pill,
        backgroundColor: colors.primaryDark,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: colors.textOnPrimary, fontWeight: '700' },
    headerTitle: { ...typography.subtitle, color: colors.textOnPrimary },
    headerStatus: { ...typography.caption, color: colors.primaryTint },
    messagesList: { padding: spacing.md, gap: spacing.xs },
    row: { flexDirection: 'row' },
    rowMine: { justifyContent: 'flex-end' },
    rowTheirs: { justifyContent: 'flex-start' },
    bubble: {
        maxWidth: '78%',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        marginVertical: 3,
        borderRadius: radii.lg,
    },
    bubbleMine: {
        backgroundColor: colors.bubbleMine,
        borderBottomRightRadius: 4,
    },
    bubbleTheirs: {
        backgroundColor: colors.bubbleTheirs,
        borderBottomLeftRadius: 4,
    },
    textMine: { ...typography.body, color: colors.bubbleMineText },
    textTheirs: { ...typography.body, color: colors.bubbleTheirsText },
    metaRow: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
    },
    time: { ...typography.caption, color: colors.textSecondary },
    timeMine: { color: '#E7F3E7' },
    check: { fontSize: 12, color: '#E7F3E7' },
    checkRead: { color: '#4FC3F7' },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderRadius: radii.lg,
        backgroundColor: colors.primaryTint,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        ...typography.body,
        color: colors.textPrimary,
    },
    sendButton: {
        width: 44, height: 44, borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    sendIcon: { color: colors.textOnPrimary, fontSize: 18 },
});