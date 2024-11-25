import React from "react";
import { StyleSheet, Text, View, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreenComponent from "../Components/HomeScreenComponent";
import LeaderboardScreen from "../Components/LeaderboardScreen";
import DonateFood from "../Components/DontateFood";
import ChatGpt from "../Components/ChatGpt";
import MapStackScreens from "../Components/MapStackScreens";


const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({children, onPress}) => (
    <TouchableOpacity
    style={{
        top: -30,
        justifyContent:'center',
        alignItems: 'center',
    }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            backgroundColor: '#DEEAE9'
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

const Tabs = () => {
    return(
        <Tab.Navigator 
            screenOptions={{
                tabBarShowLabel: false,
                tabBarStyle: {
                display: 'flex',
                position: '',
                elevation : 0,
                backgroundColor : '#ffffff',
                height: 90,
                height: 75,
                paddingBottom:15,
                
                 }
                }}>


            <Tab.Screen name = "Home" component={ChatGpt} 
                options={{
                    tabBarIcon : ({focused}) => (
                    <View style = {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image 
                            source={require('../assets/Images/recipe.png')}
                            resizeMode="contain"
                            style={{
                                width:55,
                                height:35,
                                tintColor: focused ? '#36CE64' : '#748c94'
                            }}
                        />
                        <Text style ={{color: focused ? '#36CE64' : '#748c94', fontSize:12}}>RECIPES</Text>
                                
                    </View>
                    )
                }}
            /> 


            <Tab.Screen name = "MapTab" component={MapStackScreens}
                options={{
                    headerShown: false,
                    tabBarIcon : ({focused}) => (
                    <View style = {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image 
                            source={require('../assets/Images/map.png')}
                            resizeMode="contain"
                            style={{
                                width:55,
                                height:35,
                                tintColor: focused ? '#36CE64' : '#748c94'
                            }}
                        />
                        <Text style ={{color: focused ? '#36CE64' : '#748c94', fontSize:12}}>MAP</Text>           
                    </View>
                    )
                }}
            />

            <Tab.Screen name = "Scan" component={HomeScreenComponent} 
                options={{
                    tabBarIcon : ({focused}) => (
                    <View style = {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image 
                            source={require('../assets/Images/scan.png')}
                            resizeMode="contain"
                            style={{
                                width:55,
                                height:35,
                                tintColor: focused ? '#36CE64' : 'black'
                            }}
                        />
                        <Text style ={{color: focused ? '#36CE64' : 'black', fontSize:12, fontWeight: 'bold'}}>SCAN</Text>
                                
                            </View>
                    )
                }}
            /> 

        
            <Tab.Screen name = "Donate" component={DonateFood} //can be turned into home button or something
                options={{
                    tabBarIcon : ({focused}) => (
                    <View style = {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image 
                            source={require('../assets/Images/salad.png')}
                            resizeMode="contain"
                            style={{
                                width:55,
                                height:35,
                                tintColor: focused ? '#36CE64' : '#748c94'
                            }}
                        />
                        <Text style ={{color: focused ? '#36CE64' : '#748c94', fontSize:12}}>DONATE</Text>
                                
                            </View>
                    )
                }}
            /> 
            <Tab.Screen name = "Leaderboard" component={LeaderboardScreen}
                options={{
                    tabBarIcon : ({focused}) => (
                    <View style = {{alignItems: 'center', justifyContent: 'center', top: 10}}>
                        <Image 
                            source={require('../assets/Images/ranking.png')}
                            resizeMode="contain"
                            style={{
                                width:55,
                                height:35,
                                tintColor: focused ? '#36CE64' : '#748c94'
                            }}
                        />
                        <Text style ={{color: focused ? '#36CE64' : '#748c94', fontSize:12}}>SCORES</Text>
                                
                            </View>
                    )
                }}
            />
            
        </Tab.Navigator>
    );
}

// all icons are from Yogi Aprelliyanto found on this link 
// <a href="https://www.flaticon.com/free-icons" title="qr code icons">Qr code icons created by Yogi Aprelliyanto - Flaticon</a>

export default Tabs;