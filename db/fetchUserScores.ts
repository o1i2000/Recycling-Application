import SQLite, { SQLiteDatabase } from 'react-native-sqlite-storage';
import { connectToDatabase } from './database';

//may need to add in date added using this 

export const addScore = async (db: SQLiteDatabase, profile: User) => {
    const insertQuery = `
    INSERT INTO Scores (username, score, dateAdded) 
    VALUES (?, ?, datetime('now'))
    `
    const values = [
        profile.username,
        profile.score
    ]
    try {
        return db.executeSql(insertQuery, values)
    } catch (error) {
        console.error(error)
        throw Error("Failed to add score")
    }
}

//function to get the users name n score from db
export const getUserscore = async (db: SQLiteDatabase): Promise<User[]> => {
    try {
        const user: User[] = []
        const results = await db.executeSql("SELECT * from scores")
        results?.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                user.push(result.rows.item(index))
            }
        })
        return user
    } catch (error) {
        console.error(error)
        throw Error("Failed to get items from database")
    }
}

//function to increase score when button is pressed (should be changed to when item is scanned after)
export const updateUserScoreById = async (db: SQLiteDatabase, userId: number, pointsToAdd: number) => {
    try {
        // Fetch the current score using the user ID
        let currentScoreQuery = `SELECT score FROM Scores WHERE id = ?`;
        let results = await db.executeSql(currentScoreQuery, [userId]);
        let currentScore = results[0].rows.length > 0 ? results[0].rows.item(0).score : 0;
        
        // Calculate the new score
        let newScore = currentScore + pointsToAdd;
        
        // Update the score and the dateAdded using the user ID
        let updateScoreQuery = `UPDATE Scores SET score = ?, dateAdded = CURRENT_TIMESTAMP WHERE id = ?`;
        await db.executeSql(updateScoreQuery, [newScore, userId]);
        
        console.log(`Score updated for user ID ${userId}: ${newScore}`);
    } catch (error) {
        console.error(`Failed to update user score by ID: `, error);
        throw new Error("Failed to update user score by ID.");
    }
};



//function to get the scores that have been added in the last day 
export const getScoresLastDay = async (db: SQLiteDatabase): Promise<User[]> => {
    try {
        const query = `
          SELECT username, SUM(score) AS totalScore
          FROM Scores
          WHERE dateAdded >= datetime('now', '-1 day')
          GROUP BY username;
        `;
        const results = await db.executeSql(query);
        const scores = [];
        for (let i = 0; i < results[0].rows.length; i++) {
            scores.push(results[0].rows.item(i));
        }
        return scores;
    } catch (error) {
        console.error('Failed to fetch scores from the last day: ', error);
        return [];
    }
};



export const getAllUsers = async (db: SQLiteDatabase): Promise<User[]> => {
    try {
        const users: User[] = [];
        const results = await db.executeSql("SELECT id, username FROM Scores");
        results.forEach((result) => {
            for (let index = 0; index < result.rows.length; index++) {
                users.push(result.rows.item(index));
            }
        });
        return users;
    } catch (error) {
        console.error('Failed to fetch users: ', error);
        return [];
    }
};