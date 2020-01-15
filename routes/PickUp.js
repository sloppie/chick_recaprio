import 'react-native-gesture-handler';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

//screens
import PickUp from '../screens/PickUp';
import EmptyInventory from '../screens/EmptyInventory';
import AddPrices from '../screens/AddPrices';

import * as HomeDrawer from './HomeDrawer';


const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: PickUp,
            navigationOptions: {
                headerTitle: "Pick Up",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon name="menu" /></TouchableHighlight>
            }
        },
        EmptyInventory: {
            screen: EmptyInventory,
            navigationOptions: {
                headerTitle: "Empty Inventory"
            },
        },
        AddPrices: {
            screen: AddPrices,
            navigationOptions: {
                headerTitle: "Add Prices"
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                color: "#444",
                elevation: 0
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#444",
            },
        },
    }
);

export default createAppContainer(StackNavigator);
