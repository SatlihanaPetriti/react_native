import { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { colors, radii } from '../screens/theme';

const AppMark = () => {
    const scale = useRef(new Animated.Value(0.4)).current;
    const rotate = useRef(new Animated.Value(-1)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scale, {
                toValue: 1,
                friction: 6,
                tension: 60,
                useNativeDriver: true,
            }),
            Animated.spring(rotate, {
                toValue: 0,
                friction: 7,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const rotateDeg = rotate.interpolate({
        inputRange: [-1, 0],
        outputRange: ['-12deg', '0deg'],
    });

    return (
        <Animated.View
            style={[
                styles.mark,
                { transform: [{ scale }, { rotate: rotateDeg }] },
            ]}
        >
            <Animated.View style={styles.bubbleBack} />
            <Animated.View style={styles.bubbleFront} />
        </Animated.View>
    );
};

export default AppMark;

const styles = StyleSheet.create({
    mark: {
        width: 84,
        height: 84,
        borderRadius: radii.lg,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
        shadowColor: colors.primaryDark,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 12,
        elevation: 6,
    },
    bubbleBack: {
        position: 'absolute',
        width: 30,
        height: 24,
        borderRadius: 10,
        backgroundColor: colors.primaryTint,
        opacity: 0.55,
        top: 22,
        left: 18,
    },
    bubbleFront: {
        position: 'absolute',
        width: 34,
        height: 28,
        borderRadius: 11,
        backgroundColor: '#FFFFFF',
        bottom: 20,
        right: 16,
    },
});
