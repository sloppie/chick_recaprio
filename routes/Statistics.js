import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

import Statistics from '../screens/Statistics';

import * as HomeDrawer from './HomeDrawer';

let Stack = createStackNavigator(
    {
        Statistics: {
            screen: Statistics,
            navigationOptions: {
                headerTitle: "Statistics",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon name="menu" /></TouchableHighlight>
            },
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "$444",
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#444",
            },
        },
    },
);


export default createAppContainer(Stack);
