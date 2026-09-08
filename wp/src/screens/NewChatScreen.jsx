import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NewChatForm from '../components/NewChatForm';
import { colors, spacing, typography } from './theme';

const NewChatScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.header}>
                <Pressable
                    onPress={() => navigation.goBack()}
                    hitSlop={10}
                >
                    <Text style={styles.back}>‹</Text>
                </Pressable>
                <Text style={styles.headerTitle}>
                    New Chat
                </Text>
            </View>

            <NewChatForm />

        </SafeAreaView>
    );
};

export default NewChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        backgroundColor: colors.primary,
    },

    back: {
        color: colors.textOnPrimary,
        fontSize: 28,
    },

    headerTitle: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
});
