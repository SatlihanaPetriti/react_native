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

const CreateGroupForm = () => {
    const { createGroup } = useChat();
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [participantIds, setParticipantIds] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCreate = async () => {
        setError(null);

        if (!name.trim()) {
            setError('Name the group');
            return;
        }

        const ids = participantIds
            .split(',')
            .map(id => id.trim())
            .filter(Boolean)
            .map(Number)
            .filter(id => !Number.isNaN(id));

        if (ids.length === 0) {
            setError('Add at least one participant (ID number)');
            return;
        }

        try {
            setLoading(true);

            const group = await createGroup({
                name: name.trim(),
                participantIds: ids,
            });

            navigation.replace('Chat', {
                conversationId: group.id,
                title: group.name,
            });
        } catch (err) {
            setError('Group could not be created. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.body}>

            <Text style={styles.label}>
                Group Name
            </Text>

            <TextInput
                style={styles.input}
                placeholder="p.sh. Miqtë"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>
                Participants (ID, comma-separated)
            </Text>

            <TextInput
                style={styles.input}
                placeholder="p.sh. 2,5,7"
                placeholderTextColor={colors.textSecondary}
                value={participantIds}
                onChangeText={setParticipantIds}
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
                onPress={handleCreate}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    {loading ? 'Creating group...' : 'Create Group'}
                </Text>
            </Pressable>

        </View>
    );
};

export default CreateGroupForm;

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