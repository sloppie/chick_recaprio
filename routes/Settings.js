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
import Theme from '../theme';


const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: Settings,
            navigationOptions: {
                headerTitle: "Settings",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon color={Theme.SECONDARY_COLOR_DARK} name="menu" /></TouchableHighlight>
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
                backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
            },
            headerTintColor: Theme.SECONDARY_COLOR_DARK,
            headerTitleStyle: {
                color: Theme.APP_BAR_HEADER_COLOR,
            },
        },
    }
);

export default createAppContainer(StackNavigator);
