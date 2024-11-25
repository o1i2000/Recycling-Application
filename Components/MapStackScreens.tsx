import * as React from 'react';
import { Button, Text, View } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Map from "../Components/Map";
import MapFilter from "../Components/MapFilter";


const MapStack = createNativeStackNavigator();

function MapStackScreens() {
    return(
        <MapStack.Navigator>
            <MapStack.Screen name="Map Filter" component={MapFilter}/>
            <MapStack.Screen name="Map" component={Map}/>
        </MapStack.Navigator>
    );
}

export default MapStackScreens;