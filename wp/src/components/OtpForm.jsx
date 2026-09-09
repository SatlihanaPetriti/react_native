import { useEffect, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useUserContext } from '../Context/Auth';
import AnimatedButton from './AnimatedButton';
import OtpInput from './OtpInput';
import { colors, spacing, radii, typography } from '../screens/theme';

const CODE_LENGTH = 6;

const OtpForm = () => {
    const { verifyOtp, requestOtp, error, setError } = useUserContext();
    const route = useRoute();
    const { phoneNumber, devCode } = route.params;

    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);

    const handleVerify = async (submittedCode) => {
        setError(null);

        if (submittedCode.length < CODE_LENGTH || loading) {
            return;
        }

        try {
            setLoading(true);
            await verifyOtp(phoneNumber, submittedCode);
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setLoading(false);
        }
    };

    // Verifikohet automatikisht sapo plotesohen te 6 shifrat
    useEffect(() => {
        if (code.length === CODE_LENGTH) {
            handleVerify(code);
        }
    }, [code]);

    const handleResend = async () => {
        setError(null);
        try {
            setResending(true);
            setCode('');
            await requestOtp(phoneNumber);
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setResending(false);
        }
    };

    return (
        <View>
            {!!devCode && (
                <Text style={styles.devHint}>
                    (dev mode) Kodi: {devCode}
                </Text>
            )}

            <OtpInput value={code} onChangeText={setCode} length={CODE_LENGTH} />

            {error && <Text style={styles.error}>{error}</Text>}

            <AnimatedButton
                style={[styles.verifyButton, (loading || code.length < CODE_LENGTH) && styles.buttonDisabled]}
                onPress={() => handleVerify(code)}
                disabled={loading || code.length < CODE_LENGTH}
            >
                <Text style={styles.verifyButtonText}>
                    {loading ? 'Duke verifikuar...' : 'Verifiko'}
                </Text>
            </AnimatedButton>

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
    devHint: {
        ...typography.caption,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.md,
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
