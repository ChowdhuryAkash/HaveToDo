import { Alert, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';


const Profile = ({navigation}) => {
    const[name, setName] = useState('');
    const [email, setEmail] = useState('');
    

    const getName = async () => {
        const email = await AsyncStorage.getItem('email');
        const uid = await AsyncStorage.getItem('uid');
        const snapshot = await firestore().collection('users').doc(uid).get();
        setName(snapshot.data().name);
        setEmail(email);
    }

    useEffect(() => {
        getName();
    }, [])
        
    const logout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            {
                text: 'No',
                onPress: () => console.log('No Pressed')
            },
            {
                text: 'Yes',
                onPress: async () => {
                    await AsyncStorage.removeItem('email');
                    await AsyncStorage.removeItem('uid');
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Splash' }]
                    })
                    console.log('Logged Out');
                }
            }
        ])

    }
    return (
        <View style={styles.main}>
            <View style={styles.top}>
                <View style={styles.left}>
                    <Image source={require('../../assets/profile.png')} style={styles.profileImage} />
                </View>
                <View style={styles.right}>
                    <Text style={styles.name}>{name}</Text>
                    <Text style={styles.email}>{email}</Text>
                </View>

            </View>
            <View style={styles.bottom}>
                <TouchableOpacity style={styles.button}
                onPress={() => logout()}
                >
                    <Text style={styles.buttonText}>Log Out</Text>
                </TouchableOpacity>

                </View>
        </View>
    )
}

export default Profile

const styles = StyleSheet.create({
    main: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    top: {
        flexDirection: 'row',
        width: '100%',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc'
    },
    left: {
        width: '30%',
        marginRight: 10,
    },
    right: {
        width: '70%',
        justifyContent: 'center',
        alignItems: 'left',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50
    },
    name: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#555'
    },
    email: {
        fontSize: 16,
        color: '#555'
    },
    bottom: {
        width: '100%',
        padding: 20
    },
    button: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 5
    },
    buttonText: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 18
    }

})