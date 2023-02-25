import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';

import config from '../config/styles';
import Text from '../components/Text';
import Button from "../components/Button";
import routes from "../navigation/routes";

function WelcomeScreen(props) {
    return (
        <ImageBackground 
            style={styles.background}
            source={require('../assets/mobilescreen.jpg')}> 
            <Text style={styles.title}>Aircraft Modelling</Text>
            <Text style={styles.library}>for WWII</Text>
            <View style={styles.buttonsContainer}> 
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: "flex-end",
        alignItems: "center"
    },
    buttonsContainer: {
        padding: 20,
        width: "100%",    
    },
    title: {
        color: config.colors.white,
        fontWeight: "bold",
        fontSize: 24,
        position: "absolute",
        top: 40,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    },
    library: {
        color: config.colors.white,
        fontWeight: "bold",
        fontSize: 24,
        position: "absolute",
        top: 74,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: {width: -1, height: 1},
        textShadowRadius: 10
    }
})

export default WelcomeScreen;