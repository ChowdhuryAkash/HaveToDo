import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Animated, StatusBar, TextInput, ScrollView, Button, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import DatePicker from 'react-native-date-picker';
import Lottie from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';

const EditTask = ({ navigation, route }) => {
    const { id, details } = route.params;
    // console.log("Edit task:", { id, details});

    var _id = id;
    var _title = details.title;
    var _description = details.description;
    var _date = details.initialDate;
    var _priority = details.initialPriority;

    console.log(`
    id: ${_id}
    title: ${_title}
    description: ${_description}
    date: ${_date}
    priority: ${_priority}


        `);

    const [title, setTitle] = useState(_title);
    const [description, setDescription] = useState(_description);
    const [date, setDate] = useState(new Date(_date));
    const [priority, setPriority] = useState(_priority);



    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState(false);


    const updateFirebaseTask = async () => {
        if (!title.trim()) {
            Alert.alert('Validation Error', 'Title cannot be empty');
            return;
        }

        const updatedTask = {
            title: title.trim(),
            description: description.trim(),
            date: date.toString(),
            priority,
        };

        console.log("Updating task:", updatedTask);

        try {
            setLoading(true);
            await firestore().collection('tasks').doc(id).update(updatedTask);
            setLoading(false);
            setDone(true);
        } catch (e) {
            console.error("Error updating task:", e);
            Alert.alert('Error', 'Something went wrong, please try again');
        }
    };
    return (
        <View style={styles.main}>
            <StatusBar backgroundColor="#686af7" />
            {loading && (
                <View style={styles.loadingScreen}>
                    <ActivityIndicator size={80} color="#000" />
                </View>
            )}
            {done && (
                <View style={styles.loadingScreen}>
                    <Lottie
                        source={require('../../assets/animations/successful.json')}
                        autoPlay
                        loop={false}
                        style={{ width: 500, height: 500 }}
                        onAnimationFinish={() => {
                            setDone(false);
                            navigation.goBack();
                        }}
                    />
                </View>
            )}
            <Text style={styles.mainText}>Edit Task</Text>
            <View style={styles.form}>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput
                        style={styles.title}
                        value={title}
                        placeholder="Enter task title"
                        placeholderTextColor="#555"
                        onChange={(e) => setTitle(e.nativeEvent.text)}
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
                        onChange={(e) => setDescription(e.nativeEvent.text)}
                    />
                </View>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Date & Time</Text>
                    <View style={styles.InputField}>
                        <TouchableOpacity
                            style={styles.date}
                            onPress={() => setOpen(true)}
                        >
                            <Text style={{ color: '#000' }}>{
                                date.toDateString() +
                                "  ||  time :  " + date.getHours() + ":" + date.getMinutes()
                            }</Text>
                        </TouchableOpacity>
                        <DatePicker
                            modal
                            open={open}
                            date={date}
                            onConfirm={(date) => {
                                setOpen(false);
                                setDate(date);
                            }}
                            onCancel={() => {
                                setOpen(false);
                            }}
                        />
                    </View>
                </View>
                <View style={styles.InputField}>
                    <Text style={styles.label}>Priority</Text>
                    <View style={styles.priorities}>
                        <TouchableOpacity
                            style={{
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
                            }}
                            onPress={() => setPriority(2)}
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
                            onPress={() => setPriority(3)}
                        >
                            <Text style={styles.priorityText}>Low</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity
                    style={{
                        backgroundColor: '#686af7',
                        padding: 10,
                        borderRadius: 5,
                        marginTop: 50,
                    }}
                    onPress={() => updateFirebaseTask()}
                >
                    <Text
                        style={{
                            color: '#fff',
                            textAlign: 'center',
                            fontSize: 20,
                        }}
                    >
                        Update Task
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default EditTask;

const styles = StyleSheet.create({
    main: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    mainText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555',
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
        color: '#555',
    },
    title: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        color: '#000',
    },
    description: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
        height: 140,
        color: '#000',
    },
    date: {
        borderWidth: 1,
        borderColor: '#555',
        borderRadius: 5,
        padding: 10,
        marginTop: 5,
    },
    priorities: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 5,
    },
    priorityText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loadingScreen: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
    },
});
