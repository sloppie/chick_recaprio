import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-ionicons';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

// screens
import Inventory from '../screens/Inventory';
import PickUp from './PickUp';
import 'react-native-gesture-handler';
import Restock from './Restock';

const styles = StyleSheet.create({
    icon: {
        color: "#fff",
    }
});


const bottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
                headerStyle: {
                    elevation: 0
                },
                tabBarIcon: <Icon name="paper" style={styles.icon}/>
            },
        },
        Restock: {
            screen: Restock,
            navigationOptions: {
                headerTitle: "Restock",
                tabBarIcon: <Icon name="journal" style={styles.icon}/>
            }
        },
        PickUp: {
            screen: PickUp,
            navigationOptions: {
                headerTitle: "Pick Up",
                tabBarIcon: <Icon name="filing" style={styles.icon}/>
            },
        }
        
    },
    {
        shifting: true,
		activeColor: "gold",
        inactiveColor: "white",
    },
);


export default createAppContainer(bottomTabNavigator);
