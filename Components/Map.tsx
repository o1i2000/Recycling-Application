import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { fetch } from "@react-native-community/netinfo";
import Geolocation from '@react-native-community/geolocation';
import MapViewDirections from 'react-native-maps-directions';
import {Text, StyleSheet, View, Dimensions, Modal, Pressable, FlatList, Alert} from 'react-native';
import { useEffect, useState, useRef } from 'react';
import {getDistance} from 'geolib';

//Map pin icons
const recpinURI = require("../assets/Images/recpoint.png");
const marketURI = require("../assets/Images/supermarket.png");
const fooddonorURI = require("../assets/Images/foodplace.png");

//Get device screen size information
const { height, width } = Dimensions.get( 'window' );

function DisplayMap({route, navigation} : {route: any, navigation: any}) {

    const youAreHere = useRef({latitude: 54.9768729,
        longitude: -1.6077272,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09 * (width/height)});
    const locActive = useRef(false);
    const [destination, setDestination] = useState<typeof youAreHere.current>();
    const [connection, setConnection] = useState<boolean | null>(true);
    const [listAccepted, setListAccepted] = useState([]);
    const [placeName, setplaceName] = useState('PLACENAME');
    const [placeholderDest, setPlaceholderDest] = useState<any>();
    const [modalVisible, setModalVisible] = useState(false);
    const [distance, setDistance] = useState(0);

    Geolocation.getCurrentPosition(
        (info: any) => {
            youAreHere.current = {
                latitude: info.coords.latitude,
                longitude: info.coords.longitude,
                latitudeDelta: 0.09,
                longitudeDelta: 0.09 * (width/height)
            }
            locActive.current = true;
            console.log('getting location');
        }, 
        (error: any)=> {
            Alert.alert('Error getting your location, please check if you have location permissions turned on.');
            locActive.current = false;
        }, 
        {enableHighAccuracy: true, timeout: 5000, maximumAge: 5000});

    //Get the filters passed onto this screen as parameters from the previous filter screen
    let filters = {
        acceptsOrganic: false,
        acceptsBatteries: false,
        acceptsCartons: false,
        acceptsGeneral: false,
        acceptsElectronic: false,
        acceptsFabric: false,
        acceptsChemical: false,
        acceptsPlastic: false,
        acceptsFoodDonation: false
    } as any;
    filters = route.params;

    //Error handling to check connection as many of the APIs used require active internet connection
    //Simply presents an error message to the user
    function connectionCheck() {
        fetch().then(state => {
            setConnection(state.isConnected);
        });
        if (!connection) {
            Alert.alert('You are not connected to the internet, our map functions may not work!');
        }
    }
    useEffect(() => connectionCheck())

    //When a marker/pointer is clicked
    function setModalDestination(x: any) {
        //Get the name of the marker/place  
        setplaceName(x.name);
        //Get a list of accepted trash types to display
        const trashList = [] as any;
        for (const key in x) {
            if (key.includes('accepts')) { 
                x[key] ? trashList.push(key.replace('accepts','')) : null;
            }
        }       
        setListAccepted(trashList);
        //Hold the destination in a temporary use state before confirming as the path line destination
        setPlaceholderDest(x);
        //Get distance from origin point to the clicked marker for information display
        if (locActive) {
            setDistance(getDistance(youAreHere.current,x.coords)/1000);  
        }
        //Show the modal popup
        setModalVisible(true);
    };

    //When the get destination button on the modal popup is clicked
    function confirmDestination() {
        //Hide the modal
        setModalVisible(false);
        //Confirm the marker as the new destination
        setDestination(placeholderDest.coords);
    };

    //Filter out locations that don't accept the types of waste selected in the MapFilter Screen
    const filteredPoints = [] as typeof locations
    locations.forEach((location: any) =>{
        let matching = true
        for (const filter in filters) {
            if (filters[filter] && !location[filter]) {
                matching = false
            }
        }
        if (matching) {filteredPoints.push(location)}
    });
        
    //Stores markers for every location coordinates into a variable to be returned later
    const displayedPoints = [] as any[]
    filteredPoints.forEach((location, key) =>{
        displayedPoints.push(<Marker key={key} coordinate={location.coords} image={location.pinType} onPress={()=>setModalDestination(location)}/>)
    })

    function displayOrigin() {
        if (locActive.current) {
            return <Marker coordinate={youAreHere.current} image={require('../assets/Images/youarehere.png')}/>
        } 
    }

    //Directions/path component for the map, includes error handling for the directions API
    const pathingComponent = <MapViewDirections 
        origin={youAreHere.current} 
        destination={destination}
        apikey={'AIzaSyCK98MOIT_5pxxqfMxLrBwscaMWEmtumC4'}
        strokeWidth={4}
        strokeColor='limegreen' 
        onError={(errorMessage) =>{
            if (errorMessage.message.includes('network')){
                Alert.alert('Could not get directions, please check your connection.');
            }
            else{
                Alert.alert('The directions API are experiencing difficulties. Please try again later.');
            }
        }}
        />

    return (
        <View style={{ flex: 1 }}>

            <Modal animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View><Text>{placeName} ({distance} km)</Text></View>
                        <View style={{flexGrow: 0}}>
                            <Text>This site accepts the following types of wastes/donations: </Text>
                            <FlatList style= {{flexGrow: 0}} data= {listAccepted} 
                            renderItem={
                                ({item}) => <Text>{item}</Text>
                            }
                            />
                        </View>
                        <Pressable style={styles.directionsButton} onPress={() => confirmDestination()}>
                            <Text style={{color: 'white'}}>GET DIRECTIONS</Text>
                        </Pressable>
                        <Pressable style={{marginTop:'3%'}} onPress={() => setModalVisible(false)}>
                            <Text style={{color: 'red'}}>CANCEL</Text>
                        </Pressable>
                    </View>
                </View>
            </Modal>

            <MapView
                provider={PROVIDER_GOOGLE}
                style={styles.map}
                region={youAreHere.current}
            >
                {displayOrigin()}
                {displayedPoints}
                {pathingComponent}
            </MapView>
        </View>
    );
}

