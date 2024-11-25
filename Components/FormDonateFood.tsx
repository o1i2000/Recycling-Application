/*
Author: Chris Corner
StudentID: w21022098

FormDonateFood component. Renders a form for users to donate food 
Connects to foodDonate database, allowing users to enter an item details
Form is displayed in DonateFood screen
*/

import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { addItem } from '../db/foodDonation';
import { connectToDatabase } from '../db/database';
import DatePicker from 'react-native-date-picker';
import CheckBox from '@react-native-community/checkbox';

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
    inputText: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headingText: {
        color: 'black',
        fontSize: 16,
        fontWeight: '400',
        paddingLeft: 2,
        marginBottom: 5,
    },
    label: {
        marginBottom: 5,
        color: 'red',
        fontStyle: 'italic',
    },
    modalIncorrect: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius:10,
        alignItems: 'center',
        marginTop: '75%',
    },
    buttonContainer: {
        margin: 10,
        marginBottom: 20,
    },
    dateButton: {
        flex: 1,
        marginRight: 5,
    },
    dateText: {
      flex: 1,
      marginLeft: 5,
    },
    rowDate: {
        flexDirection: 'row',
    },
    picker: {
        height: 40,
        width: '100%',
    },
    checkBoxStyle: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

//Define type of prop to fetchItems
interface FormDonateFoodProps {
    fetchItems: () => void;
}

