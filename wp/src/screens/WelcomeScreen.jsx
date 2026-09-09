import { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    FlatList,
    Pressable,
    Animated,
    Alert,
    StyleSheet,
    StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import { useChat } from '../Context/chatContext';
import { useUserContext } from '../Context/Auth';
import { get_all_users } from '../Services/user';
import AnimatedButton from '../components/AnimatedButton';
import { colors, spacing, radii, typography } from './theme';

const AVATAR_COLORS = [
    '#6B8F71', '#C97C5D', '#5B8DEF', '#9B7BC9', '#D08A9B', '#4CA8A8',
];

const getInitial = (item) => {
    const label = item?.title || item?.name || `${item.id}`;
    return label.toString().charAt(0).toUpperCase();
};

const getAvatarColor = (item) => {
    const key = item?.name || `${item.id}`;
    const index = key.charCodeAt(0) % AVATAR_COLORS.length;
    return AVATAR_COLORS[index];
};

const Avatar = ({ item, size = 52, style }) => (
    <View
        style={[
            styles.avatar,
            { width: size, height: size, backgroundColor: getAvatarColor(item) },
            style,
        ]}
    >
        <Text style={styles.avatarText}>{getInitial(item)}</Text>
    </View>
);

const ConversationRow = ({ item, onPress, onLongPress }) => (
    <Pressable
        onPress={onPress}
        onLongPress={onLongPress}
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
        <Avatar item={item} />

        <View style={styles.rowBody}>
            <Text style={styles.rowTitle} numberOfLines={1}>
                {item.name || `Bisedë ${item.id}`}
            </Text>

            <Text style={styles.rowSubtitle} numberOfLines={1}>
                {item.lastMessage || (item.isGroup ? 'Grup' : 'Tap për të biseduar')}
            </Text>
        </View>
    </Pressable>
);

const PersonItem = ({ person, onPress }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.personItem, pressed && styles.rowPressed]}
    >
        <Avatar item={person} size={56} style={styles.personAvatar} />
        <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
    </Pressable>
);

const CreateMenu = ({ animValue, onNewChat, onNewGroup }) => (
    <Animated.View
        style={[
            styles.createMenu,
            {
                opacity: animValue,
                transform: [
                    { scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [0.9, 1] }) },
                ],
            },
        ]}
    >
        <Pressable
            onPress={onNewChat}
            style={({ pressed }) => [styles.createMenuItem, pressed && styles.createMenuItemPressed]}
        >
            <View style={styles.createMenuIconContainer}>
                <Text style={styles.createMenuIcon}>+</Text>
            </View>

            <View style={styles.createMenuText}>
                <Text style={styles.createMenuTitle}>Bisedë e re</Text>
                <Text style={styles.createMenuSubtitle}>Fillo një bisedë me një person</Text>
            </View>
        </Pressable>

        <Pressable
            onPress={onNewGroup}
            style={({ pressed }) => [styles.createMenuItem, pressed && styles.createMenuItemPressed]}
        >
            <View style={styles.createMenuIconContainer}>
                <Text style={styles.createMenuIcon}>👥</Text>
            </View>

            <View style={styles.createMenuText}>
                <Text style={styles.createMenuTitle}>Grup i ri</Text>
                <Text style={styles.createMenuSubtitle}>Krijo një grup me disa persona</Text>
            </View>
        </Pressable>
    </Animated.View>
);

