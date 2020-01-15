import 'react-native-gesture-handler';
import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator, DrawerActions } from 'react-navigation-drawer';

// routes
import Home from './HomeRoute'; 
import Inventory from './Inventory';
import Statistics from './Statistics';
import Events from './Events';

import Icon from 'react-native-ionicons';
import Settings from './Settings';
import Theme from '../theme';

let drawerActions = null;

const Drawer = createDrawerNavigator(
    {
        Home: {
            screen: (props) => {
                drawerActions = props.navigation;
                return <Home />
            },
            navigationOptions: {
                headerTitle: "Home",
                drawerLabel: "Home",
                drawerIcon: <Icon name="home" color={Theme.SECONDARY_COLOR_DARK} />,
            },
        },
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
                drawerLabel: "Inventory",
                drawerIcon: <Icon name="paper" color={Theme.SECONDARY_COLOR_DARK}/>,
                title: "Inventory",
            },
        },
        // Statistics: {
        //     screen: Statistics,
        //     navigationOptions: {
        //         headerTitle: "Statistics",
        //         drawerLabel: "Statistics",
        //         drawerIcon: <Icon name="stats" color={Theme.SECONDARY_COLOR_DARK} />
        //     }
        // },
        Event: {
            screen: Events,
            navigationOptions: {
                headerTitle: "Events",
                drawerLabel: "Events",
                drawerIcon: <Icon name="calendar" color={Theme.SECONDARY_COLOR_DARK} />
            },
        },
        Settings: {
            screen: Settings,
            navigationOptions: {
                drawerIcon: <Icon name="cog" color={Theme.SECONDARY_COLOR_DARK} style={{paddingRight: 4}}/>,
                drawerLabel: "Settings",
                headerTitle: "Settings",
            }
        },
    },
    {
        hideStatusBar: false,
        minSwipeDistance: 30,
        drawerWidth: "90%",
        drawerBackgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
        contentOptions: {
            activeBackgroundColor: Theme.ACTIVE_DRAWER_BACKGROUND_COLOR,
            itemStyle: {
                borderTopRightRadius: 50,
                borderBottomRightRadius: 50,
            },
            activeTintColor: Theme.SECONDARY_COLOR_DARK,
            iconContainerStyle: {
                marginRight: 0,
            },
        },
    }
);

export default createAppContainer(Drawer);
export { drawerActions };
