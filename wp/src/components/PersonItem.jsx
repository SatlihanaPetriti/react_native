import { Text, Pressable, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import { colors, spacing, typography } from '../screens/theme';

const PersonItem = ({ person, onPress }) => (
    <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.personItem, pressed && styles.pressed]}
    >
        <Avatar item={person} size={56} style={styles.personAvatar} />
        <Text style={styles.personName} numberOfLines={1}>{person.name}</Text>
    </Pressable>
);

export default PersonItem;

const styles = StyleSheet.create({
    personItem: {
        alignItems: 'center',
        width: 64,
    },
    pressed: {
        opacity: 0.7,
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
});
