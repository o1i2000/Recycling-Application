/*
Author: Daniel Coates
StudentID: w21003534

This component creates a QR scanner components that integrates
with the LeaderBoardScreen component to get users to recycle more
*/

import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Alert,
  Modal,
  Button,
} from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import React, {Component} from 'react';
import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {
  getCurrentSelectedUserId,
  connectToDatabase,
  getUsernameById,
} from '../db/database';
import {updateUserScoreById} from '../db/fetchUserScores';
import Toast from 'react-native-toast-message';

export default class ScanScreen extends Component {

  //sets the default states for the class
  state = {
    modalVisible: false,
    scannedData: null,
    flash: RNCamera.Constants.FlashMode.off,
    showButton: true,
  };

  //when a QR code is scanned theis function runs
  //this allows points to be added for valid items
  onSuccess = async e => {
    console.log('seen');
    try {
      const details = JSON.parse(e.data);
      const info =
        'Product: ' +
        details.productName +
        '\nMaterial: ' +
        details.type +
        '\nRecyclable: ' +
        details.recyclable +
        '\nBin: ' +
        details.bin;
      if(details.recyclable=='yes'){
        this.setState({
          modalVisible: true,
          scannedData: info,
          showButton: true,
        });
      }
      else{
        this.setState({
          modalVisible: true,
          scannedData: info,
          showButton: false,
        });
      }
    
      const db = await connectToDatabase();


      // Oliver dickinson code between { } everything else Dan's code { --------------------------
      // Fetch the currently selected user ID
      const selectedUserId = await getCurrentSelectedUserId(db);
      let username = 'Not found';

      // If a selected user ID exists, fetch the username
      if (selectedUserId !== null) {
        const fetchedUsername = await getUsernameById(db, selectedUserId);
        if (fetchedUsername) {
          username = fetchedUsername;
        }
      }

      console.log(
        `The current selected user is ${username} and their ID is ${selectedUserId}`,
      );
      // }    -------------------------------------------------
    } catch (error) {
      this.setState({
        modalVisible: true,
        scannedData: 'QR code is not a valid product',
        showButton: false,
      });
    }
  };

  //close the modal wothout adding points
  closeNoPoints = () => {
    this.setState({
      modalVisible: false,
      scannedData: null,
    });
    this.scanner.reactivate();
  }
  //close the modal and add points for valid items
  closeModal = async () => {
    this.setState({
      modalVisible: false,
      scannedData: null,
    });
    this.scanner.reactivate();
    try {
      // ----------------------------------------------------- {
      const db = await connectToDatabase();
      const selectedUserId = await getCurrentSelectedUserId(db);

      if (selectedUserId !== null) {
        const username = await getUsernameById(db, selectedUserId);
        // Directly update the score using the selected user ID
        await updateUserScoreById(db, selectedUserId, 100);
        console.log(
          `Score updated successfully for user ID: ${selectedUserId}`,
        );

        Toast.show({
          type: 'success',
          text1: `Added 100 points to ${username}!`,
          position: 'top',
          topOffset: 70,
          text1Style: styles.rewardStyle,
        });
      } else {
        console.log('No user currently selected.');
      }
    } catch (error) {
      console.error('Failed to update score:', error);
    }
    //    }  ------------------------------------------------------ 
  };
  constructor(props) {
    super(props);
    this.closeModal = this.closeModal.bind(this);
    this.toggle = this.toggle.bind(this); //might not need
    this.closeNoPoints = this.closeNoPoints.bind(this);
  }

  //updates the flash state to turn it off and on
  toggle = () => {
    let tstate = this.state.flash;
    if (tstate == RNCamera.Constants.FlashMode.off) {
      tstate = RNCamera.Constants.FlashMode.torch;
    } else {
      tstate = RNCamera.Constants.FlashMode.off;
    }
    this.setState({flash: tstate});
  };

  render() {
    return (
      <View>
        <QRCodeScanner
          ref={node => {
            this.scanner = node;
          }}
          onRead={this.onSuccess}
          flashMode={this.state.flash}
          reactivate={true}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => this.closeModal()}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Scanned Data</Text>
              <Text style={styles.modalText}>{this.state.scannedData}</Text>
              { this.state.showButton &&
                <Button title="Recycle (add points)" onPress={() => this.closeModal()} />}
              <Button title='Close' onPress={() => this.closeNoPoints()}/>
            </View>
          </View>
        </Modal>
        <Button title="Toggle flash" onPress={this.toggle} />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  footerButtonStyle: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'limegreen',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
  },
  rewardStyle: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});
