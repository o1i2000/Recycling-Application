import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';

import {
    enablePromise,
    openDatabase,
} from "react-native-sqlite-storage"

enablePromise(true)

export const connectToDatabase = async () => {
    return openDatabase(
        { name: "recyclingDatabase.db", location: "default"},
        () => {},
        (error) => {
            console.error(error)
            throw Error("Could not connect to database")
        }
    )
}

export const createTables = async (db: SQLiteDatabase) => {
    const foodDonationQuery = `
            CREATE TABLE IF NOT EXISTS FoodDonation (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                category TEXT NOT NULL,
                location TEXT NOT NULL,
                description TEXT,
                useBy TEXT,
                quantity TEXT
            )
        `
        console.log("Executing table creation query:", foodDonationQuery);


        // olis code --------------------------------------------------------------- { 
        // creation of scores table and app settings and insertion of sample data 
        // added filter function to show when the score has been updated by dateAdded
        const ScoresQuery =
        `
            CREATE TABLE IF NOT EXISTS Scores (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                score INTEGER,
                dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
                isSelected INTEGER DEFAULT 0
            )
        `

        // app settings used to show who is currently selected by the drop down on the qr scan page
        const appSettingsQuery = 
        `
        CREATE TABLE IF NOT EXISTS AppSettings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            currentSelectedUserId INTEGER
        )
        `

        console.log("Executing table creation query:", appSettingsQuery);
        
        const query = `SELECT id, username, score, dateAdded FROM Scores;`;
        db.transaction(tx => {
            tx.executeSql(query, [], (tx, results) => {
                for (let i = 0; i < results.rows.length; i++) {
                    let row = results.rows.item(i);
                    console.log(`User ID: ${row.id}, Username: ${row.username}, Score: ${row.score}, Date Added: ${row.dateAdded}`);
                }
            });
        });
    
        await logAllUsersWithScores(db);
        

        console.log("Executing table creation query:", ScoresQuery);
       
         const insetScores = 
         `
                 INSERT INTO Scores (username,score,dateAdded) VALUES
                     ('mike', 800, '2023-06-02 06:55:36'),
                     ('john', 800, '2023-10-15 06:10:25'),
                     ('becky', 400, '2022-02-08 10:33:04'),
                     ('jeffrey', 800, '2022-06-15 23:37:58'),
                     ('pamela', 300, '2023-09-25 07:25:24'),
                     ('wyatt', 200, '2022-01-10 19:04:42'),
                     ('alexander', 1000, '2023-05-29 19:42:05'),
                     ('steven', 100, '2023-04-04 11:25:14'),
                     ('marc', 600, '2023-12-10 02:00:06'),
                     ('daniel', 700, '2022-05-08 13:45:43'),
                     ('antonio', 1000, '2022-04-16 03:13:15'),
                     ('amanda', 600, '2022-04-28 01:23:57'),
                     ('alexander', 800, '2023-11-21 03:53:28'),
                     ('sarah', 300, '2022-12-14 06:29:24'),
                     ('danielle', 400, '2022-09-24 21:36:46'),
                     ('robert', 700, '2023-06-18 02:05:45'),
                     ('gregory', 300, '2023-06-12 22:16:21'),
                     ('kimberly', 100, '2022-03-24 16:28:00'),
                     ('taylor', 100, '2022-12-17 21:15:57'),
                     ('sydney', 200, '2023-03-29 18:35:58');

          `

<<<<<<< HEAD
        // ------------------------------------------------------------- } 
=======
>>>>>>> 6904a557a19db110708fa87d6d27e8e3b9a1842b


        //Further tables can be added here-----
        try {           
            await db.executeSql(foodDonationQuery)
            console.log("food dontation table created successfully");
        } catch (error) {
            console.error('Table creation failed ',error)
            throw Error('Failed to create table')
        }  

        try {           
            await db.executeSql(ScoresQuery)
            console.log("scores table created successfully");
        } catch (error) {
            console.error('Table creation failed ',error)
            throw Error('Failed to create table')
        }


        // oli code --------------------------------------------- { 
        try {           
            await db.executeSql(appSettingsQuery)
            console.log("appsettings created successfully");
        } catch (error) {
            console.error('Table creation failed ',error)
            throw Error('Failed to create table')
        } 
        
<<<<<<< HEAD
        try {           
            await db.executeSql(insetScores)
            console.log("appsettings created successfully");
        } catch (error) {
            console.error('Table creation failed ',error)
            throw Error('Failed to create table')
        } 

        // ------------------------------------------------------ } 
}


