import { useRef } from 'react';
import { View, TextInput, Animated, StyleSheet } from 'react-native';
import { colors, spacing, radii, typography } from '../screens/theme';

const OtpInput = ({ value, onChangeText, length = 6 }) => {
    const inputs = useRef([]);
    const scales = useRef(
        Array.from({ length }, () => new Animated.Value(1))
    ).current;

    const bounce = (index) => {
        Animated.sequence([
            Animated.timing(scales[index], {
                toValue: 1.15,
                duration: 90,
                useNativeDriver: true,
            }),
            Animated.spring(scales[index], {
                toValue: 1,
                friction: 4,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const handleChange = (text, index) => {
        const digit = text.slice(-1);
        const chars = value.split('');
        chars[index] = digit;
        onChangeText(chars.join('').slice(0, length));

        if (digit) {
            bounce(index);
            if (index < length - 1) {
                inputs.current[index + 1]?.focus();
            }
        }
    };

    const handleKeyPress = (e, index) => {
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    return (
        <View style={styles.row}>
            {Array.from({ length }).map((_, index) => (
                <Animated.View
                    key={index}
                    style={{ transform: [{ scale: scales[index] }] }}
                >
                    <TextInput
                        ref={(ref) => { inputs.current[index] = ref; }}
                        style={[styles.box, value[index] && styles.boxFilled]}
                        keyboardType="number-pad"
                        maxLength={1}
                        value={value[index] || ''}
                        onChangeText={(text) => handleChange(text, index)}
                        onKeyPress={(e) => handleKeyPress(e, index)}
                    />
                </Animated.View>
            ))}
        </View>
    );
};

export default OtpInput;

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: spacing.md,
    },
    box: {
        width: 46,
        height: 54,
        borderRadius: radii.sm,
        borderWidth: 1.5,
        borderColor: colors.border,
        backgroundColor: colors.background,
        textAlign: 'center',
        ...typography.title,
        fontSize: 22,
        color: colors.textPrimary,
    },
    boxFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryTint,
    },
});
