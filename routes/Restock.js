import 'react-native-gesture-handler';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';

// screens
import Home from '../screens/Restock';
import Restock from '../screens/RestockExisting';
import NewFeeds from '../screens/NewFeeds';

import * as HomeDrawer from './HomeDrawer';

let StackNavigator = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                headerTitle: "Feeds Inventory",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon name="menu" /></TouchableHighlight>
            },
        },
        NewFeeds: {
            screen: NewFeeds,
            navigationOptions: {
                headerTitle: "New Feed Type",
            },
        },
        Restock: {
            screen: Restock,
            navigationOptions: {
                headerTitle: "Restock"
            }
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "#444"
            },
            headerTintColor: "#444",
        },
    }
);

export default createAppContainer(StackNavigator);
