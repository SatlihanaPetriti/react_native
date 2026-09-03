import { KeyboardAvoidingView, Platform, ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RegisterForm from '../components/Registerform';
import { colors } from './theme';

const RegisterScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboard}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.header}>
                        <Text style={styles.title}>Krijo llogari</Text>
                        <Text style={styles.subtitle}>
                            Plotëso të dhënat për të krijuar llogarinë tënde
                        </Text>
                    </View>

                    <RegisterForm />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    keyboard: {
        flex: 1,
    },

    content: {
        flexGrow: 1,
        padding: 20,
    },

    header: {
        marginBottom: 20,
    },

    title: {
        fontSize: 28,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
    },

    subtitle: {
        fontSize: 15,
        color: colors.textSecondary,
    },
});