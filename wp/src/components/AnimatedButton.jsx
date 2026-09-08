import { useRef } from 'react';
import { Animated, Pressable, StyleSheet } from 'react-native';

const AnimatedButton = ({ onPress, disabled, style, children }) => {
    const scale = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => {
        Animated.spring(scale, {
            toValue: 0.96,
            speed: 50,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(scale, {
            toValue: 1,
            speed: 30,
            useNativeDriver: true,
        }).start();
    };

    return (
        <Pressable
            onPress={onPress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            disabled={disabled}
        >
            <Animated.View
                style={[
                    style,
                    { transform: [{ scale }] },
                    disabled && styles.disabled,
                ]}
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
