import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { DrawerActions } from 'react-navigation-drawer';

import React from 'react';
import { TouchableHighlight } from 'react-native';
import Icon from 'react-native-ionicons';

import Event from '../screens/Calendar';
import AddEvent from '../screens/AddEvent';
import Events from '../screens/Events';
import ArchiveEvent from '../screens/ArchiveEvent';

import * as HomeDrawer from './HomeDrawer';
import Theme from '../theme';


const EventStack = createStackNavigator(
    {
        Event: {
            screen: Event,
            navigationOptions: {
                headerTitle: "Events",
                headerLeft: <TouchableHighlight style={{ marginStart: 16 }} onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}><Icon color={Theme.SECONDARY_COLOR_DARK} name="menu" /></TouchableHighlight>
            },
        },
        AddEvent: {
            screen: AddEvent,
            navigationOptions: {
                headerTitle: "Add Event"
            },
        },
        Events: {
            screen: Events,
            navigationOptions: {
                headerTitle: "Events"
            },
        },
        ArchiveEvent: {
            screen: ArchiveEvent,
            navigationOptions: {
                headerTitle: "Archive Event"
            }
        },
    },
    {
        initialRouteName: "Event",
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "#444",
                backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
            },
            headerTintColor: Theme.SECONDARY_COLOR_DARK,
            headerTitleStyle: {
                color: Theme.APP_BAR_HEADER_COLOR,
            },
        },
    }
);

export default createAppContainer(EventStack);
