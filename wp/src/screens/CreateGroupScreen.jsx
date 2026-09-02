import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CreateGroupForm from '../components/CreateGroupForm';
import { colors, spacing, typography } from './theme';

const CreateGroupScreen = ({ navigation }) => {
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
                    Create New Group
                </Text>
            </View>

            <CreateGroupForm />

        </SafeAreaView>
    );
};

export default CreateGroupScreen;

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
