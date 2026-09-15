import { View, Text, Pressable, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../screens/theme';

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

export default CreateMenu;

const styles = StyleSheet.create({
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
});
