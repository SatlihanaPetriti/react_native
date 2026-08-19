import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    Pressable,
    StyleSheet,
} from 'react-native';

import { useUserContext } from '../Context/Auth';
import { useNavigation } from '@react-navigation/native';

const LoginForm = () => {
    const { login, error, setError } = useUserContext();

    const navigation = useNavigation();

    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        setError(null);

        try {
            await login({
                phoneNumber,
                password,
            });

            navigation.navigate('Chats');
        } catch (error) {
            console.log('Login error:', error);
        }
    };

    return (
        <View style={styles.formBox}>
            <Text style={styles.label}>
                Numri i telefonit
            </Text>

            <TextInput
                style={styles.input}
                placeholder="+355 69 123 4567"
                keyboardType="phone-pad"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
            />

            <Text style={styles.label}>
                Fjalekalimi
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Shkruaj fjalëkalimin"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />

            {error && (
                <Text style={styles.error}>
                    {error}
                </Text>
            )}

            <Pressable
                style={styles.loginButton}
                onPress={handleLogin}
            >
                <Text style={styles.loginButtonText}>
                    Login
                </Text>
            </Pressable>

            <Pressable style={styles.registerButton}>
                <Text style={styles.registerButtonText}>
                    Krijo një llogari
                </Text>
            </Pressable>
        </View>
    );
};

export default LoginForm;

const styles = StyleSheet.create({
    formBox: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },

    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#333',
        marginBottom: 6,
    },

    input: {
        height: 48,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        paddingHorizontal: 12,
        fontSize: 16,
        marginBottom: 16,
        color: '#333',
    },

    error: {
        color: 'red',
        marginBottom: 12,
        textAlign: 'center',
    },

    loginButton: {
        height: 48,
        backgroundColor: '#25D366',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },

    loginButtonText: {
        color: '#fff',
        fontSize: 17,
        fontWeight: 'bold',
    },

    registerButton: {
        height: 46,
        borderWidth: 1,
        borderColor: '#25D366',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
    },

    registerButtonText: {
        color: '#075E54',
        fontWeight: 'bold',
    },
});