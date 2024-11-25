import {Text, StyleSheet, View, Button, TextInput, ScrollView} from 'react-native';
import React, { useState } from 'react';
import {generateResponse} from '../ChatGPTService';

const styles = StyleSheet.create({
    footerButtonStyle: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'limegreen',
        alignItems: 'center',
    },

    chatStyle: {
        flexDirection: 'column',
        flexGrow: 1,
        marginBottom: 0,
    },

    Text:{
        fontSize: 20,
        color: 'black'
    },

    Header:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'black'
    }
})

const ChatGpt = () => {

    const[messages, setMessages] = useState<string[]>([]);
    const[userInput, setUserInput] = useState('');

    const sendMessage = async () => {
        if (!userInput) return;

        setMessages(prevMessages => [...prevMessages, `User: ${userInput}`]);
        const botResponse = await generateResponse(userInput);
        setMessages(prevMessages => [...prevMessages, `ChatGPT: ${botResponse}`]);
        setUserInput('');
    }

    return(
        <View style={styles.chatStyle}>
            <ScrollView>
            <Text style={styles.Header}>AI Chatbot</Text>
                {messages.map((msg, index) => (
                    <Text 
                    key={index}
                    style={styles.Text}>
                        {msg}
                    </Text>
                ))}
            </ScrollView>
            <View>
                <TextInput
                    value={userInput} 
                    onChangeText={setUserInput}
                    placeholder="Type a message"
                />
                <Button title="send" onPress={sendMessage} />
            </View>
        </View>
    );
}

export default ChatGpt;