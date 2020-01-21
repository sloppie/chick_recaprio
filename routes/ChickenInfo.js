import 'react-native-gesture-handler';

import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { createDrawerNavigator } from 'react-navigation-drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import ProduceTab from './../screens/Produce';
import FeedsTab from './../screens/Feeds';
import ChickenTab from './../screens/Period';

import Theme from '../theme';
import { Colors } from 'react-native-paper';

const TopTab = createMaterialTopTabNavigator(
  {
    Produce: {
      screen: (props) => <ProduceTab {...props}/>,
      navigationOptions: {
        headerTitleStyle: {
          color: "#444"
        },
        tabBarLabel: "Egg Produce",
        tabBarIcon: <Icon color={Theme.SECONDARY_COLOR} name="egg"/>,
      }
    },
    Feeds: {
      screen: FeedsTab,
      navigationOptions: {
        // tabBarIcon: "clipboard",
        tabBarIcon: <Icon color={Theme.SECONDARY_COLOR} name="clipboard"/>,
      },
    },
    Chicken: {
      screen: ChickenTab,
      navigationOptions: {
        tabBarIcon: <Icon color={Theme.SECONDARY_COLOR} name="egg"/>,
      }
    }
  },
  {
    initialRouteName: "Produce",
    tabBarOptions: {
      swipeEnabled: true,
      style: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
        color: "#444"
      },
      activeTintColor: Theme.SECONDARY_COLOR_DARK,
      inactiveTintColor: Theme.PRIMARY_COLOR,
      showLabel: true,
    },
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
  }
);


export default createAppContainer(TopTab);
