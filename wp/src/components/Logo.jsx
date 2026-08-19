import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

import img from '../../assets/image/img_1.jpeg';

const Logo = () => {
    return (
        <View style={styles.header}>
            <View style={styles.logoCircle}>
                <Image
                    source={img}
                    style={styles.logo}
                />
            </View>
            <Text style={styles.title}>WhatsApp Clone</Text>
            <Text style={styles.subtitle}>
                Hyr per te vazhduar bisedat
            </Text>
        </View>
    );
};

export default Logo;

const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 30,
    },

    logoCircle: {
        width: 120,
        height: 120,
        borderRadius: 60,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },

    subtitle: {
        marginTop: 6,
        fontSize: 15,
        color: 'white',
    },
});