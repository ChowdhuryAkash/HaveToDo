import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Lottie from 'lottie-react-native';

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);
    const [uid, setUid] = useState('');

    useEffect(() => {
        console.log(email, password);
    }, [email, password]);

    const storeData = async (email, uid) => {
        try {
            await AsyncStorage.setItem('email', email);
            await AsyncStorage.setItem('uid', uid);

        } catch (e) {
            // saving error
        }
    }


    const handleLogin = async () => {
        setEmail(email.trim());
        setPassword(password.trim());

        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields.');
            return;
        }
        const regex = /\S+@\S+\.\S+/;
        if (!regex.test(email)) {
            Alert.alert('Error', 'Invalid email address');
            return;
        }
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }


        setLoading(true);

        try {
            // Firebase Authentication login
            const userCredential = await auth().signInWithEmailAndPassword(email, password);

            // Get user ID (UID)
            const uid = userCredential.user.uid;
            setUid(uid);

            setLoading(false);
            storeData(email, uid);
            setTimeout(() => {
            setDone(true);
            }, 200);
        } catch (error) {
            setLoading(false);

            setTimeout(() => {
                console.log(error.code);
                if (error.code === 'auth/user-not-found') {
                    Alert.alert('Error', 'User not found');
                } else if (error.code === 'auth/invalid-credential') {
                    Alert.alert('Error', 'Invalid credentials, please try again with right email id and password');
                }
                else {
                    Alert.alert('Error', 'Something went wrong, please try again.');
                }

            }, 200);
        }
    };


    return (


        <View style={styles.main}>
            <ScrollView contentContainerStyle={{
                width: '100%',
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                {
                    loading ?
                        <View style={styles.loadingScreen}>
                            <ActivityIndicator size={80} color="#000" />
                        </View>
                        : null
                }
                {
                    done ?
                        <View style={styles.loadingScreen}>
                            <Lottie source={require('../../assets/animations/successful.json')} autoPlay loop={false}
                                style={{
                                    width: 500,
                                    height: 500
                                }}
                                onAnimationFinish={() => {
                                    setDone(false);
                                    navigation.reset({
                                        index: 0,
                                        routes: [{ name: 'Home' }]
                                    })
                                }
                                }
                            />
                        </View>
                        : null
                }
                <Image source={require('../../assets/SignupLogo.png')} style={styles.logo} />
                <Text style={styles.welcomeText}>Welcome Back!</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputField}>
                        <Text style={styles.inputName}>Email</Text>
                        <TextInput style={styles.input} placeholder="Email"
                            placeholderTextColor="#444"
                            onChange={(e) => setEmail(e.nativeEvent.text)}
                            keyboardType='email-address'

                        />
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.inputName}>Password</Text>
                        <TextInput style={styles.input} placeholder="Password"
                            placeholderTextColor="#444"
                            onChange={(e) => setPassword(e.nativeEvent.text)}
                            secureTextEntry={true}
                        />
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleLogin}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.otherContainer}>
                    <Text style={styles.orSignUpWithText}>Or Log in with</Text>
                    <View style={styles.socialButtonContainer}>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={styles.socialButtonImageContainer1}>
                                <Image source={require('../../assets/google.png')} style={styles.socialButtonImage1} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={styles.socialButtonImageContainer2}>
                                <Image source={require('../../assets/fb.png')} style={styles.socialButtonImage2} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialButton}>
                            <View style={styles.socialButtonImageContainer3}>
                                <Image source={require('../../assets/apple.png')} style={styles.socialButtonImage3} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.haveanaccountText}>Don't have an account? <Text style={{ color: '#686af7' }}>Sign up</Text></Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    )
}

export default Login

const styles = StyleSheet.create({
    main: {
        flex: 1,
        // alignItems: 'center',
        backgroundColor: '#fff',
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',

    },
    formContainer: {
        width: '80%'
    },
    inputField: {
        marginBottom: 10
    },
    inputName: {
        color: '#777',
        fontSize: 16,
        marginBottom: 5
    },
    input: {
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 5,
        borderColor: '#555',
        borderWidth: 1,
        color: '#333'
    },
    button: {
        backgroundColor: '#686af7',
        padding: 10,
        width: '60%',
        alignSelf: 'center',
        borderRadius: 25,
        marginTop: 30
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },

    otherContainer: {
        marginTop: 30
    },
    orSignUpWithText: {
        color: '#777',
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 5
    },
    socialButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    socialButton: {
        padding: 10,
        borderRadius: 25,
        width: '30%'
    },
    socialButtonImageContainer1: {
        backgroundColor: '#f00',
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    socialButtonImageContainer2: {
        backgroundColor: '#316FF6',
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    socialButtonImageContainer3: {
        backgroundColor: '#000',
        padding: 10,
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    socialButtonImage1: {
        width: 20,
        height: 20,
        alignSelf: 'center',
        tintColor: '#fff'
    },
    socialButtonImage2: {
        width: 28,
        height: 28,
        alignSelf: 'center',
        tintColor: '#fff'
    },
    socialButtonImage3: {
        width: 16,
        height: 20,
        alignSelf: 'center',
        tintColor: '#fff'
    },
    haveanaccountText: {
        color: '#777',
        fontSize: 16,
        marginTop: 20
    },
    loadingScreen: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    animation: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    }

})