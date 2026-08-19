import React from 'react';
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

const LoginScreen = () => {
    return (
        <>
            <StatusBar
                backgroundColor="#2c912f"
                barStyle="light-content"
            />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <Logo />
                        <LoginForm />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 2,
        backgroundColor: '#2c912f',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
});