import { StyleSheet, Text, View, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';

const ViewTask = ({ navigation, route }) => {
    const { id, title, description, date, priority } = route.params;

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#686af7" />
            <Text style={styles.mainText}>Task Details</Text>

            <View style={styles.card}>
                <Text style={styles.label}>Title:</Text>
                <Text style={styles.value}>{title}</Text>

                <Text style={styles.label}>Description:</Text>
                <Text style={styles.value}>{description}</Text>

                <Text style={styles.label}>Date & Time:</Text>
                <Text style={styles.value}>{
                    new Date(date).toDateString() +
                    "  ||  Time:  " + new Date(date).getHours() + ":" + new Date(date).getMinutes()
                }</Text>

                <Text style={styles.label}>Priority:</Text>
                <Text style={[styles.priority, styles[`priority${priority}`]]}>
                    {priority === 1 ? 'High' : priority === 2 ? 'Medium' : 'Low'}
                </Text>
            </View>

            <TouchableOpacity
                style={styles.editButton}
                onPress={() => navigation.navigate('EditTask', {
                    id,
                    details:{
                        title,
                        description,
                        initialDate:date,
                        initialPriority:priority
                    }
                })}
            >
                <Text style={styles.editButtonText}>Edit Task</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ViewTask;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
    },
    mainText: {
        fontSize: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#555',
        marginBottom: 20,
    },
    card: {
        width: '90%',
        backgroundColor: '#f9f9f9',
        padding: 20,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#555',
        marginTop: 10,
    },
    value: {
        fontSize: 16,
        color: '#333',
        marginTop: 5,
        marginLeft: 10,
    },
    priority: {
        width: 100,
        height: 100,
        borderRadius: 50,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 10,
        marginLeft: 10,
        paddingTop: 30,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

    },
    priority1: {
        backgroundColor: '#f00',
    },
    priority2: {
        backgroundColor: '#fb0',
    },
    priority3: {
        backgroundColor: '#0f0',
    },
    editButton: {
        marginTop: 30,
        backgroundColor: '#686af7',
        padding: 15,
        borderRadius: 10,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
