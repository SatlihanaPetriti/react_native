import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from '../screens/theme';

const OtpForm = () => {
    const { verifyOtp, requestOtp, error, setError } = useUserContext();
    const route = useRoute();
    const { phoneNumber, devCode } = route.params;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async () => {
        setError(null);

        if (!code.trim()) {
            setError('Shkruaj kodin');
            return;
        }

        try {
            setLoading(true);
            await verifyOtp(phoneNumber, code.trim());
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setError(null);
        try {
            setResending(true);
            await requestOtp(phoneNumber);
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setResending(false);
        }
    };

    return (
        <View style={styles.formBox}>
            <Text style={styles.subtitle}>
                Kodi u dërgua te {phoneNumber}
            </Text>

            {!!devCode && (
                <Text style={styles.devHint}>
                    (dev mode) Kodi: {devCode}
                </Text>
            )}

            <Text style={styles.label}>Kodi</Text>
            <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor={colors.textSecondary}
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
                style={[styles.verifyButton, loading && styles.buttonDisabled]}
                onPress={handleVerify}
                disabled={loading}
            >
                <Text style={styles.verifyButtonText}>
                    {loading ? 'Duke verifikuar...' : 'Verifiko'}
                </Text>
            </Pressable>

            <Pressable
                style={styles.resendButton}
                onPress={handleResend}
                disabled={resending}
            >
                <Text style={styles.resendButtonText}>
                    {resending ? 'Duke ridërguar...' : 'Ridërgo kodin'}
                </Text>
            </Pressable>
        </View>
    );
};

export default OtpForm;

const styles = StyleSheet.create({
    formBox: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.lg,
    },
    subtitle: {
        ...typography.body,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    devHint: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.md,
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
        textAlign: 'center',
        letterSpacing: 4,
    },
    error: {
        color: colors.danger,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    verifyButton: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    verifyButtonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
    resendButton: {
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },
    resendButtonText: {
        ...typography.subtitle,
        color: colors.primaryDark,
    },
});
