import 'react-native-gesture-handler';
import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

// routes
import Home from './HomeRoute';
import Inventory from './Inventory';
import Statistics from './Statistics';
import Events from './Events';

// theme
import Theme from '../theme/Theme';
import Icon from 'react-native-ionicons';
import Settings from './Settings';

const Drawer = createDrawerNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                headerTitle: "Home",
                drawerLabel: "Home",
                drawerIcon: <Icon name="home" />
            },
        },
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
                drawerLabel: "Inventory",
                drawerIcon: <Icon name="paper" />,
                title: "Inventory",
            },
        },
        Statistics: {
            screen: Statistics,
            navigationOptions: {
                headerTitle: "Statistics",
                drawerLabel: "Statistics",
                drawerIcon: <Icon name="stats" />
            }
        },
        Event: {
            screen: Events,
            navigationOptions: {
                headerTitle: "Events",
                drawerLabel: "Events",
                drawerIcon: <Icon name="calendar" />
            },
        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                drawerIcon: <Icon name="cog" />,
                drawerLabel: "Settings",
                headerTitle: "Settings",
            }
        },
    },
    {
        hideStatusBar: false,
        minSwipeDistance: 30,
    }
);

export default createAppContainer(Drawer);