const WelcomeScreen = ({ navigation }) => {
    const { conversations, loadConversations, deleteConversation, startConversation } = useChat();
    const { user, logout } = useUserContext();

    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [search, setSearch] = useState('');
    const [people, setPeople] = useState([]);

    const topFade = useRef(new Animated.Value(0)).current;
    const topSlide = useRef(new Animated.Value(16)).current;
    const menuAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(topFade, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.timing(topSlide, { toValue: 0, duration: 450, useNativeDriver: true }),
        ]).start();
    }, []);

    useEffect(() => {
        if (showCreateMenu) {
            menuAnim.setValue(0);
            Animated.spring(menuAnim, { toValue: 1, friction: 7, useNativeDriver: true }).start();
        }
    }, [showCreateMenu]);

    // Rifreskon listen sa here ekrani rikthehet ne fokus (jo vetem here e pare)
    useFocusEffect(
        useCallback(() => {
            loadConversations();
            get_all_users()
                .then(response => {
                    setPeople(response.data.filter(person => person.id !== user?.id));
                })
                .catch(() => { });
        }, [user?.id])
    );

    const handleStartWithUser = async (person) => {
        const conversation = await startConversation(person.id);
        navigation.navigate('Chat', {
            conversationId: conversation.id,
            title: person.name,
        });
    };

    const filteredConversations = search.trim()
        ? conversations.filter(item =>
            (item.name || '').toLowerCase().includes(search.trim().toLowerCase())
        )
        : conversations;

    const handleNewChat = () => {
        setShowCreateMenu(false);
        navigation.navigate('NewChat');
    };

    const handleNewGroup = () => {
        setShowCreateMenu(false);
        navigation.navigate('CreateGroup');
    };

    // Fshirja behet vetem me mbajtje-shtypur + konfirmim, jo me nje buton te dukshem
    const handleDeletePress = (item) => {
        Alert.alert(
            'Fshi bisedën?',
            `Biseda me "${item.name || 'këtë person'}" do të fshihet.`,
            [
                { text: 'Anulo', style: 'cancel' },
                { text: 'Fshi', style: 'destructive', onPress: () => deleteConversation(item.id) },
            ]
        );
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar
                backgroundColor={colors.background}
                barStyle="dark-content"
            />

            <Animated.View style={{ opacity: topFade, transform: [{ translateY: topSlide }] }}>
                {/* HEADER */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Chats</Text>
                        {!!user?.name && (
                            <Text style={styles.subtitle}>Hi, {user.name}</Text>
                        )}
                    </View>

                    {/* LOGOUT */}
                    <Pressable
                        onPress={logout}
                        style={({ pressed }) => [
                            styles.iconButton,
                            pressed && styles.iconButtonPressed,
                        ]}
                        hitSlop={8}
                    >
                        <Text style={styles.logoutIcon}>⎋</Text>
                    </Pressable>
                </View>

                {/* SEARCH */}
                <View style={styles.searchBar}>
                    <Text style={styles.searchIcon}>⌕</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Kërko bisedë..."
                        placeholderTextColor={colors.textSecondary}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* PEOPLE */}
                {people.length > 0 && (
                    <FlatList
                        data={people}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.id.toString()}
                        contentContainerStyle={styles.peopleList}
                        renderItem={({ item }) => (
                            <PersonItem person={item} onPress={() => handleStartWithUser(item)} />
                        )}
                    />
                )}
            </Animated.View>

            {/* CONVERSATIONS */}
            <FlatList
                data={filteredConversations}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={
                    filteredConversations?.length
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

                        <AnimatedButton style={styles.emptyButton} onPress={handleNewChat}>
                            <Text style={styles.emptyButtonText}>
                                + Bisedë e re
                            </Text>
                        </AnimatedButton>
                    </View>
                }
                renderItem={({ item }) => (
                    <ConversationRow
                        item={item}
                        onPress={() =>
                            navigation.navigate('Chat', {
                                conversationId: item.id,
                                title: item.name,
                            })
                        }
                        onLongPress={() => handleDeletePress(item)}
                    />
                )}
            />

            {/* CREATE MENU */}
            {showCreateMenu && (
                <CreateMenu
                    animValue={menuAnim}
                    onNewChat={handleNewChat}
                    onNewGroup={handleNewGroup}
                />
            )}

            {/* FAB */}
            <AnimatedButton
                style={styles.fab}
                onPress={() => setShowCreateMenu(prev => !prev)}
            >
                <Text style={styles.fabIcon}>{showCreateMenu ? '✕' : '✎'}</Text>
            </AnimatedButton>
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
    },

    title: {
        ...typography.title,
        color: colors.textPrimary,
    },

    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },

    /* ICON BUTTON */
    iconButton: {
        width: 40,
        height: 40,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.surface,
    },

    iconButtonPressed: {
        backgroundColor: colors.primaryTint,
    },

    logoutIcon: {
        color: colors.danger,
        fontSize: 18,
    },

    /* SEARCH */
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: spacing.lg,
        marginTop: spacing.md,
        paddingHorizontal: spacing.md,
        height: 46,
        borderRadius: radii.md,
        backgroundColor: colors.surface,
        shadowColor: colors.accentDark,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 1,
    },

    searchIcon: {
        color: colors.textSecondary,
        fontSize: 18,
        marginRight: spacing.sm,
    },

    searchInput: {
        flex: 1,
        ...typography.body,
        color: colors.textPrimary,
    },

    /* PEOPLE */
    peopleList: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        gap: spacing.md,
    },

    personItem: {
        alignItems: 'center',
        width: 64,
    },

    personAvatar: {
        marginRight: 0,
        borderWidth: 2,
        borderColor: colors.surface,
    },

    personName: {
        ...typography.caption,
        color: colors.textPrimary,
        marginTop: spacing.xs,
        textAlign: 'center',
    },

    /* CREATE MENU */
    createMenu: {
        position: 'absolute',
        right: spacing.lg,
        bottom: 96,
        width: 240,
        backgroundColor: colors.surface,
        borderRadius: radii.md,
        overflow: 'hidden',
        shadowColor: colors.accentDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 20,
        elevation: 8,
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

    /* FAB */
    fab: {
        position: 'absolute',
        right: spacing.lg,
        bottom: spacing.lg,
        width: 58,
        height: 58,
        borderRadius: radii.pill,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 6,
    },

    fabIcon: {
        color: colors.textOnPrimary,
        fontSize: 22,
    },

    /* LIST */
    listContent: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: 100,
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
        padding: spacing.md,
        shadowColor: colors.accentDark,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.04,
        shadowRadius: 6,
        elevation: 1,
    },

    rowPressed: {
        opacity: 0.7,
    },

    /* AVATAR */
    avatar: {
        width: 52,
        height: 52,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },

    avatarText: {
        color: colors.textOnPrimary,
        fontWeight: '700',
        fontSize: 20,
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
        ...typography.body,
        color: colors.textSecondary,
        marginTop: 2,
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

    emptyButtonText: {
        color: colors.textOnPrimary,
        fontWeight: '600',
    },
});
