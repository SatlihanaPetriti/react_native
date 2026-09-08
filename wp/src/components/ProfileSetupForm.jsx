import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from '../screens/theme';

const ProfileSetupForm = () => {
    const { updateProfileName, error, setError } = useUserContext();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setError(null);

        if (!name.trim()) {
            setError('Shkruaj emrin tënd');
            return;
        }

        try {
            setLoading(true);
            await updateProfileName(name.trim());
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formBox}>
            <Text style={styles.label}>Si quhesh?</Text>
            <TextInput
                style={styles.input}
                placeholder="Emri yt"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
                style={[styles.saveButton, loading && styles.buttonDisabled]}
                onPress={handleSave}
                disabled={loading}
            >
                <Text style={styles.saveButtonText}>
                    {loading ? 'Duke ruajtur...' : 'Vazhdo'}
                </Text>
            </Pressable>
        </View>
    );
};

export default ProfileSetupForm;

const styles = StyleSheet.create({
    formBox: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.lg,
    },
    label: {
        ...typography.subtitle,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radii.sm,
        paddingHorizontal: spacing.md,
        ...typography.body,
        color: colors.textPrimary,
        marginBottom: spacing.md,
        backgroundColor: colors.background,
    },
    error: {
        color: colors.danger,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    saveButton: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    saveButtonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
});
