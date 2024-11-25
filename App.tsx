import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text, StyleSheet, View, ScrollView, TouchableOpacity} from 'react-native';
import Tabs from './navigation/tabs';
import { connectToDatabase, createTables } from './db/database';
import { start } from 'repl';
import Toast from 'react-native-toast-message';
import { ToastAndroid } from 'react-native';

const App = () => {

 //function App(): React.JSX.Element {

 //Connect to database when APP mounts
 //Placed here as has to be started from top level
 useEffect(() => {
    const startDatabase = async () => {
      try {
        //Connect to database
        const db = await connectToDatabase();
        console.log('Database connected successfully');
        await createTables(db);
        console.log('Tables created successfully');
      } catch (error) {
        console.error('Failed to connect to database: ', error);
      }
    };
  
  startDatabase();
}, []);

  return (
    
    <NavigationContainer>
      <Tabs />
      <Toast/>
    </NavigationContainer>
    
  );

  }

export default App;
