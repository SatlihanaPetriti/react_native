import { View, Text, StyleSheet } from 'react-native';
import { colors, spacing, radii } from '../screens/theme';

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

export default Avatar;

const styles = StyleSheet.create({
    avatar: {
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
});
