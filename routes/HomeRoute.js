import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import React from 'react';

import { 
  NativeModules, 
  TouchableHighlight,
} from 'react-native';

import OptionsMenu from 'react-native-options-menu';

import Home from '../screens/Home/Home';
import Chicken from './ChickenInfo';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory';
import Restock from '../screens/Restock';

import Theme from '../theme/Theme';
import Icon from 'react-native-ionicons';

/**
 * Grabs the props from the initial Home component and helps to manipulate oustide the main Component
 */
let propGrabber = null;
let navGrabber = null;

function switchToEggs() {
  propGrabber.navigation.navigate("AddInventory", {
    context: "eggs"
  });
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
      screen: Home,
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
            customButton={<Icon name="add" style={{marginEnd: 16, color: "#444"}}/>}
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
        headerLeft: <TouchableHighlight style={{margin: 16}} onPress={popToTop}>
                        <Icon name="close" style={{color: "#444"}}/>
                    </TouchableHighlight>,
      },
    },
    Restock: {
      screen: Restock,
      navigationOptions: {
        title: "Restock",
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
  },
);

export default createAppContainer(stackNavigator);
