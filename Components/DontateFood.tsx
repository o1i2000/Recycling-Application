/*
Author: Chris Corner
StudentID: w21022098

DonateFood page component. Displays results from foodDonation database
Allows users to upload items using FormDonateFood component
Also allows users to 'claim' item 
*/

import { useState, useEffect } from 'react';
import { ScrollView, Text, StyleSheet, View, Button, TextInput, Modal} from 'react-native';
import FormDonateFood from './FormDonateFood';
import { connectToDatabase } from '../db/database';
import { getItems, deleteItem } from '../db/foodDonation';


const styles = StyleSheet.create({
    footerButtonStyle: {
        flexDirection: 'column',
        flex: 1,
        backgroundColor: 'limegreen',
        alignItems: 'center',
    },
    itemContainer: {
        borderWidth: 1,
        borderColor: 'blue',
        padding: 10,
        margin: 10,
        fontSize: 20,
        fontWeight: '300',
        borderRadius: 10,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 5,
    },
    deleteButton: {
        marginTop:10,
    },
    search: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom:10,
        marginHorizontal: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
    },
    titleText: {
        color: 'black',
        fontSize: 35,
        fontWeight: '400',
        paddingLeft: 10,
    },
    headingText: {
        color: 'black',
        fontSize: 20,
        fontWeight: '300',
        paddingLeft: 10,
    },
    buttonStyle: {
        padding: 5,
    },
    modalSyleClaim: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: '75%',
    },
})

const DonateFood = () => {

    const [items, setItems] = useState<Item[]>([]);
    const [users,setUsers] = useState<User[]>([]);
    const [uploadForm, setUploadForm] = useState(false);
    const [searchItem, setSearchItem] = useState('');
    const [claimModal, setClaimModal] = useState(false);

    //Fetch items from FoodDonation db to be displayed on page
        const fetchItems = async () => {
            try {
                const db = await connectToDatabase();
                const fetchedItems = await getItems(db);
                setItems(fetchedItems);
            } catch (error) {
                console.error('Failed to fetch food DB items: ', error);
            }
        };
        //Use effect called here so fetch items reloads when item added
        // or item is searched
        useEffect(() => {
        fetchItems();
    }, []);

    //Delete item from the donate food page
    //Links to claim item button
    const deleteItemButton = async (item:Item) => {
        try {
            const db = await connectToDatabase();
            await deleteItem(db, item);
            fetchItems(); //reload items after deletion
            setClaimModal(true); //popup for claiming an item
        } catch (error) {
            console.error('failed to delete item:', error);
        }
    }

    //Search for item by name search bar
    const filterItems = items.filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()))

    return (
        <View>

            {/*Button to display FormDonateFood */}
            <Text style={styles.titleText}>Donate Food Page</Text>
            <Button title={uploadForm ? "Hide Form" : "Upload An Item"} onPress={() => setUploadForm(!uploadForm)} />
        <ScrollView>
            {uploadForm && <FormDonateFood fetchItems={fetchItems} />}
        </ScrollView>
           
            <Text style={styles.headingText}>Available Items</Text>

            {/*Search bar to uploaded items*/}
            <TextInput
                style={styles.search}
                placeholder='Search for an item'
                value={searchItem}
                onChangeText={setSearchItem}
            />
        <ScrollView>

            {/*Display available items in container on page
                filter with search bar*/}
            {filterItems.map((item, index) => (
                <View key={index} style={styles.itemContainer}>
                    <Text>Name: {item.name}</Text>
                    <Text>Category: {item.category}</Text>
                    <Text>Location: {item.location}</Text>
                    <Text>Description: {item.description}</Text>
                    <Text>Use by: {item.useBy}</Text>
                    <Text>Quantity: {item.quantity}</Text>
                    <View style={styles.deleteButton}>
                        {/*Claim item button, calls deleteItem from db*/}
                        <Button 
                            title="Claim Item"
                            onPress={() => deleteItemButton(item)}
                        />
                    </View>
                </View>
            ))}
        </ScrollView>
                
                {/*Popup for when item has been claimed*/}
                <Modal
                    animationType='slide'
                    transparent={true}
                    visible={claimModal}
                    onRequestClose={() => setClaimModal(false)}
                >
                    <View style={styles.modalSyleClaim}>
                        <Text>Item claimed</Text>
                        <Button title='OK' onPress={() => setClaimModal(false)} />
                    </View>
                </Modal>
        </View>

    )
}

export default DonateFood;