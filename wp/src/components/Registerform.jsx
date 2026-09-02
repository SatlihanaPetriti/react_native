import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { useUserContext } from '../Context/Auth';
import { colors, spacing, radii, typography } from '../screens/theme';

const RegisterForm = () => {
    const { register, error, setError } = useUserContext();
    const navigation = useNavigation();

    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError(null);

        // Kontrollojmë vetëm nëse fushat janë plotësuar
        if (
            !name.trim() ||
            !lastname.trim() ||
            !phoneNumber.trim() ||
            !email.trim() ||
            !password ||
            !confirmPassword
        ) {
            setError('Plotëso të gjitha fushat');
            return;
        }

        // Kontrolli i password-it në frontend
        if (password.length < 6) {
            setError('Fjalëkalimi duhet të ketë të paktën 6 shkronja/numra');
            return;
        }

        if (password !== confirmPassword) {
            setError('Fjalëkalimet nuk përputhen');
            return;
        }

        try {
            setLoading(true);

            await register({
                name: name.trim(),
                lastname: lastname.trim(),
                phoneNumber: phoneNumber.trim(),
                email: email.trim(),
                password,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.formBox}>

            <Text style={styles.label}>Emri</Text>
            <TextInput
                style={styles.input}
                placeholder="Emri yt"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={setName}
            />

            <Text style={styles.label}>Mbiemri</Text>
            <TextInput
                style={styles.input}
                placeholder="Mbiemri yt"
                placeholderTextColor={colors.textSecondary}
                value={lastname}
                onChangeText={setLastname}
            />

            <Text style={styles.label}>Numri i telefonit</Text>
            <TextInput
                style={styles.input}
                placeholder="+355 69 123 4567"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <Text style={styles.label}>Email</Text>
            <TextInput
                style={styles.input}
                placeholder="emri@shembull.com"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
            />

            <Text style={styles.label}>Fjalëkalimi</Text>
            <TextInput
                style={styles.input}
                placeholder="Zgjidh një fjalëkalim"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            <Text style={styles.label}>Konfirmo fjalëkalimin</Text>
            <TextInput
                style={styles.input}
                placeholder="Shkruaj përsëri fjalëkalimin"
                placeholderTextColor={colors.textSecondary}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            <Pressable
                style={[
                    styles.registerButton,
                    loading && styles.buttonDisabled,
                ]}
                onPress={handleRegister}
                disabled={loading}
            >
                <Text style={styles.registerButtonText}>
                    {loading ? 'Duke krijuar...' : 'Krijo llogari'}
                </Text>
            </Pressable>

            <Pressable
                style={styles.loginLinkButton}
                onPress={() => navigation.navigate('Login')}
            >
                <Text style={styles.loginLinkText}>
                    Kam tashmë një llogari
                </Text>
            </Pressable>

        </View>
    );
};

export default RegisterForm;

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

    registerButton: {
        height: 48,
        backgroundColor: colors.primary,
        borderRadius: radii.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },

    buttonDisabled: {
        opacity: 0.6,
    },

    registerButtonText: {
        ...typography.subtitle,
        color: colors.textOnPrimary,
    },

    loginLinkButton: {
        height: 46,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: spacing.md,
    },

    loginLinkText: {
        ...typography.subtitle,
        color: colors.primaryDark,
    },
});