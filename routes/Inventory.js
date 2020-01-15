import React from 'react';
import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

// screens
import Inventory from '../screens/Inventory';
import PickUp from './PickUp';
import 'react-native-gesture-handler';
import Restock from './Restock';
import { Colors } from 'react-native-paper';

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
                tabBarIcon: <Icon name="tray-full" size={24} style={styles.icon}/>,
                tabBarColor: Colors.orange300,
            },
        },
        Restock: {
            screen: Restock,
            navigationOptions: {
                headerTitle: "Restock",
                tabBarIcon: <Icon name="layers-plus" size={24} style={styles.icon}/>,
                tabBarColor: Colors.blue300,
            }
        },
        PickUp: {
            screen: PickUp,
            navigationOptions: {
                headerTitle: "Pick Up",
                tabBarIcon: <Icon name="truck" size={24} style={styles.icon}/>,
                tabBarColor: Colors.red500,
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
