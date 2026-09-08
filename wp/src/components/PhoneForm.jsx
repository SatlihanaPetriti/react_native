import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from '../screens/theme';

const PhoneForm = () => {
    const { requestOtp, error, setError } = useUserContext();
    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleContinue = async () => {
        setError(null);

        if (!phoneNumber.trim()) {
            setError('Shkruaj numrin e telefonit');
            return;
        }

        try {
            setLoading(true);

            const { code } = await requestOtp(phoneNumber.trim());

            navigation.navigate('Otp', {
                phoneNumber: phoneNumber.trim(),
                devCode: code,
            });
        } catch (err) {
            // error eshte vendosur tashme nga context
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formBox}>
            <Text style={styles.label}>Numri i telefonit</Text>
            <TextInput
                style={styles.input}
                placeholder="+355 69 123 4567"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable
                style={[styles.continueButton, loading && styles.buttonDisabled]}
                onPress={handleContinue}
                disabled={loading}
            >
                <Text style={styles.continueButtonText}>
                    {loading ? 'Duke dërguar kodin...' : 'Vazhdo'}
                </Text>
            </Pressable>
        </View>
    );
};

export default PhoneForm;

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
    continueButton: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    continueButtonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
});
