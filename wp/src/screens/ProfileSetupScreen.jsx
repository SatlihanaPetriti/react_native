import React from 'react';
import { View, StyleSheet, StatusBar, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import Logo from '../components/Logo';
import ProfileSetupForm from '../components/ProfileSetupForm';
import { colors } from './theme';

const ProfileSetupScreen = () => {
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
                        <ProfileSetupForm />
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </>
    );
};

export default ProfileSetupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.primary,
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
});
