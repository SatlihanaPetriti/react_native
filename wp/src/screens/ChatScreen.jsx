import { useEffect, useMemo, useState } from 'react';
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

const formatDateLabel = (date) => {
    const d = new Date(date || Date.now());
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isSameDay = (a, b) => a.toDateString() === b.toDateString();

    if (isSameDay(d, today)) return 'Today';
    if (isSameDay(d, yesterday)) return 'Yesterday';
    return d.toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });
};

// Fut nje divider date mes mesazheve te diteve te ndryshme, per FlatList
const buildListWithDividers = (messages) => {
    const result = [];
    let lastDateKey = null;

    messages.forEach((message) => {
        const dateKey = new Date(message.createdAt || Date.now()).toDateString();

        if (dateKey !== lastDateKey) {
            result.push({
                type: 'divider',
                id: `divider-${dateKey}`,
                label: formatDateLabel(message.createdAt),
            });
            lastDateKey = dateKey;
        }

        result.push({ type: 'message', ...message });
    });

    return result;
};

const DateDivider = ({ label }) => (
    <View style={styles.dividerRow}>
        <View style={styles.dividerPill}>
            <Text style={styles.dividerText}>{label}</Text>
        </View>
    </View>
);

const MessageBubble = ({ message, isMine }) => {
    const isRead = isMine && message.readBy && message.readBy.length > 0;

    return (
        <View style={[styles.row, isMine ? styles.rowMine : styles.rowTheirs]}>
            <View style={[styles.bubble, isMine ? styles.bubbleMine : styles.bubbleTheirs]}>
                <Text style={isMine ? styles.textMine : styles.textTheirs}>
                    {message.content}
                </Text>
            </View>

            <View style={[styles.metaRow, isMine ? styles.metaRowMine : styles.metaRowTheirs]}>
                <Text style={styles.time}>
                    {formatTime(message.createdAt)}
                </Text>

                {isMine && (
                    <Text style={[styles.check, isRead && styles.checkRead]}>
                        {isRead ? '✓✓' : '✓'}
                    </Text>
                )}
            </View>
        </View>
    );
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

    const listData = useMemo(() => buildListWithDividers(messages), [messages]);

    const handleSend = () => {
        if (!content.trim()) return;
        sendMessage(conversationId, content);
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

                <View style={styles.headerInfo}>
                    <Text style={styles.headerTitle} numberOfLines={1}>
                        {title || `Bisedë ${conversationId}`}
                    </Text>
                    <Text style={styles.headerStatus}>
                        {socketConnected ? 'Online' : 'duke u lidhur...'}
                    </Text>
                </View>

                <Text style={styles.headerIcon}>📞</Text>
                <Text style={styles.headerIcon}>⋮</Text>
            </View>

            <FlatList
                data={listData}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.messagesList}
                renderItem={({ item }) => {
                    if (item.type === 'divider') {
                        return <DateDivider label={item.label} />;
                    }

                    const isMine = Number(item.senderId) === Number(user?.id);
                    return <MessageBubble message={item} isMine={isMine} />;
                }}
            />

            <View style={styles.inputBar}>
                <Text style={styles.emojiIcon}>🙂</Text>

                <TextInput
                    value={content}
                    onChangeText={setContent}
                    placeholder="Message..."
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
        backgroundColor: colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    back: { color: colors.textPrimary, fontSize: 28, marginRight: 4 },
    avatar: {
        width: 40, height: 40, borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
    },
    avatarText: { color: colors.textOnPrimary, fontWeight: '700' },
    headerInfo: { flex: 1 },
    headerTitle: { ...typography.subtitle, color: colors.textPrimary },
    headerStatus: { ...typography.caption, color: colors.online, marginTop: 1 },
    headerIcon: {
        fontSize: 18,
        color: colors.textPrimary,
        marginLeft: spacing.sm,
    },
    messagesList: { padding: spacing.md, gap: 2 },

    dividerRow: {
        alignItems: 'center',
        marginVertical: spacing.sm,
    },
    dividerPill: {
        paddingHorizontal: spacing.md,
        paddingVertical: 4,
        borderRadius: radii.pill,
        backgroundColor: colors.surface,
    },
    dividerText: {
        ...typography.caption,
        color: colors.textSecondary,
    },

    row: { marginVertical: 3, maxWidth: '80%' },
    rowMine: { alignSelf: 'flex-end', alignItems: 'flex-end' },
    rowTheirs: { alignSelf: 'flex-start', alignItems: 'flex-start' },
    bubble: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
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
        alignItems: 'center',
        gap: 4,
        marginTop: 2,
        paddingHorizontal: 2,
    },
    metaRowMine: { alignSelf: 'flex-end' },
    metaRowTheirs: { alignSelf: 'flex-start' },
    time: { ...typography.caption, color: colors.textSecondary },
    check: { fontSize: 12, color: colors.textSecondary },
    checkRead: { color: colors.primary },
    inputBar: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        padding: spacing.sm,
        backgroundColor: colors.surface,
        borderTopWidth: 1,
        borderTopColor: colors.border,
    },
    emojiIcon: {
        fontSize: 20,
        marginLeft: spacing.xs,
    },
    input: {
        flex: 1,
        maxHeight: 100,
        borderRadius: radii.pill,
        backgroundColor: colors.background,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        ...typography.body,
        color: colors.textPrimary,
    },
    sendButton: {
        width: 44, height: 44, borderRadius: radii.pill,
        backgroundColor: colors.accentDark,
        alignItems: 'center', justifyContent: 'center',
    },
    sendIcon: { color: colors.textOnPrimary, fontSize: 18 },
});
