import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import React from 'react';
import { NativeModules , Button} from 'react-native';
import OptionsMenu from 'react-native-options-menu';

import Home from '../screens/Home/Home';
import Chicken from './ChickenInfo';
import NewBatch from '../screens/NewBatch/NewBatch';
import AddInventory from '../screens/AddInventory/AddInventory';

import Theme from '../theme/Theme';
import Icon from 'react-native-ionicons';

let nav = null;

function moveToEggs() {
  nav.navigation.navigate("AddInventory", {
    context: "eggs"
  });
}

function moveToFeeds() {
  nav.navigation.navigate("AddInventory", {
    context: "feeds"
  });
}

let stackNavigator = createStackNavigator(
  {
    Home,
    Chicken: {
      screen: (props) => {
        nav = props;
        return<Chicken />
      },
      navigationOptions: {
        title: "Batch Data",
        headerRight: ( 
          <OptionsMenu
            customButton={<Icon name="add" style={{marginEnd: 16}}/>}
            destructiveIndex={2}
            options={["Add Eggs", "Add Feeds", "Cancel"]}
            actions={[moveToEggs, moveToFeeds]} />
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
        title: "Add: " + NativeModules.Sessions.getCurrentSession(),
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
