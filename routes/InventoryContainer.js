import 'react-native-gesture-handler';

import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

import * as HomeDrawer from './HomeDrawer';

import Inventory from '../screens/Inventory';
import Theme from '../theme';


const StackNavigator = createStackNavigator(
    {
        Inventory: {
            screen: (props) => <Inventory {...props} />,
            navigationOptions: {
                headerTitle: "Inventory Check",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon color={Theme.SECONDARY_COLOR_DARK} name="menu" /></TouchableHighlight>
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                color: Theme.APP_BAR_HEADER_COLOR,
                backgroundColor: Theme.PRIMARY_COLOR_DARK,
                elevation: 0,
            },
            headerTintColor: Theme.SECONDARY_COLOR_DARK,
            headerTitleStyle: {
                color: Theme.APP_BAR_HEADER_COLOR,
            },
        },
    }
);

export default createAppContainer(StackNavigator);
