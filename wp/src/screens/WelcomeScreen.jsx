import { useEffect } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Binary } from 'react-native-svg';
import { useChat } from '../Context/chatContext';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from './theme';

const getInitial = (item) => {
    const label = item?.title || item?.name || `${item.id}`;
    return label.toString().charAt(0).toUpperCase();
};

const WelcomeScreen = ({ navigation }) => {

    const { conversations, loadConversations } = useChat();
    const { user, logout } = useUserContext();
    const { deleteConversation } = useChat();

    useEffect(() => {
        loadConversations();
    }, []);

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>My Chats</Text>
                    {!!user?.name && (
                        <Text style={styles.subtitle}>Hi, {user.name}</Text>
                    )}
                </View>

                <Pressable
                    onPress={logout}
                    style={({ pressed }) => [
                        styles.logoutButton,
                        pressed && styles.logoutButtonPressed,
                    ]}
                    hitSlop={8}
                >
                    <Text style={styles.logoutButtonText}>Dil</Text>
                </Pressable>
            </View>

            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={
                    conversations?.length
                        ? styles.listContent
                        : styles.listContentEmpty
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>Ende pa biseda</Text>
                        <Text style={styles.emptyBody}>
                            Bisedat e tua do të shfaqen këtu kur të fillojnë.
                        </Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Pressable
                            onPress={() =>
                                navigation.navigate('Chat', {
                                    conversationId: item.id,
                                })
                            }
                            style={({ pressed }) => [
                                styles.rowContent,
                                pressed && styles.rowPressed,
                            ]}
                        >
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {getInitial(item)}
                                </Text>
                            </View>

                            <View style={styles.rowBody}>
                                <Text style={styles.rowTitle} numberOfLines={1}>
                                    {item.title || `Bisedë ${item.id}`}
                                </Text>

                                {!!item.lastMessage && (
                                    <Text style={styles.rowSubtitle} numberOfLines={1}>
                                        {item.lastMessage}
                                    </Text>
                                )}
                            </View>
                        </Pressable>

                        <Pressable
                            onPress={() => deleteConversation(item.id)}
                            style={({ pressed }) => [
                                styles.deleteButton,
                                pressed && styles.deleteButtonPressed,
                            ]}
                            hitSlop={8}
                        >
                            <Text style={styles.deleteIcon}>🗑</Text>
                        </Pressable>
                    </View>
                )}
            />

        </SafeAreaView>
    );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        ...typography.title,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: 2,
    },
    logoutButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        borderWidth: 1,
        borderColor: colors.danger,
    },
    logoutButtonPressed: {
        backgroundColor: colors.danger,
    },
    logoutButtonText: {
        color: colors.danger,
        fontWeight: '600',
    },
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
    },
    listContentEmpty: {
        flexGrow: 1,
        paddingHorizontal: spacing.lg,
    },
    separator: {
        height: spacing.sm,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    rowPressed: {
        backgroundColor: colors.primaryTint,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    avatarText: {
        color: colors.textOnPrimary,
        fontWeight: '700',
        fontSize: 18,
    },
    rowBody: {
        flex: 1,
    },
    rowTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    rowSubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    chevron: {
        fontSize: 22,
        color: colors.textSecondary,
        marginLeft: spacing.sm,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.xs,
    },
    emptyTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },
    emptyBody: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    rowContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },

    deleteButton: {
        width: 44,
        height: 44,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        borderRadius: radii.pill,
    },

    deleteButtonPressed: {
        backgroundColor: colors.primaryTint,
    },

    deleteIcon: {
        fontSize: 20,
    },
});