export default DisplayMap;

//Some hardcoded location values saved as objects, no backend API/database interaction for this subsystem at the moment

const recyclingPoint1 = {
    acceptsOrganic: true,
    acceptsBatteries: true,
    acceptsCartons: true,
    acceptsGeneral: true,
    acceptsElectronic: true,
    acceptsFabric: true,
    acceptsChemical: true,
    acceptsPlastic: true,
    acceptsFoodDonation: false,
    coords: {
    latitude: 54.968452391684316,
    longitude: -1.5768819396137839,
    latitudeDelta: 0,
    longitudeDelta: 0,},
    name: "BYKER RECYCLING POINT",
    pinType: recpinURI,
};

const superMarket1 = {
    acceptsOrganic: false,
    acceptsBatteries: false,
    acceptsCartons: true,
    acceptsGeneral: false,
    acceptsElectronic: false,
    acceptsFabric: true,
    acceptsChemical: false,
    acceptsPlastic: true,
    acceptsFoodDonation: true,
    coords: {
    latitude: 54.96394521958131, 
    longitude: -1.6028822679211872,
    latitudeDelta: 0,
    longitudeDelta: 0,},
    name: " SUPERMARKET RECYCLER",
    pinType: marketURI
};

const foodDonor1 = {
    acceptsOrganic: false,
    acceptsBatteries: false,
    acceptsCartons: false,
    acceptsGeneral: false,
    acceptsElectronic: false,
    acceptsFabric: false,
    acceptsChemical: false,
    acceptsPlastic: false,
    acceptsFoodDonation: true,
    coords: {
    latitude: 54.96753616440747,
    longitude:  -1.6010253168984223,
    latitudeDelta: 0,
    longitudeDelta: 0,},
    name: "LOCAL FOODBANK",
    pinType: fooddonorURI
};

//List of ALL locations (again, hardcoded for now, ideally pulls from database, will add if there is development time)
const locations = [recyclingPoint1, superMarket1, foodDonor1];

//Styles for components in the map screen
const styles = StyleSheet.create({
    //Allows the mapview to display by filling its container
    map: {
    ...StyleSheet.absoluteFillObject,
    },
    //Position the marker click modal viewbox to center
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    //Adjust the modal container
    modalView: {
        flexGrow: 0,
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        elevation: 5,
    },
    //Style the "get directions" button in modal popup
    directionsButton: {
        backgroundColor: 'limegreen',
        borderRadius: 10,
        padding: 10,
        elevation: 2,
        marginTop: '3%'
    }
});