// Oliver Dickinson  - w20013992


// this code is a form to insert user in app instead of adding them 
// to the database by code
// removed for the final version of the application as did not want functionality to add new users 
// in a future version of the app something similar would be done on a account creation 
// screen which would be linked to the log in screen and the currently selected user 




import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { addScore } from '../db/fetchUserScores';
import { connectToDatabase } from '../db/database';


const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom:10,
        paddingHorizontal: 10,
    },
});




const FormInsertScores = () => {
    const [username, setUsername] = useState('');
    const [score,setScore] = useState('');

    const handleSubmit = async () => {
        const db = await connectToDatabase();

        const item = {
            username,
            score: parseInt(score), 
            
        };

        try {
            //await addScore(db, item);    commented out because newer code makes this no longer work
            console.log('Data inserted successfully');
            //Clear the form fields
            setUsername('');
            setScore('');
        } catch (error) {
            console.log('Failed to to insert data', error);
        }
     
    }
                    

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="User Name"
                value={username}
                onChangeText={setUsername}
            />
            
            <TextInput
                style={styles.input}
                placeholder="Score"
                value={score}
                onChangeText={setScore}
                keyboardType='numeric'
            />
            <Button title='Submit' onPress={handleSubmit} />
        </View>
    );
};

export default FormInsertScores;