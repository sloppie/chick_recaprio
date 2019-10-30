import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import React from 'react';
import { NativeModules , TouchableHighlight } from 'react-native';
import OptionsMenu from 'react-native-options-menu';

import Home from '../screens/Home/Home';
import Chicken from './ChickenInfo';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory';
import Modal from './InModal';

import Theme from '../theme/Theme';
import Icon from 'react-native-ionicons';

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

/**
 *
 */
function popToTop() {
	NativeModules.Sessions.resetSession();
	propGrabber.navigation.pop();
}

let stackNavigator = createStackNavigator(
  {
    Home,
    Chicken: {
      screen: (props) => {
        propGrabber = props;
        return <Chicken />
      },
      navigationOptions: {
        title: "Batch Data",
        headerRight: ( 
          <OptionsMenu
            customButton={<Icon name="add" style={{marginEnd: 16, color: "white"}}/>}
            // destructiveIndex={2}
            options={["Add Eggs", "Add Feeds"]}
            actions={[switchToEggs, switchToFeeds]} />
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
      screen: Modal,
      navigationOptions: {
        title: "Add To Batch",
        headerLeft: <TouchableHighlight style={{margin: 16}} onPress={popToTop}><Icon name="close" style={{color: "white"}}/></TouchableHighlight>,
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: Theme.PRIMARY_COLOR_DARK,
        color: "white",
      },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "white",
      },
    },
  },
);

export default createAppContainer(stackNavigator);
