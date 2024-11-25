/*
Author: Oliver Dickinson
StudentID: w20013992

Leaderboard Screen will render data from the database about the users and their 
score. it will display this in a table 
users have the ability to pick what user they are "signed in as" (no login screen, so done via
drop down on the leaderboard screen) and then when they scan a product they will see a notification and 
the score will be added to their profile score.

added functinality to see who has been actively adding scores to their profile recently with
time filtering


for any code on other screen i have written I have commented my name at the top and then shown it in brackets

eg. 

 // olivers code ------------------- { 

                 *CODE*

 ----------------------------------- }

*/

import React, {useState, useEffect, useCallback} from 'react';
import {Text, StyleSheet, View, Button, ScrollView} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {DataTable} from 'react-native-paper';
import {
  getUserscore,
  getAllUsers,
  updateUserScoreById,
} from '../db/fetchUserScores';
import {
  updateCurrentSelectedUser,
  getUserIdByUsername,
  deleteAllScores,
  connectToDatabase,
  createTables,
  getTableNames,
  removeTable,
  getCurrentSelectedUserId,
} from '../db/database';
import {useFocusEffect} from '@react-navigation/native';
import {close} from 'fs';

const LeaderBoardScreen = (prop: any) => {
  const [items, setItems] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | undefined>(
    undefined,
  );
  const [filter, setFilter] = useState('all');
  const [scoresUpdated, setScoresUpdated] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  // will fetch all users and also display them to the console for testing purposes

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log(
          'use effect triggered do to selected User Change',
          selectedUser,
        );
        const db = await connectToDatabase();
        console.log('~ fetchUsers ~ db:', db);
        const users = await getAllUsers(db);
        console.log('~ fetchUsers ~ users:', users);
        //console.log('all user:', allUsers.map(user => ({ username: user.username, id: user.id}))); testing 
        //console.log('fetched Users:', users)
        setAllUsers(users);
      } catch (error) {
        console.log('~ fetchUsers ~ error:', error);
      }
    };
    fetchUsers();
  }, []);

  //Fetch items from FoodDonation db to be displayed on page and set scores based on selected filter
  const getScoresBasedOnFilter = async () => {
    const db = await connectToDatabase();
    let queryFilter = '';

    switch (filter) {
      case 'day':
        queryFilter = `SELECT username, SUM(score) AS totalScore 
          FROM Scores WHERE dateAdded >= 
          datetime('now', '-1 day') GROUP BY username`;
        break;
      case 'week':
        queryFilter =
          "SELECT username, SUM(score) AS totalScore FROM Scores WHERE dateAdded >= datetime('now', '-7 days') GROUP BY username";
        break;
      case 'month':
        queryFilter =
          "SELECT username, SUM(score) AS totalScore FROM Scores WHERE dateAdded >= datetime('now', '-30 days') GROUP BY username";
        break;
      case 'year':
        queryFilter =
          "SELECT username, SUM(score) AS totalScore FROM Scores WHERE dateAdded >= datetime('now', '-365 days') GROUP BY username";
        break;
      default:
        queryFilter =
          'SELECT username, SUM(score) AS totalScore FROM Scores GROUP BY username';
    }

    try {
      const [results] = await db.executeSql(queryFilter);
      const scores = [];
      for (let i = 0; i < results.rows.length; i++) {
        scores.push(results.rows.item(i));
        //console.log("fetched scores for filter", filter, ": ", scores);
      }
      return scores;
    } catch (error) {
      console.error('failed to fetch scores based on filter', error);
      return [];
    }
  };

  useFocusEffect(
    useCallback(() => {
      const loadScores = async () => {
        const scores = await getScoresBasedOnFilter(); // Use the fetchScores function defined outside
        const adjustedScores = scores.map(user => ({
          ...user,
          score: user.totalScore,
        }));
        //console.log(scores);
        setItems(adjustedScores.sort((a, b) => b.score - a.score)); // makes scores in decending order so highest score at top
      };

      loadScores();
    }, [filter, scoresUpdated]), // Re-fetch scores when filter changes or scores are updated
  );

  // USED TO ADD POINTS VIA THE BUTTON ON THIS PAGE NOT NEEDED IN FINAL APP
  const handleAddPoints = async () => {
    if (selectedUser) {
      try {
        const db = await connectToDatabase();
        //console.log("database connection working", db);
        const userId = await getUserIdByUsername(db, selectedUser); // Fetch the user ID

        if (userId !== null) {
          await updateUserScoreById(db, userId, 100);
          console.log(
            `Score added successfully for ${selectedUser} with ID ${userId}`,
          );
          setScoresUpdated(prevState => !prevState);
        } else {
          console.log(`User ID not found for username: ${selectedUser}`);
        }
      } catch (error) {
        console.error('Failed to add score:', error);
      }
    }
  };

  // USED TO DELETE ALL ITEMS FROM TABLE
  const handleDeleteScores = async () => {
    const db = await connectToDatabase();
    await deleteAllScores(db);
  };

  const handleUserSelection = async (selectedUsername: string) => {
    console.log('handleuserselection called with,', selectedUser);
    setSelectedUser(selectedUsername);
    const db = await connectToDatabase();
    //const currentSelectedUserId = await getCurrentSelectedUserId(db);

    if (selectedUsername === selectedUser) {
      console.log(
        'selected user is the same as the previous one, no update needed ',
      );
      return;
    }

    // Find the selected user object based on the username
    const selectedUserObj = allUsers.find(
      user => user.username === selectedUsername,
    );

    if (!selectedUserObj) {
      console.error('Selected user not found', selectedUsername);
      return;
    }

    // Check if the newly selected user is different from the current selected user
    // if (currentSelectedUserId !== selectedUserObj.id) {
    console.log('updating selected user in db', selectedUsername);
    await updateCurrentSelectedUser(db, selectedUserObj.id);
    console.log('database update complete now updating component state');
    //console.log(`User updated: ${selectedUsername} with ID: ${selectedUserObj.id}`);
    // }

    // Update the component state
    console.log('component state updated');
  };

  return (
    <ScrollView>
      <Text style={styles.headerDropDown}>Select user</Text>
      <View style={styles.container}>
        {/* user selection an add point functionality */}
        <View style={styles.filterUser}>
          <Picker
            selectedValue={selectedUser}
            onValueChange={itemValue => handleUserSelection(itemValue)}
            style={styles.picker}>
            {allUsers.map((user, index) => (
              <Picker.Item
                key={index}
                label={user.username}
                value={user.username}
              />
            ))}
          </Picker>

          
        </View>

        {/* <View style = {styles.add100}>
        <Button title="Add 100 points" onPress={handleAddPoints}/>
        </View> */}

        {/* <View style = {styles.deleteAllScores}>
        <Button title="delete all scores" onPress={handleDeleteScores}/>
        </View>  */}

        <View style={styles.filterTime}>
          <Picker
            selectedValue={filter}
            onValueChange={itemValue => setFilter(itemValue)}>
            <Picker.Item label="All" value="all" />
            <Picker.Item label="Last Day" value="day" />
            <Picker.Item label="Last Week" value="week" />
            <Picker.Item label="Last Month" value="month" />
            <Picker.Item label="Last Year" value="year" />
          </Picker>
        </View>

        {items.length === 0 ? ( // if there are no scores to show display a message to the user so they know
          <Text style={styles.noScoresMessage}>
            No scores available for the selected period.
          </Text>
        ) : (
          <DataTable>
            <View style={styles.lineStyle}></View>
            <DataTable.Header>
              <DataTable.Title>Position</DataTable.Title>
              <DataTable.Title>Username</DataTable.Title>
              <DataTable.Title numeric style={styles.scoreHeading}>
                Score
              </DataTable.Title>
            </DataTable.Header>

            {items.map((user, index) => (
              <DataTable.Row key={index}>
                <DataTable.Cell>{index + 1}</DataTable.Cell>
                <DataTable.Cell>
                  <Text style={styles.username}>{user.username}</Text>
                </DataTable.Cell>
                <DataTable.Cell numeric>
                  {' '}
                  <Text style={styles.scoreText}>{user.totalScore}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
          </DataTable>
        )}
      </View>
    </ScrollView>
  );
};

export default LeaderBoardScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
  },
  headerDropDown: {
    paddingTop: '5%',
    alignSelf: 'center',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  // tableHeader: {
  //   fontWeight: 'bold',

  //   // Adjust the font size for the header if needed
  // },
  lineStyle: {
    height: 2,
    backgroundColor: 'grey',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
  },
  noScoresMessage: {
    color: 'black',
    textAlign: 'center',
    marginTop: '14%',
  },
  add100: {
    padding: 10,
    marginBottom: 0,
  },
  deleteAllScores: {
    marginBottom: 15,
    padding: 10,
  },

  filterUser: {
    height: 50,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#36CE64',
    justifyContent: 'center',
    marginBottom: '6%',
  },
  filterTime: {
    height: 50,
    textAlign: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#36CE64',
    justifyContent: 'center',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  scoreHeading: {
    marginRight: '10%',
  },
  username: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 16,
  },
  scoreText: {
    marginRight: '25%',
    color: 'black',
    fontSize: 16, // Adjust as needed
    fontWeight: 'bold', // Text style property
    // Any other text styling
  },
});
