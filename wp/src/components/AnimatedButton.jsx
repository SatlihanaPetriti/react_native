import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const AnimatedButton = ({ onPress, disabled, style, children }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const animateTo = (toValue, speed) => {
        Animated.spring(scale, { toValue, speed, useNativeDriver: true }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={() => animateTo(0.96, 50)}
            onPressOut={() => animateTo(1, 30)}
            disabled={disabled}
        >
            <Animated.View
                style={[style, { transform: [{ scale }] }, disabled && styles.disabled]}
            >
                {children}
            </Animated.View>
        </Pressable>
    );
};

export default AnimatedButton;

const styles = StyleSheet.create({
    disabled: {
        opacity: 0.6,
    },
});
