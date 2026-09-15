import { View, Text, Pressable, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { colors, spacing, radii, typography } from '../screens/theme';

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

export default ConversationRow;

const styles = StyleSheet.create({
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
});
