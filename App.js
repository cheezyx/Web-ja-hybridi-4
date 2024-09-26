import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, FlatList, Button, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [tasks, setTasks] = useState([]); 
  const [input, setInput] = useState('');

  
  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem('tasks');
        if (storedTasks) setTasks(JSON.parse(storedTasks));
      } catch (error) {
        console.error('Error loading tasks', error);
      }
    };
    loadTasks();
  }, []);

  
  useEffect(() => {
    const saveTasks = async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(tasks));
      } catch (error) {
        console.error('Error saving tasks', error);
      }
    };
    saveTasks();
  }, [tasks]);

  
  const addTask = () => {
    if (input.trim()) {
      const newTask = { id: Date.now().toString(), text: input, done: false };
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setInput(''); 
    }
  };

  
  const toggleTask = (id) => {
    setTasks((prevTasks) =>
      prevTasks.map(task => (task.id === id ? { ...task, done: !task.done } : task))
    );
  };

  
  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => toggleTask(item.id)}>
      <Text style={[styles.taskText, item.done && styles.taskDone]}>{item.text}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Todo List</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter task"
        value={input}
        onChangeText={setInput}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.id}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 4,
  },
  taskText: {
    fontSize: 18,
    paddingVertical: 10,
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#aaa',
  },
});
