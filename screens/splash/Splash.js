import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Animated, StatusBar } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Splash = ({ navigation }) => {
    const size = useRef(new Animated.Value(1)).current;
    const[email,setEmail]=useState('');
    const[uid, setUid]=useState('');
    const [contentVisible, setContentVisible] = useState(false);

    useEffect(() => {
        // Start the animation when the component mounts
        Animated.timing(size, {
            toValue: 0.5, // End value (smaller size)
            duration: 1000, // Duration of the animation (1 second)
            useNativeDriver: false,
        }).start(() => {
            // Callback function after animation completes
            setContentVisible(true);
            console.log(email);
            if (email !== '') {
                // navigation.replace('Home');
            }
        });
    }, [size,email]);


    const getData = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            const uid = await AsyncStorage.getItem('uid');
            console.log("email:-", email);
            console.log("uid:-", uid);
            if (email !== null) {
                setEmail(email);
                setUid(uid);
            }
        } catch (e) {
            // error reading value
        }
    }

    useEffect(() => {
        getData();
    });
    return (
        <ImageBackground source={require('../../assets/splashbg.jpeg')} style={styles.main}>
            <StatusBar
                backgroundColor="#686af7"
            />
            <View style={styles.mainContainer}>
                
                <Animated.Image
                    source={require('../../assets/splashScreenLogo2.png')} style={[
                        styles.logo,
                        {
                            transform: [{ scale: size }],
                        },
                    ]}
                />

                {
                    contentVisible ?
                        <>
                            <Text style={styles.maintext}>Manage Your Tasks Super Easy.</Text>
                            <TouchableOpacity style={styles.button} onPress={() => {
                                if (email !== '') {
                                    navigation.replace('Home');
                                }
                                else{
                                    navigation.navigate('Login');
                                }
                            }}>
                                <Text style={styles.buttontext}>Let’s get started</Text>
                                <Image style={styles.buttonArrow} source={require('../../assets/arrowRight.png')} />
                            </TouchableOpacity></>
                        : null
                }

            </View>
        </ImageBackground>
    )
}

export default Splash

const styles = StyleSheet.create({
    main: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    mainContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        width: '100%',
        height: '100%',
    },
    logo: {
        width: 400,
        height: 400,
        alignSelf: 'center',
        // marginTop:-20
    },
    maintext: {
        color: 'white',
        fontSize: 48,
        width: 350,
        fontWeight: 'bold',
        textAlign: 'left',
        marginLeft: 20,
        lineHeight: 55,
        textTransform: 'capitalize',
        marginTop: -50,
    },
    button: {
        backgroundColor: '#686af7',
        width: 200,
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        marginLeft: 20,
        padding: 5,
    },
    buttontext: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonArrow: {
        width: 20,
        height: 20,
        marginLeft: 10,
    }
})