import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Animated, StatusBar, TextInput, ScrollView, Button, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import DatePicker from 'react-native-date-picker'

import Lottie from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
const CreateTask = ({ navigation }) => {

    const [date, setDate] = useState(new Date());
    const [open, setOpen] = useState(false)

    const [priority, setPriority] = useState(2);
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    const [email, setEmail] = useState('');
    const [uid, setUid] = useState('');


    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);

    useEffect(() => {
        console.log("date----------->" + date);
    }, [date])


    useEffect(() => {
        console.log(date)
        console.log(priority)
        console.log(title)
        console.log(description)
    }, [date, priority, title, description])

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

    const sendToFirebase = async () => {
        // convert date to string
        const task = {
            title: title.trim(),
            description: description.trim(),
            date: date.toString(),
            priority: priority,
            ignored: false,
            completed: false,
            email: email,
            uid: uid
        }
        console.log(task)
        try {
            setLoading(true)
            await firestore().collection('tasks').add(task)
            setLoading(false)
            setDone(true)
            setTitle('')
            setDescription('')
            setDate(new Date())
            setPriority(2)

        }
        catch (e) {
            console.log(e)
            Alert.alert('Error', 'Something went wrong, please try again');
        }



    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <View style={styles.main}>
            <StatusBar
                backgroundColor="#686af7"
            />
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
                                navigation.navigate('Home');
                            }
                            }
                        />
                    </View>
                    : null
            }
            <Text style={styles.mainText}>CreateTask</Text>
            <View style={styles.form}>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.title}
                        value={title}
                        placeholder="Enter task title"
                        placeholderTextColor="#555"
                        onChange={(e) => {
                            setTitle(e.nativeEvent.text)
                        }}
                    />
                </View>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput
                        value={description}
                        style={styles.description}
                        multiline={true}
                        textAlignVertical="top"
                        placeholder="Enter task description"
                        placeholderTextColor="#555"
                        onChange={(e) => {
                            setDescription(e.nativeEvent.text)
                        }}
                    />
                </View>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Date & Time</Text>
                    <View style={styles.InputField}>
                        <TouchableOpacity
                            style={styles.date}
                            onPress={() => setOpen(true)}
                        >
                            <Text style={{ color: '#000' }}>{date.toDateString() +
                                "  ||  time :  " + date.getHours() + ":" + date.getMinutes()
                            }</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                                setOpen(false)
                                setDate(date)
                            }}
                            onCancel={() => {
                                setOpen(false)
                            }}
                        />

                    </View>

                </View>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.prorities}>
                        <TouchableOpacity style={{
                            width: '30%',
                            backgroundColor: priority === 1 ? '#f00' : '#fff',
                            padding: 10,
                            borderRadius: 5,
                            borderColor: '#f00',
                            borderWidth: 1,
                        }}
                            onPress={() => setPriority(1)}
                        >
                            <Text style={styles.priorityText}>High</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{
                                width: '30%',
                                backgroundColor: priority === 2 ? '#fb0' : '#fff',
                                padding: 10,
                                borderRadius: 5,
                                borderColor: '#fb0',
                                borderWidth: 1,
                            }} onPress={() => setPriority(2)}
                        >
                            <Text style={styles.priorityText}>Medium</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={{

                                width: '30%',
                                backgroundColor: priority === 3 ? '#0f0' : '#fff',
                                padding: 10,
                                borderRadius: 5,
                                borderColor: '#0f0',
                                borderWidth: 1,
                            }}
                            onPress={() => setPriority(3)}>
                            <Text style={styles.priorityText}>Low</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        backgroundColor: '#686af7',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 50
                    }}
                    onPress={() => sendToFirebase()}
                >
                    <Text style={{
                        color: '#fff',
                        textAlign: 'center',
                        fontSize: 20
                    }}>Create Task</Text>
                </TouchableOpacity>


            </View>
        </View>
    )
}

export default CreateTask

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white'
    },
    mainText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555'
    },
    form: {
        width: '80%',
        marginTop: 20,
    },
    InputField: {
        marginBottom: 20,
    },
    label: {
        fontSize: 20,
        color: '#555'
    },
    title: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        color: '#000'
    },
    description: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        height: 140,
        color: '#000'
    },
    date: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5
    },
    prorities: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5
    },
    priorityText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center'
    },




    loadingScreen: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100
    }











})