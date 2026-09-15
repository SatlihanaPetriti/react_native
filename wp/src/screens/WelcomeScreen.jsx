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
import ConversationRow from '../components/ConversationRow';
import PersonItem from '../components/PersonItem';
import CreateMenu from '../components/CreateMenu';
import { colors, spacing, radii, typography } from './theme';

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
