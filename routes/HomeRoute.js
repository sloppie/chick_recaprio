import 'react-native-gesture-handler';
import { DrawerActions } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';


import React from 'react';
import { NativeModules, TouchableHighlight } from 'react-native';

import Icon from 'react-native-ionicons';
import OptionsMenu from 'react-native-options-menu';

import Home from '../screens/Home/Home';
import Chicken from './ChickenInfo';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory';
import Restock from '../screens/Restock';
import EggWeek from '../screens/EggWeek';
import InitialSetup from '../screens/InitialSetup';


import * as HomeDrawer from './HomeDrawer';
import WeekInFeeds from '../screens/WeekInFeeds';
import Theme from '../theme';

// Grabs the props from the initial Home component and helps to manipulate oustide the main Component
let propGrabber = null;
let navGrabber = null;

function switchToEggs() {
  propGrabber.navigation.navigate("AddInventory", {
    context: "eggs"
  });
}

export function switchToEggWeek(params) {
  // propGrabber.navigation.navigate("EggWeek", params);
  switchTo("EggWeek", params);
}

export function switchToWeekInFeeds(params) {
  // propGrabber.navigation.navigate("EggWeek", params);
  switchTo("WeekInFeeds", params);
}

function switchToFeeds() {
  propGrabber.navigation.navigate("AddInventory", {
    context: "feeds"
  });
}

function switchToCasualties() {
  propGrabber.navigation.navigate("AddInventory", {
    context: "casualties"
  });
}

function switchTo(route, params) {
  propGrabber.navigation.navigate(route, params);
}

/**
 * Resets the Session, and then goes back to top
 */
function popToTop() {
	NativeModules.Sessions.resetSession();
	propGrabber.navigation.pop();
}

let stackNavigator = createStackNavigator(
  {
    Home: {
      screen: (props) => <Home {...props} />,
      navigationOptions: {
        headerTitle: "ChickLedger",
        headerLeft: (
          <TouchableHighlight 
            style={{marginStart: 16}} 
            onPress={() => HomeDrawer.drawerActions.dispatch(DrawerActions.openDrawer())}
          >
            <Icon name="menu" color={Theme.SECONDARY_COLOR_DARK} />
          </TouchableHighlight>
        ),
      },
    },
    Chicken: {
      screen: (props) => {
        propGrabber = props;
        return <Chicken />
      },
      navigationOptions: {
        title: "Batch Data",
        headerRight: ( 
          <OptionsMenu
            customButton={<Icon name="add" color={Theme.SECONDARY_COLOR_DARK} style={{marginEnd: 16}}/>}
            options={["Add Eggs", "Add Feeds", "Add Casualties"]}
            actions={[switchToEggs, switchToFeeds, switchToCasualties]} />
        ),
      },
    },
    NewBatch: {
      screen: NewBatch,
      navigationOptions: {
        title: "Create New Batch"
      },
    },
    AddInventory: {
      screen: AddInventory,
      navigationOptions: {
        title: "Add To Batch",
      },
    },
    Restock: {
      screen: Restock,
      navigationOptions: {
        title: "Restock",
      },
    },
    EggWeek: {
      screen: EggWeek,
      navigationOptions: {
        headerTitle: "Expanded Week"
      },
    },
    WeekInFeeds: {
      screen: WeekInFeeds,
      navigationOptions: {
        headerTitle: "Week in Summary"
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        color: "#444",
        elevation: 0,
        backgroundColor: Theme.PRIMARY_COLOR_DARK, 
      },
      headerTintColor: Theme.SECONDARY_COLOR_DARK,
      headerTitleStyle: {
        color: "#444",
      },
    },
  },
);

export default createAppContainer(stackNavigator);
export { popToTop };
