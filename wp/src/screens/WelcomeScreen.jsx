import { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    Pressable,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useChat } from '../Context/chatContext';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from './theme';

const getInitial = (item) => {
    const label = item?.title || item?.name || `${item.id}`;
    return label.toString().charAt(0).toUpperCase();
};

const WelcomeScreen = ({ navigation }) => {
    const { conversations, loadConversations, deleteConversation } = useChat();
    const { user, logout } = useUserContext();

    const [showCreateMenu, setShowCreateMenu] = useState(false);

    useEffect(() => {
        loadConversations();
    }, []);

    const handleNewChat = () => {
        setShowCreateMenu(false);
        navigation.navigate('NewChat');
    };

    const handleNewGroup = () => {
        setShowCreateMenu(false);
        navigation.navigate('NewGroup');
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={colors.background}
                barStyle="dark-content"
            />

            {/* HEADER */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.title}>My Chats</Text>

                    {!!user?.name && (
                        <Text style={styles.subtitle}>
                            Hi, {user.name}
                        </Text>
                    )}
                </View>

                <View style={styles.headerActions}>
                    {/* CREATE BUTTON */}
                    <Pressable
                        onPress={() => setShowCreateMenu(prev => !prev)}
                        style={({ pressed }) => [
                            styles.addButton,
                            pressed && styles.addButtonPressed,
                        ]}
                        hitSlop={8}
                    >
                        <Text style={styles.addButtonText}>
                            {showCreateMenu ? '×' : '+'}
                        </Text>
                    </Pressable>

                    {/* LOGOUT */}
                    <Pressable
                        onPress={logout}
                        style={({ pressed }) => [
                            styles.logoutButton,
                            pressed && styles.logoutButtonPressed,
                        ]}
                        hitSlop={8}
                    >
                        <Text style={styles.logoutButtonText}>
                            Dil
                        </Text>
                    </Pressable>
                </View>
            </View>

            {/* CREATE MENU */}
            {showCreateMenu && (
                <View style={styles.createMenu}>

                    {/* NEW CHAT */}
                    <Pressable
                        onPress={handleNewChat}
                        style={({ pressed }) => [
                            styles.createMenuItem,
                            pressed && styles.createMenuItemPressed,
                        ]}
                    >
                        <View style={styles.createMenuIconContainer}>
                            <Text style={styles.createMenuIcon}>
                                +
                            </Text>
                        </View>

                        <View style={styles.createMenuText}>
                            <Text style={styles.createMenuTitle}>
                                Bisedë e re
                            </Text>

                            <Text style={styles.createMenuSubtitle}>
                                Fillo një bisedë me një person
                            </Text>
                        </View>
                    </Pressable>

                    {/* NEW GROUP */}
                    <Pressable
                        onPress={handleNewGroup}
                        style={({ pressed }) => [
                            styles.createMenuItem,
                            pressed && styles.createMenuItemPressed,
                        ]}
                    >
                        <View style={styles.createMenuIconContainer}>
                            <Text style={styles.createMenuIcon}>
                                👥
                            </Text>
                        </View>

                        <View style={styles.createMenuText}>
                            <Text style={styles.createMenuTitle}>
                                Grup i ri
                            </Text>

                            <Text style={styles.createMenuSubtitle}>
                                Krijo një grup me disa persona
                            </Text>
                        </View>
                    </Pressable>

                </View>
            )}

            {/* CONVERSATIONS */}
            <FlatList
                data={conversations}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={
                    conversations?.length
                        ? styles.listContent
                        : styles.listContentEmpty
                }
                ItemSeparatorComponent={() => (
                    <View style={styles.separator} />
                )}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>
                            Ende pa biseda
                        </Text>

                        <Text style={styles.emptyBody}>
                            Bisedat e tua do të shfaqen këtu kur të fillojnë.
                        </Text>

                        {/* START NEW CHAT BUTTON */}
                        <Pressable
                            onPress={handleNewChat}
                            style={({ pressed }) => [
                                styles.emptyButton,
                                pressed && styles.emptyButtonPressed,
                            ]}
                        >
                            <Text style={styles.emptyButtonText}>
                                + Bisedë e re
                            </Text>
                        </Pressable>
                    </View>
                }
                renderItem={({ item }) => (
                    <View style={styles.row}>

                        {/* CHAT */}
                        <Pressable
                            onPress={() =>
                                navigation.navigate('Chat', {
                                    conversationId: item.id,
                                    title: item.name,
                                })
                            }
                            style={({ pressed }) => [
                                styles.rowContent,
                                pressed && styles.rowPressed,
                            ]}
                        >
                            {/* AVATAR */}
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {getInitial(item)}
                                </Text>
                            </View>

                            {/* CHAT INFO */}
                            <View style={styles.rowBody}>
                                <Text
                                    style={styles.rowTitle}
                                    numberOfLines={1}
                                >
                                    {item.name || `Bisedë ${item.id}`}
                                </Text>

                                {!!item.lastMessage && (
                                    <Text
                                        style={styles.rowSubtitle}
                                        numberOfLines={1}
                                    >
                                        {item.lastMessage}
                                    </Text>
                                )}
                            </View>
                        </Pressable>

                        {/* DELETE */}
                        <Pressable
                            onPress={() => deleteConversation(item.id)}
                            style={({ pressed }) => [
                                styles.deleteButton,
                                pressed && styles.deleteButtonPressed,
                            ]}
                            hitSlop={8}
                        >
                            <Text style={styles.deleteIcon}>
                                🗑
                            </Text>
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

    /* HEADER */
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

    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },

    /* ADD BUTTON */
    addButton: {
        width: 42,
        height: 42,
        borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },

    addButtonPressed: {
        backgroundColor: colors.primaryDark,
    },

    addButtonText: {
        color: colors.textOnPrimary,
        fontSize: 28,
        lineHeight: 30,
        fontWeight: '400',
    },

    /* LOGOUT */
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

    /* CREATE MENU */
    createMenu: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: 'hidden',
    },

    createMenuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },

    createMenuItemPressed: {
        backgroundColor: colors.primaryTint,
    },

    createMenuIconContainer: {
        width: 42,
        height: 42,
        borderRadius: radii.pill,
        backgroundColor: colors.primaryTint,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },

    createMenuIcon: {
        fontSize: 22,
        color: colors.primary,
    },

    createMenuText: {
        flex: 1,
    },

    createMenuTitle: {
        ...typography.subtitle,
        color: colors.textPrimary,
    },

    createMenuSubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },

    /* LIST */
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

    /* CHAT ROW */
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
    },

    rowContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },

    rowPressed: {
        backgroundColor: colors.primaryTint,
    },

    /* AVATAR */
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

    /* CHAT INFO */
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

    /* DELETE */
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

    /* EMPTY STATE */
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
        marginBottom: spacing.md,
    },

    emptyButton: {
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: radii.pill,
        backgroundColor: colors.primary,
    },

    emptyButtonPressed: {
        backgroundColor: colors.primaryDark,
    },

    emptyButtonText: {
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
});