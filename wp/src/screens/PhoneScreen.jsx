import React from 'react';
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Logo from '../components/Logo';
import PhoneForm from '../components/PhoneForm';
import { colors } from './theme';

const PhoneScreen = () => {
    return (
        <>
            <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <Logo />
                        <PhoneForm />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};

export default PhoneScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
});
