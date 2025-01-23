import { StyleSheet, Text, View, ImageBackground, Image, TouchableOpacity, Animated, StatusBar, TextInput, ScrollView, ActivityIndicator, Alert } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useFocusEffect } from '@react-navigation/native';
import Lottie from 'lottie-react-native';
import firestore from '@react-native-firebase/firestore';
try {
  SystemNavigationBar.setNavigationColor('#FFFFFF', true);
  // SystemNavigationBar.fullScreen(true);
}
catch (e) {
  console.log(e);
}


const Home = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [uid, setUid] = useState('');
  const completedcolor = 'rgba(104,106,47,.6)';
  const ignoredcolor = 'rgba(0,0,0,0.1)';


  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [search, setSearch] = useState('');


  const [tasks, setTasks] = useState([]);
  const [sortedTasks, setSortedTasks] = useState([]);
  const [searchedTasks, setSearchedTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [tomorrowTasks, setTomorrowTasks] = useState([]);
  const [thisWeekTasks, setThisWeekTasks] = useState([]);
  const [upcomingotherTasks, setUpcomingOtherTasks] = useState([]);
  const [pastTasks, setPastTasks] = useState([]);

  const [sortType, setSortType] = useState('time');


  useFocusEffect(
    React.useCallback(() => {
      const onFocus = async () => {
        console.log("Home focused");
        setLoading(true); // Start loading indicator
        await getTasks(); // Fetch tasks
        setLoading(false); // Stop loading indicator
      };

      onFocus(); // Call the function when the page is focused

      return () => {
        console.log("Home unfocused");
      }; // Cleanup function (if needed)
    }, [])
  );


  const getTasks = async () => {
    const tasksArray = [];
    // Fetch tasks only for the current user email id
    try {
      const snapshot = await firestore().collection('tasks').where('email', '==', email).get();
      snapshot.forEach(doc => {
        tasksArray.push({
          id: doc.id, // Add the document ID
          ...doc.data() // Spread the document data
        });
      });
      setTasks([...tasksArray]);
      console.log("Tasks:", tasksArray);
      console.log("Tasks are fetching successfully");

      if (tasksArray.length > 0) {
        sortTasks();
      }
    } catch (e) {
      console.log(e);
    }
  };


  const deleteTask = async (id) => {
    Alert.alert(
      "Delete Task",
      "Are you sure you want to delete this task?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Delete", onPress: async () => {
            try {
              setLoading(true);
              await firestore().collection('tasks').doc(id).delete();
              console.log("Task deleted successfully");
              setDone(true);
              setLoading(false);
              getTasks();
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );

  }

  const ignoreTask = async (id) => {
    // check for completed variable value, make it reverse
    // if completed is false, make it true
    // if completed is true, make it false
    Alert.alert(
      "Ignore Task",
      "Are you sure you want to ignore this task?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Ignore", onPress: async () => {
            try {
              setLoading(true);
              const task = tasks.find(task => task.id == id);
              await firestore().collection('tasks').doc(id).update({
                ignored: !task.ignored
              });
              console.log("Task ignored successfully");
              setDone(true);
              setLoading(false);
              getTasks();
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );
  }

  const completeTask = async (id) => {
    // check for completed variable value, make it reverse
    // if completed is false, make it true
    // if completed is true, make it false

    Alert.alert(
      "Complete Task",
      "Are you sure you want to complete this task?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Complete", onPress: async () => {
            try {
              setLoading(true);
              const task = tasks.find(task => task.id == id);
              await firestore().collection('tasks').doc(id).update({
                completed: !task.completed
              });
              console.log("Task completed successfully");
              setDone(true);
              setLoading(false);
              getTasks();
            } catch (e) {
              console.log(e);
            }
          }
        }
      ]
    );

  }

  const editTask = (task) => {
    console.log("Edit task:-", task);
    Alert.alert(
      "Edit Task",
      "Are you sure you want to edit this task?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        {
          text: "Edit", onPress: () => {
            navigation.navigate('EditTask', {
              id: task.id, // The unique identifier for the task
              details: {
                title: task.title, // Task title
                description: task.description, // Task description                
                initialDate: task.date, // Task date
                initialPriority: task.priority, // Task priority
              }
            });
          }
        }
      ]
    );
  }


  const sortTasks = () => {

    console.log("sorting tasks--today datetime-->" + new Date());

    // sort out today's tasks
    const todayTasksArray = [];
    const tomorrowTasksArray = [];
    const thisWeekTasksArray = [];
    const upcomingOtherTasksArray = [];
    const pastTasksArray = [];

    tasks.forEach(task => {
      const taskDate = new Date(task.date);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      // ================sortig based on different days================

      if (taskDate.toDateString() == today.toDateString()) {
        todayTasksArray.push(task);
      } else if (taskDate.toDateString() == tomorrow.toDateString()) {
        tomorrowTasksArray.push(task);
      }
      // If the date is greater than tomorrow and less than today + 7 days
      else if (taskDate > tomorrow && taskDate <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        thisWeekTasksArray.push(task);
      }
      else if (taskDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) {
        upcomingOtherTasksArray.push(task);
      } else {
        pastTasksArray.push(task);
      }

      setTodayTasks([...todayTasksArray]);
      setTomorrowTasks([...tomorrowTasksArray]);
      setThisWeekTasks([...thisWeekTasksArray])
      setUpcomingOtherTasks([...upcomingOtherTasksArray])
      setPastTasks([...pastTasksArray])

    });
    // ==================sorting based on priority================
    const presentAndFutureTasks = [...todayTasksArray, ...tomorrowTasksArray, ...thisWeekTasksArray, ...upcomingOtherTasksArray];
    console.log("presentAndFutureTasks:-", presentAndFutureTasks);


    presentAndFutureTasks.sort((a, b) => {
      // Sort by priority first
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      // If priorities are the same, sort by date
      return new Date(a.date) - new Date(b.date);
    });



    setSortedTasks([...presentAndFutureTasks]);

  }














  const getData = async () => {
    try {
      const email = await AsyncStorage.getItem('email');
      const uid = await AsyncStorage.getItem('uid');
      console.log("Home email:-", email);
      console.log("Home uid:-", uid);
      setEmail(email);
      setUid(uid);
    } catch (e) {
      // error reading value
    }
  }
  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    console.log("Tasks received:-", tasks);
  }, [tasks]);

  useEffect(() => {
    if (email != '') {
      getTasks();
    }
  }, [email]);

  useEffect(() => {
    sortTasks();

  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0) {
      console.log("today tasks:-", todayTasks);
      console.log("tomorrow tasks:-", tomorrowTasks);
      console.log("this week tasks:-", thisWeekTasks);
      console.log("upcoming other tasks:-", upcomingotherTasks);
      console.log("past tasks:-", pastTasks);
    }
  }, [todayTasks, tomorrowTasks, thisWeekTasks, upcomingotherTasks, pastTasks]);

  useEffect(() => {
    // sort the tasks based on searched data
    const searchedTasks = tasks.filter(task => task.title.toLowerCase().includes(search.toLowerCase()) || task.description.toLowerCase().includes(search.toLowerCase()));
    setSearchedTasks([...searchedTasks]);
  }
    , [search]);

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
              }
              }
            />
          </View>
          : null
      }
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.topLeft}>
            <View style={styles.searchBox}>
              <Image source={require('../../assets/search.png')} style={styles.searchIcon} />
              <TextInput style={styles.searchInput} placeholder="Search any upcoming task"
                placeholderTextColor="#555"
                value={search}
                onChange={(e) => setSearch(e.nativeEvent.text)}
              />
            </View>
          </View>
          <View style={styles.topRight}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Profile')}
            >

              <Image source={require('../../assets/profile.png')} style={styles.profileImage} />
            </TouchableOpacity>
          </View>

        </View>
        <View style={styles.headerBottom}>
          <Text style={styles.dateText}>
            Today, {
              new Date().toDateString().split(' ')[1] + ' ' + new Date().toDateString().split(' ')[2]
            }
          </Text>
          <Text style={styles.greetingText}>
            Good {
              new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'
            }, User
          </Text>
        </View>

      </View>
      <View style={styles.mainContainer}>
        <ScrollView>

          {
            sortType == 'time' && search=='' ? (
              <>
                <View View style={styles.daySection}>
                  {
                   (tasks.length - pastTasks.length ==0)? (
                    <Text style={{
                      ...styles.dayText,
                      textAlign: 'center',
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      padding: 10,
                      marginTop: 50
                    }}>No tasks found</Text>
                  ) : (
                    // <Text style={styles.dayText}>All Tasks based on Time</Text>
                    <></>
                  )

                  }
                  {(todayTasks.length> 0 && sortType=='time' && search=='')? (
                    <Text style={styles.dayText}>Today</Text>
                  ) : <Text
                    style={{
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10
                    }}
                  >
                    {/* No tasks for today */}
                  </Text>}
                  <View style={styles.dayTasks}>
                    {
                      todayTasks.map((task, index) => (
                        <TouchableOpacity key={index}
                          onPress={() => navigation.navigate('ViewTask', {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            date: task.date,
                            priority: task.priority
                          })
                          }
                        >
                          <View style={{
                            ...styles.task,
                            // check for complete and ignore then change the background color
                            backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                          }}>

                            <View style={styles.taskLeft}>
                              <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <View style={styles.priorityInnerCircle}></View>
                              </View>
                            </View>
                            <View style={styles.taskMid}>
                              <Text style={styles.taskText}>{
                                task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                              }</Text>

                              <Text style={styles.taskTime}>
                                {/* get date and time seperately from task.date */}
                                {
                                  task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                                }
                              </Text>
                              <Text style={styles.taskTime}>{
                                task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                              }</Text>

                            </View>
                            <View style={styles.taskRight}>
                              <TouchableOpacity onPress={() => completeTask(task.id)}>
                                <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                                <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => editTask({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                date: task.date,
                                priority: task.priority
                              })}>
                                <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                                <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                              </TouchableOpacity>
                            </View>

                          </View>
                        </TouchableOpacity>
                      ))
                    }

                  </View>
                  {

                    tomorrowTasks.length > 0 ? (
                      <Text style={styles.dayText}>Tomorrow</Text>
                    ) : <Text
                      style={{
                        fontSize: 20,
                        color: '#000',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        padding: 10
                      }}
                    >
                      {/* No tasks for tomorrow */}
                    </Text>
                  }
                  <View style={styles.dayTasks}>
                    {
                      tomorrowTasks.map((task, index) => (
                        <TouchableOpacity key={index}
                          onPress={() => navigation.navigate('ViewTask', {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            date: task.date,
                            priority: task.priority
                          })
                          }
                        >
                          <View style={{
                            ...styles.task,
                            // check for complete and ignore then change the background color
                            backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                          }}>

                            <View style={styles.taskLeft}>
                              <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <View style={styles.priorityInnerCircle}></View>
                              </View>
                            </View>
                            <View style={styles.taskMid}>
                              <Text style={styles.taskText}>{
                                task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                              }</Text>

                              <Text style={styles.taskTime}>
                                {/* get date and time seperately from task.date */}
                                {
                                  task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                                }
                              </Text>
                              <Text style={styles.taskTime}>{
                                task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                              }</Text>

                            </View>
                            <View style={styles.taskRight}>
                              <TouchableOpacity onPress={() => completeTask(task.id)}>
                                <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                                <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => editTask({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                date: task.date,
                                priority: task.priority
                              })}>
                                <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                                <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                              </TouchableOpacity>
                            </View>

                          </View>
                        </TouchableOpacity>
                      ))
                    }

                  </View>
                  {
                    thisWeekTasks.length > 0 ? (
                      <Text style={styles.dayText}>This Week</Text>
                    ) :
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: 10
                        }}
                      >
                        {/* No tasks for this week */}
                      </Text>
                  }
                  <View style={styles.dayTasks}>
                    {
                      thisWeekTasks.map((task, index) => (
                        <TouchableOpacity key={index}
                          onPress={() => navigation.navigate('ViewTask', {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            date: task.date,
                            priority: task.priority
                          })
                          }
                        >
                          <View style={{
                            ...styles.task,
                            // check for complete and ignore then change the background color
                            backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                          }}>

                            <View style={styles.taskLeft}>
                              <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <View style={styles.priorityInnerCircle}></View>
                              </View>
                            </View>
                            <View style={styles.taskMid}>
                              <Text style={styles.taskText}>{
                                task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                              }</Text>

                              <Text style={styles.taskTime}>
                                {/* get date and time seperately from task.date */}
                                {
                                  task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                                }
                              </Text>
                              <Text style={styles.taskTime}>{
                                task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                              }</Text>

                            </View>
                            <View style={styles.taskRight}>
                              <TouchableOpacity onPress={() => completeTask(task.id)}>
                                <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                                <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => editTask({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                date: task.date,
                                priority: task.priority
                              })}>
                                <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                                <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                              </TouchableOpacity>
                            </View>

                          </View>
                        </TouchableOpacity>
                      ))
                    }

                  </View>
                  

                  {
                    upcomingotherTasks.length > 0 ? (
                      <Text style={styles.dayText}>Upcoming</Text>
                    ) :
                      <Text
                        style={{
                          fontSize: 20,
                          color: '#000',
                          fontWeight: 'bold',
                          textAlign: 'center',
                          padding: 10
                        }}
                      >
                        {/* No upcoming tasks */}
                      </Text>

                  }
                  <View style={styles.dayTasks}>
                    {
                      upcomingotherTasks.map((task, index) => (
                        <TouchableOpacity key={index}
                          onPress={() => navigation.navigate('ViewTask', {
                            id: task.id,
                            title: task.title,
                            description: task.description,
                            date: task.date,
                            priority: task.priority
                          })
                          }
                        >
                          <View style={{
                            ...styles.task,
                            // check for complete and ignore then change the background color
                            backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                          }}>

                            <View style={styles.taskLeft}>
                              <View style={{
                                width: 30,
                                height: 30,
                                borderRadius: 50,
                                backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                                justifyContent: 'center',
                                alignItems: 'center'
                              }}>
                                <View style={styles.priorityInnerCircle}></View>
                              </View>
                            </View>
                            <View style={styles.taskMid}>
                              <Text style={styles.taskText}>{
                                task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                              }</Text>

                              <Text style={styles.taskTime}>
                                {/* get date and time seperately from task.date */}
                                {
                                  task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                                }
                              </Text>
                              <Text style={styles.taskTime}>{
                                task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                              }</Text>

                            </View>
                            <View style={styles.taskRight}>
                              <TouchableOpacity onPress={() => completeTask(task.id)}>
                                <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                                <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => editTask({
                                id: task.id,
                                title: task.title,
                                description: task.description,
                                date: task.date,
                                priority: task.priority
                              })}>
                                <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                              </TouchableOpacity>
                              <TouchableOpacity onPress={() => deleteTask(task.id)}>
                                <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                              </TouchableOpacity>
                            </View>

                          </View>
                        </TouchableOpacity>
                      ))
                    }

                  </View>
                </View>
              </>
            ) : (
              search != '' ? 
              <>
              <View View style={styles.daySection}>
              {(todayTasks.length> 0 && sortType=='time' && search=='') ? (
                    <Text style={styles.dayText}>Today</Text>
                  ) : <Text
                    style={{
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10
                    }}
                  >
                    {/* No tasks for today */}
                  </Text>}
                {
                  sortedTasks.length > 0 ? (
                    <Text style={styles.dayText}>All Tasks based on Search</Text>
                  ) : <Text
                    style={{
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10
                    }}
                  >
                    {/* No tasks found */}
                  </Text>
                }

                <View style={styles.dayTasks}>
                  {
                    searchedTasks.map((task, index) => (
                      <TouchableOpacity key={index}
                        onPress={() => navigation.navigate('ViewTask', {
                          id: task.id,
                          title: task.title,
                          description: task.description,
                          date: task.date,
                          priority: task.priority
                        })
                        }
                      >
                        <View style={{
                          ...styles.task,
                          // check for complete and ignore then change the background color
                          backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                        }}>

                          <View style={styles.taskLeft}>
                            <View style={{
                              width: 30,
                              height: 30,
                              borderRadius: 50,
                              backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              <View style={styles.priorityInnerCircle}></View>
                            </View>
                          </View>
                          <View style={styles.taskMid}>
                            <Text style={styles.taskText}>{
                              task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                            }</Text>

                            <Text style={styles.taskTime}>
                              {/* get date and time seperately from task.date */}
                              {
                                task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                              }
                            </Text>
                            <Text style={styles.taskTime}>{
                              task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                            }</Text>

                          </View>
                          <View style={styles.taskRight}>
                            <TouchableOpacity onPress={() => completeTask(task.id)}>
                              <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                              <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => editTask({
                              id: task.id,
                              title: task.title,
                              description: task.description,
                              date: task.date,
                              priority: task.priority
                            })}>
                              <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(task.id)}>
                              <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                            </TouchableOpacity>
                          </View>

                        </View>
                      </TouchableOpacity>
                    ))
                  }

                </View>
              </View></>
              :
              <View View style={styles.daySection}>
                 {
                   (tasks.length - pastTasks.length ==0)? (
                    <Text style={{
                      ...styles.dayText,
                      textAlign: 'center',
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      padding: 10,
                      marginTop: 50
                    }}>No tasks found</Text>
                  ) : (
                    // <Text style={styles.dayText}>All Tasks based on Time</Text>
                    <></>
                  )
                  }
                {
                  sortedTasks.length > 0 ? (
                    <Text style={styles.dayText}>All Tasks based on Priority</Text>
                  ) : <Text
                    style={{
                      fontSize: 20,
                      color: '#000',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      padding: 10
                    }}
                  >
                    {/* No tasks found */}
                  </Text>
                }

                <View style={styles.dayTasks}>
                  {
                    sortedTasks.map((task, index) => (
                      <TouchableOpacity key={index}
                        onPress={() => navigation.navigate('ViewTask', {
                          id: task.id,
                          title: task.title,
                          description: task.description,
                          date: task.date,
                          priority: task.priority
                        })
                        }
                      >
                        <View style={{
                          ...styles.task,
                          // check for complete and ignore then change the background color
                          backgroundColor: task.completed ? completedcolor : task.ignored ? ignoredcolor : '#fff'
                        }}>

                          <View style={styles.taskLeft}>
                            <View style={{
                              width: 30,
                              height: 30,
                              borderRadius: 50,
                              backgroundColor: task.priority == 1 ? '#f00' : task.priority == 2 ? '#fb0' : '#0f0',
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                              <View style={styles.priorityInnerCircle}></View>
                            </View>
                          </View>
                          <View style={styles.taskMid}>
                            <Text style={styles.taskText}>{
                              task.title.length > 30 ? task.description.slice(0, 20) + '...' : task.title
                            }</Text>

                            <Text style={styles.taskTime}>
                              {/* get date and time seperately from task.date */}
                              {
                                task.date.split(' ')[0] + ' ' + task.date.split(' ')[1] + ' ' + task.date.split(' ')[2] + ' | ' + task.date.split(' ')[4]
                              }
                            </Text>
                            <Text style={styles.taskTime}>{
                              task.description.length > 30 ? task.description.slice(0, 25) + '...' : task.description
                            }</Text>

                          </View>
                          <View style={styles.taskRight}>
                            <TouchableOpacity onPress={() => completeTask(task.id)}>
                              <Image source={require('../../assets/completed.png')} style={styles.completedImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => ignoreTask(task.id)}>
                              <Image source={require('../../assets/ignore.png')} style={styles.ignoreImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => editTask({
                              id: task.id,
                              title: task.title,
                              description: task.description,
                              date: task.date,
                              priority: task.priority
                            })}>
                              <Image source={require('../../assets/edit.png')} style={styles.editImage} />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteTask(task.id)}>
                              <Image source={require('../../assets/delete.png')} style={styles.deleteImage} />
                            </TouchableOpacity>
                          </View>

                        </View>
                      </TouchableOpacity>
                    ))
                  }

                </View>
              </View>


            )
          }



        </ScrollView>
      </View >



      <View View style={styles.footer} >
        <View style={styles.left}>
          <TouchableOpacity
            onPress={() => setSortType('time')}
          >
            <Image source={require('../../assets/calendersort.png')} style={styles.leftImage} />
            {/* <Text>Sort by Time</Text> */}
          </TouchableOpacity>
        </View>
        <View style={styles.center}>
          <TouchableOpacity style={{
            backgroundColor: '#686af7',
            padding: 10,
            borderRadius: 50,
            position: 'absolute',
            top: -30,
          }}
            onPress={() => navigation.navigate('CreateTask')}
          >
            <Image source={require('../../assets/create.png')} style={styles.centerImage} />
            {/* <Text>Add New</Text> */}
          </TouchableOpacity>
        </View>
        <View style={styles.right}>
          <TouchableOpacity
            onPress={() => setSortType('priority')}
          >
            <Image source={require('../../assets/prioritysort.png')} style={styles.rightImage} />
            {/* <Text>Sort by Priority</Text> */}
          </TouchableOpacity>
        </View>
      </View>
    </View >
  )
}