export const removeTable = async (db: SQLiteDatabase, tableName: Table) => {
    const query = `DROP TABLE IF EXISTS ${tableName}`
    try {
        await db.executeSql(query)
    } catch (error) {
        console.error(error)
        throw Error(`Failed to drop table ${tableName}`)
    }
=======
         try {           
             await db.executeSql(insetScores)
             console.log("appsettings created successfully");
         } catch (error) {
             console.error('Table creation failed ',error)
             throw Error('Failed to create table')
         } 
>>>>>>> 6904a557a19db110708fa87d6d27e8e3b9a1842b
}


export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
    try {
        const tableNames: string[] = []
        const results = await db.executeSql(
            "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
        )
        results?.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                tableNames.push(result.rows.item(index).name)
            }
        })
        return tableNames
    } catch (error) {
        console.error(error)
        throw Error("Failed to get table names from database")
    }
}


// Oliver code -------------------------------------------------------- { 

export const dropScoresTable = async (db: SQLiteDatabase) => {
    const dropTableQuery = `DROP TABLE IF EXISTS Scores;`;
    return new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(dropTableQuery, [], () => {
                console.log('Scores table dropped successfully');
                resolve(true);
            }, (error) => {
                console.error('Failed to drop Scores table', error);
                reject(error);
            });
        });
    });
};

export const deleteAllScores = async (db: SQLiteDatabase): Promise<void> => {
    try {
        await db.executeSql('DELETE FROM Scores');
        console.log('All scores have been deleted successfully.');
        await db.executeSql("DELETE FROM sqlite_sequence WHERE name='Scores'");
        console.log('Auto-increment counter for Scores has been reset.');
    } catch (error) {
        console.error('Failed to delete scores: ', error);
    }
};


export const updateCurrentSelectedUser = async (db: SQLiteDatabase, userId: number) => {
    console.log("entering updatecurrentselecteduser", userId);
    
    const checkExistsQuery = `SELECT id FROM AppSettings LIMIT 1;`;
    const result = await db.executeSql(checkExistsQuery);

    let query;
    if (result[0].rows.length > 0) {
        // If a row exists, update it.
        query = `UPDATE AppSettings SET currentSelectedUserId = ? WHERE id = ?;`;
        await db.executeSql(query, [userId, result[0].rows.item(0).id]);
    } else {
        // If no row exists, insert a new one.
        query = `INSERT INTO AppSettings (currentSelectedUserId) VALUES (?);`;
        await db.executeSql(query, [userId]);
    }
    console.log("exiting updatecurrentselecteduser", userId);
};


export const getCurrentSelectedUserId = async (db: SQLiteDatabase): Promise<number | null> => {
    const query = `SELECT currentSelectedUserId FROM AppSettings LIMIT 1;`;
    try {
        const results = await db.executeSql(query);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0).currentSelectedUserId;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch currentSelectedUserId: ', error);
        return null;
    }
};

export const getUsernameById = async (db: SQLiteDatabase, userId: number): Promise<string | null> => {
    const query = `SELECT username FROM Scores WHERE id = ? LIMIT 1;`;
    try {
        console.log("Fetching username for user ID:", userId);
        const results = await db.executeSql(query, [userId]);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0).username;
        }
        return null;
    } catch (error) {
        console.error('Failed to fetch username by ID:', error);
        return null;
    }
};

export const logAllUsersWithScores = async (db: SQLiteDatabase) => {
    const query = `SELECT id, username, score FROM Scores;`;
    try {
        const results = await db.executeSql(query);
        if (results[0].rows.length > 0) {
            for (let i = 0; i < results[0].rows.length; i++) {
                const user = results[0].rows.item(i);
                console.log(`User ID: ${user.id}, Username: ${user.username}, Score: ${user.score}`);
            }
        } else {
            console.log("No users found.");
        }
    } catch (error) {
        console.error('Failed to fetch users and their scores:', error);
    }
};

export const getUserIdByUsername = async (db: SQLiteDatabase, username: string): Promise<number | null> => {
    try {
        const query = `SELECT id FROM Scores WHERE username = ?`;
        const results = await db.executeSql(query, [username]);
        if (results[0].rows.length > 0) {
            return results[0].rows.item(0).id;
        } else {
            console.log(`No ID found for username: ${username}`);
            return null;
        }
    } catch (error) {
        console.error(`Failed to get user ID by username: ${username}`, error);
        return null;
    }
};



// ---------------------------------------------------------------- } 
