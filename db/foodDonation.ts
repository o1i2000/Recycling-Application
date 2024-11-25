import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { connectToDatabase } from './database';


//Function to add items to the Food donation database
// accepts db paramater of type SQLiteDatabase library
// and item object type declared in typing.js
export const addItem = async (db: SQLiteDatabase, item: Item) => {
    const insertQuery = `
    INSERT INTO FoodDonation (name, category, location, description, useBy, quantity) 
    VALUES (?, ?, ?, ?, ?, ?)
    `
    const values = [
        item.name,
        item.category,
        item.location,
        item.description,
        item.useBy,
        item.quantity,
    ]
    try {
        return db.executeSql(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to add item")
    }
}



//Function to retrieve items from database
//Promise allows to wait for retrieving items from database
//Then pushes into item array
export const getItems = async (db: SQLiteDatabase): Promise<Item[]> => {
    try {
        const item: Item[] = []
        const results = await db.executeSql("SELECT * from FoodDonation")
        results?.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                item.push(result.rows.item(index))
            }
        })
        return item
    } catch (error) {
        console.error(error)
        throw Error("Failed to get items from database")
    }
}

//Fucntion to delete item from database
//To be used in conjunction with claiming an item
export const deleteItem = async (db: SQLiteDatabase, item: Item) => {
    const deleteQuery = `
    DELETE FROM FoodDonation
    WHERE id = ?
    `
    const values = [item.id]
    try {
        return db.executeSql(deleteQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to remove item")
    }
}
