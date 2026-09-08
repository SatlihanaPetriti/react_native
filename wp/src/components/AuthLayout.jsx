import { useEffect, useRef } from 'react';
import {
    View,
    Text,
    Animated,
    StyleSheet,
    StatusBar,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Keyboard,
    Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppMark from './AppMark';
import { colors, spacing, radii, typography } from '../screens/theme';

const AuthLayout = ({ title, subtitle, step, totalSteps = 3, children }) => {
    const headerFade = useRef(new Animated.Value(0)).current;
    const headerSlide = useRef(new Animated.Value(16)).current;
    const cardFade = useRef(new Animated.Value(0)).current;
    const cardSlide = useRef(new Animated.Value(30)).current;
    const blobDrift = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(160, [
            Animated.parallel([
                Animated.timing(headerFade, { toValue: 1, duration: 450, useNativeDriver: true }),
                Animated.timing(headerSlide, { toValue: 0, duration: 450, useNativeDriver: true }),
            ]),
            Animated.parallel([
                Animated.timing(cardFade, { toValue: 1, duration: 500, useNativeDriver: true }),
                Animated.spring(cardSlide, { toValue: 0, friction: 8, useNativeDriver: true }),
            ]),
        ]).start();

        // Levizje e ngadalte, e vazhdueshme e rrathve ne sfond - i jep jete ekranit
        Animated.loop(
            Animated.sequence([
                Animated.timing(blobDrift, { toValue: 1, duration: 4500, useNativeDriver: true }),
                Animated.timing(blobDrift, { toValue: 0, duration: 4500, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    const blobTopShift = blobDrift.interpolate({ inputRange: [0, 1], outputRange: [0, 26] });
    const blobBottomShift = blobDrift.interpolate({ inputRange: [0, 1], outputRange: [0, -22] });

    return (
        <SafeAreaView style={styles.safeArea}>
            <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

            <Animated.View
                style={[styles.decorTop, { transform: [{ translateY: blobTopShift }] }]}
                pointerEvents="none"
            />
            <Animated.View
                style={[styles.decorBottom, { transform: [{ translateY: blobBottomShift }] }]}
                pointerEvents="none"
            />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.flex}>
                        <Animated.View
                            style={[
                                styles.header,
                                { opacity: headerFade, transform: [{ translateY: headerSlide }] },
                            ]}
                        >
                            <AppMark />
                            <Text style={styles.title}>{title}</Text>
                            {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
                        </Animated.View>

                        <Animated.View
                            style={[
                                styles.content,
                                { opacity: cardFade, transform: [{ translateY: cardSlide }] },
                            ]}
                        >
                            {children}
                        </Animated.View>

                        {!!step && (
                            <View style={styles.dots}>
                                {Array.from({ length: totalSteps }).map((_, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.dot,
                                            index + 1 === step && styles.dotActive,
                                        ]}
                                    />
                                ))}
                            </View>
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default AuthLayout;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: colors.background,
    },

    flex: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: spacing.lg,
    },

    decorTop: {
        position: 'absolute',
        top: -80,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: radii.pill,
        backgroundColor: colors.primaryTint,
    },

    decorBottom: {
        position: 'absolute',
        bottom: -100,
        left: -70,
        width: 260,
        height: 260,
        borderRadius: radii.pill,
        backgroundColor: colors.primaryTint,
    },

    header: {
        alignItems: 'center',
        marginBottom: spacing.lg,
    },

    title: {
        ...typography.title,
        color: colors.textPrimary,
        textAlign: 'center',
    },

    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
        textAlign: 'center',
    },

    content: {
        backgroundColor: colors.surface,
        borderRadius: radii.lg,
        padding: spacing.lg,
        shadowColor: colors.accentDark,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 16,
        elevation: 3,
    },

    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: spacing.xs,
        marginTop: spacing.lg,
    },

    dot: {
        width: 8,
        height: 8,
        borderRadius: radii.pill,
        backgroundColor: colors.border,
    },

    dotActive: {
        width: 22,
        backgroundColor: colors.primary,
    },
});