export default Home

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#eee'
  },



  header: {
    width: '100%',
    height: 'auto',
    backgroundColor: '#686af7',

  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    // backgroundColor: '#f00'
  },
  topLeft: {
    flex: 4,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f0f',
  },
  topRight: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f00',
  },
  searchBox: {
    width: '100%',
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 50,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10
  },
  searchIcon: {
    width: 25,
    height: 25,
    marginRight: 10
  },
  searchInput: {
    width: '100%',
    height: '100%',
    color: '#000',
    fontSize: 16,
    color: '#000'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 50
  },
  headerBottom: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    // backgroundColor: '#000',
  },
  dateText: {
    color: '#fff',
    fontSize: 15
  },
  greetingText: {
    color: '#fff',
    fontSize: 21
  },







  mainContainer: {
    flex: 1,
  },
  daySection: {
    width: '100%',
    padding: 10,
    // backgroundColor: '#f00'
  },
  dayText: {
    fontSize: 17,
    color: '#222',
    fontWeight: 'bold'
  },
  dayTasks: {
    width: '100%',
    marginTop: 10,
    // backgroundColor: '#f0f'
  },
  task: {
    width: '100%',
    height: 80,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  taskLeft: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f00'
  },
  // priorityCircle: {
  // },
  priorityInnerCircle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: '#fff'
  },
  taskMid: {
    flex: 4,
    // backgroundColor: '#f0f',
    padding: 10
  },
  taskText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  taskTime: {
    color: '#555',
    fontSize: 14
  },
  taskRight: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,


    // backgroundColor: '#f00'
  },
  editImage: {
    width: 27,
    height: 27,
    marginBottom: 10
  },
  deleteImage: {
    width: 28,
    height: 28
  },
  completedImage: {
    width: 27,
    height: 27,
    marginBottom: 5
  },
  ignoreImage: {
    width: 27,
    height: 27,
    marginBottom: 2
  },









  footer: {
    width: '100%',
    height: 70,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',

  },
  left: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  leftImage: {
    width: 45,
    height: 35,
  },
  centerImage: {
    width: 50,
    height: 50
  },
  rightImage: {
    width: 30,
    height: 30
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