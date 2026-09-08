import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useChat } from '../Context/chatContext';
import { colors, spacing, radii, typography } from '../screens/theme';

const NewChatForm = () => {
    const { startConversation } = useChat();
    const navigation = useNavigation();

    const [userId, setUserId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleStart = async () => {
        setError(null);

        const id = Number(userId.trim());

        if (!userId.trim() || Number.isNaN(id)) {
            setError('Enter a valid user ID');
            return;
        }

        try {
            setLoading(true);

            const conversation = await startConversation(id);

            navigation.replace('Chat', {
                conversationId: conversation.id,
                title: conversation.name,
            });
        } catch (err) {
            setError('Chat could not be started. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.body}>

            <Text style={styles.label}>
                User ID
            </Text>

            <TextInput
                style={styles.input}
                placeholder="p.sh. 3"
                placeholderTextColor={colors.textSecondary}
                value={userId}
                onChangeText={setUserId}
                keyboardType="numeric"
            />

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            <Pressable
                style={[
                    styles.button,
                    loading && styles.buttonDisabled,
                ]}
                onPress={handleStart}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Starting chat...' : 'Start Chat'}
                </Text>
            </Pressable>

        </View>
    );
};

export default NewChatForm;

const styles = StyleSheet.create({
    body: {
        padding: spacing.lg,
    },

    label: {
        ...typography.subtitle,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
        marginTop: spacing.md,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.sm,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
        backgroundColor: colors.surface,
    },

    error: {
        color: colors.danger,
        marginTop: spacing.md,
        textAlign: 'center',
    },

    button: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    buttonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
});
