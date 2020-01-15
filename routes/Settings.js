import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

import Settings from '../screens/Settings';
import NotificationSettings from '../screens/NotificationSettings';
import BatchSettings from '../screens/BatchSettings';
import SecuritySettings from '../screens/SecuritySettings';

import * as HomeDrawer from './HomeDrawer';


const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: Settings,
            navigationOptions: {
                headerTitle: "Settings",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon name="menu" /></TouchableHighlight>
            }
        },
        BatchSettings: {
            screen: BatchSettings,
            navigationOptions: {
                headerTitle: "Batch Settings"
            },
        },
        NotificationSettings: {
            screen: NotificationSettings,
            navigationOptions: {
                headerTitle: "Notification Settings"
            },
        },
        SecuritySettings: {
            screen: SecuritySettings,
            navigationOptions: {
                headerTitle: "Security",
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
            },
            headerTintColor: "#444",
        },
    }
);

export default createAppContainer(StackNavigator);