const FormDonateFood: React.FC<FormDonateFoodProps> = ({fetchItems}) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [location, setLocation] = useState('');
    const [description, setDescription] = useState('');
    const [useBy, setUseBy] = useState('');
    const [quantity, setQuantity] = useState('');
    const [date, setDate] = useState(new Date());
    const [openDate, setOpenDate] = useState(false);
    const [kgCheck, setKgCheck] = useState(false);
    const [gramsCheck, setGramsCheck] = useState(false);
    const [mlCheck, setMlCheck] = useState(false);
    const [amountCheck, setAmountCheck] = useState(false);

    //Modal popup incorrect item
    const [incorrectField, setIncorrectField] = useState(false);

    //to pass to check box for kg measurement
    const kgHandle = () => {
        setKgCheck(true);
        setGramsCheck(false);
        setMlCheck(false);
        setAmountCheck(false);
    }
    //to pass to check box for grams measurement
    const gramsHandle = () => {
        setGramsCheck(true);
        setKgCheck(false);
        setMlCheck(false);
        setAmountCheck(false);
    }
    //to pass to check box for ml measurement
    const mlHandle = () => {
        setMlCheck(true);
        setKgCheck(false);
        setGramsCheck(false);
        setAmountCheck(false);
    }
    //to pass to check box for amount 
    const amountHandle = () => {
        setAmountCheck(true);
        setKgCheck(false);
        setGramsCheck(false);
        setMlCheck(false);
    }

    const handleSubmit = async () => {

        //Check for empty required fields on form
        if (!name || !category || !location || !quantity) {
            setIncorrectField(true); //Call popup for incorrect field entered
            return; //Exit function if required fields are empty
        }
        const db = await connectToDatabase();

        let quantityValue = quantity;
        //concatenate quantity value with kg
        if (kgCheck) {
            quantityValue += " kg";
        }
        //concatenate quantity value with grams
        if (gramsCheck) {
            quantityValue += " g";
        }
        //concatenate quantity value with ml
        if (mlCheck) {
            quantityValue += " ml";
        }
        //concatenate quantity value with amount
        if (amountCheck) {
            quantityValue += " ";
        }

        //defining item structure
        const item = {
            id: null,
            name, 
            category,
            location,
            description,
            useBy, //convert to string in machine readable format
            quantity: quantityValue,
        };

        try {
            // insert data into database
            await addItem(db, item);
            console.log('Data inserted successfully');
            //Clear the form fields
            setName('');
            setCategory('');
            setLocation('');
            setDescription('');
            setUseBy('');
            setQuantity('');
            //Call fetch items to update screen 
            //With latest items
            fetchItems();
        } catch (error) {
            console.log('Failed to to insert data', error);
        }
        
    }
                    
    return (
        <View style={styles.container}>

            {/*Field for item name to be entered*/}
            <View style={styles.inputText}>
                <Text style={styles.headingText}>Name </Text>
                <Text style={styles.label}>required *</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Enter Name"
                value={name}
                onChangeText={setName}
            />

            {/*Drop down picker for category*/}
            <View style={styles.inputText}>
                <Text style={styles.headingText}>Category </Text>
                <Text style={styles.label}>required *</Text>
            </View>
            <View style={styles.input}>
                <Picker
                    style={styles.picker}
                    selectedValue={category}
                    onValueChange={(itemValue: string) => setCategory(itemValue)}
                >
                    <Picker.Item label="--Select Category--" value="" />
                    <Picker.Item label="Fruit" value="Fruit" />
                    <Picker.Item label="Vegetables" value="Vegetables" />
                    <Picker.Item label="Meat and Poultry" value="Meat and Poultry" />
                    <Picker.Item label="Grains or Cereals" value="Grains or Cereals" />
                    <Picker.Item label="Snacks" value="Snacks" />
                    <Picker.Item label="Soft Drinks" value="Soft Drinks" />
                    <Picker.Item label="Other" value="Other" />
                </Picker>
            </View>

            {/*Drop down picker for location*/}
            <View style={styles.inputText}>
                <Text style={styles.headingText}>Location </Text>  
                <Text style={styles.label}>required *</Text>
            </View>
            <View style={styles.input}>
                <Picker
                    style={styles.picker}
                    selectedValue={location}
                    onValueChange={(itemValue: string) => setLocation(itemValue)}
                >
                    <Picker.Item label="--Select Location--" value="" />
                    <Picker.Item label="City Campus East" value="City Campus East" />
                    <Picker.Item label="Northumbria Student Union" value="Northumbria Student Union" />
                    <Picker.Item label="Stephenson Accomodation" value="Stephenson Accomodation" />
                </Picker>
            </View>

            {/*Descrition text field*/}  
            <Text style={styles.headingText}>Description</Text>
            <TextInput
                style={styles.input}
                placeholder="Description optional"
                value={description}
                onChangeText={setDescription}
            />

            {/*Use by date picker as optional field*/}
            <Text style={styles.headingText}>Use By Date </Text>
            <View style={styles.rowDate}>
                <View style={styles.dateText}>
                    <View style={styles.input}>
                        <Text>{useBy}</Text>
                    </View>
                </View>
                <View style={styles.dateButton}> 
                    <Button title="Select Date" onPress={() => setOpenDate(true)} />
                </View>   
                <DatePicker
                    modal
                    mode="date"
                    open={openDate}
                    date={date}
                    onConfirm={(selectedDate) => {
                        setOpenDate(false)
                        setUseBy(selectedDate.toDateString());
                    }}
                    onCancel={() => {
                        setOpenDate(false)
                    }}
                />
                </View>
            
            {/*Quantity field set to numerical value*/}
            <View style={styles.inputText}>
                <Text style={styles.headingText}>Quantity </Text>
                <Text style={styles.label}>required *</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Quantity"
                value={quantity}
                onChangeText={setQuantity}
                keyboardType='numeric'
            />

            {/*Checkboxes for the quantity parameters*/}
            <View style={styles.checkBoxStyle}>
                <View style={styles.checkBoxStyle}>
                    <CheckBox   
                        value={kgCheck}
                        onValueChange={kgHandle}
                        />
                        <Text>kg</Text>
                </View>
                <View style={styles.checkBoxStyle}>
                    <CheckBox
                    value={gramsCheck}
                    onValueChange={gramsHandle}
                    />
                    <Text>grams</Text>
                </View>
                <View style={styles.checkBoxStyle}>
                    <CheckBox
                        value={mlCheck}
                        onValueChange={mlHandle}
                    />
                    <Text>ml</Text>
                </View>
                <View style={styles.checkBoxStyle}>
                    <CheckBox
                        value={amountCheck}
                        onValueChange={amountHandle}
                    />
                    <Text>Amount</Text>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <Button title='Share Item' onPress={handleSubmit} />
            </View>
            
            {/*Popup modal if required field is not entered */}
            <Modal
                animationType='slide'
                transparent={true}
                visible={incorrectField}
                onRequestClose={() => setIncorrectField(false)}
            >
                <View style={styles.modalIncorrect}>
                    <Text>Please fill in required fields</Text>
                    <Button title='OK' onPress={() => setIncorrectField(false)} />
                </View>
            </Modal>
        </View>
    );
};

export default FormDonateFood;