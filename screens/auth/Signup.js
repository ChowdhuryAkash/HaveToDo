import { Image, StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Lottie from 'lottie-react-native';
const Signup = ({ navigation }) => {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    const Signup = async () => {
        console.log(name);
        console.log(email);
        console.log(password);

        setName(name.trim());
        setEmail(email.trim());
        setPassword(password.trim());

        // check for null
        if (name === '' || email === '' || password === '') {
            Alert.alert('Error','Please fill all fields');
            return;
        }

        // check for regular expressions and size
        var regx = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!regx.test(email)) {
            Alert.alert('Error','Please enter valid email');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Error','Password must be atleast 6 characters');
            return;
        }
        var regx = /^[A-Za-z\s]+$/;
        if (!regx.test(name)) {
            Alert.alert('Error','Please enter valid name');
            return;
        }

        setLoading(true);



        try {
            // Create user in Firebase Authentication
            const userCredential = await auth().createUserWithEmailAndPassword(email, password);

            // Get user ID
            const uid = userCredential.user.uid;

            // Save user data to Firestore
            await firestore().collection('users').doc(uid).set({
                name,
                email,
                createdAt: firestore.FieldValue.serverTimestamp(),
            });

            setLoading(false);
            setTimeout(() => {
                setDone(true);
            }, 100);

        } catch (error) {
            console.log(error.code);

            setLoading(false);
            // wait for 1 second
            setTimeout(() => {
                if (error.code === 'auth/email-already-in-use') {
                    Alert.alert('Error','This email id is already registered, please try another.');
                } else if (error.code === 'auth/invalid-email') {
                    Alert.alert('Error','Invalid email.');
                } else if (error.code === 'auth/weak-password') {
                    Alert.alert('Error','Weak password.');
                }
                else {
                    Alert.alert('Error','Something went wrong.');
                }
            }, 200);



        }

    }

    useEffect(() => {
        console.log(name);
        console.log(email);
        console.log(password);
    }, [name, email, password]);

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
                                    navigation.navigate('Login');
                                }
                                }
                            />
                        </View>
                        : null
                }

                <Image source={require('../../assets/SignupLogo.png')} style={styles.logo} />
                <Text style={styles.welcomeText}>Let's Get Started!</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputField}>
                        <Text style={styles.inputName}>Name</Text>
                        <TextInput style={styles.input} placeholder="Name"
                            placeholderTextColor="#444"
                            onChange={(e) => setName(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.inputName}>Email</Text>
                        <TextInput style={styles.input} placeholder="Email"
                            placeholderTextColor="#444"
                            keyboardType='email-address'
                            onChange={(e) => setEmail(e.nativeEvent.text)}
                        />
                    </View>
                    <View style={styles.inputField}>
                        <Text style={styles.inputName}>Password</Text>
                        <TextInput style={styles.input} placeholder="Password"
                            placeholderTextColor="#444"
                            secureTextEntry={true}
                            onChange={(e) => setPassword(e.nativeEvent.text)}
                        />
                    </View>

                    <TouchableOpacity style={styles.button}
                        onPress={() => Signup()}
                    >
                        <Text style={styles.buttonText}>Sign up</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.otherContainer}>
                    <Text style={styles.orSignUpWithText}>Or sign up with</Text>
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
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.haveanaccountText}>Already have an account? <Text style={{ color: '#686af7' }}>Login</Text></Text>
                </TouchableOpacity>
            </ScrollView >
        </View >
    )
}

export default Signup

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