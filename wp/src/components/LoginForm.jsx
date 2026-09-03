import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from '../screens/theme';

const LoginForm = () => {
    const { login, error, setError } = useUserContext();
    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        setError(null);
        await login({ phoneNumber, password });
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

            <Text style={styles.label}>Fjalekalimi</Text>
            <TextInput
                style={styles.input}
                placeholder="Shkruaj fjalëkalimin"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error && <Text style={styles.error}>{error}</Text>}

            <Pressable style={styles.loginButton} onPress={handleLogin}>
                <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>

            <Pressable
                style={styles.registerButton}
                onPress={() => navigation.navigate('Register')}
            >
                <Text style={styles.registerButtonText}>Krijo një llogari</Text>
            </Pressable>
        </View>
    );
};

export default LoginForm;

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
    loginButton: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButtonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },
    registerButton: {
        height: 46,
        borderWidth: 1,
        borderColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.lg,
    },
    registerButtonText: {
        ...typography.subtitle,
        color: colors.primaryDark,
    },
});