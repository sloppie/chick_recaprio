import React, { Component } from 'react';
import {
  View,
  // Text,
  Dimensions,
  StyleSheet,
  // TouchableHighlight,
  // ScrollView,
  // Button,
  NativeModules,
  // DeviceEventEmitter,
} from 'react-native';
// import ViewPager from '@react-native-community/viewpager';
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import Theme from '../../theme/Theme';

import ChickenTab from './Fragments/CasualtiesTab';
import ProduceTab from './Fragments/ProduceTab';
import FeedsTab from './Fragments/FeedsTab';
    const TopTab = createAppContainer(createMaterialTopTabNavigator(
      {
        Produce: {
          screen: ProduceTab,
        },
        Feeds: {
          screen: FeedsTab,
        },
        Chicken: {
          screen: ChickenTab,
        }
      },
      {
        initialRouteName: "Produce",
        tabBarOptions: {
          style: {
            backgroundColor: Theme.PRIMARY_COLOR_DARK,
          },
        },
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
      }
    ));
// import FloatingActionButton from './Fragments/FloatingActionButton';

// import FileManager from "./../../utilities/FileManager";

// const BinaryTree = require("./../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;
/**
 * !TODO: Redefine the heights from line: 203
 * !TODO export the components to a single file in the Fragments
 */

/**
 * ChickenTab retrieves data from The Engine of the app
 * To avoid Child Components from altering components,
 * all the WRITE queries are sent through the Chicken Component
 * This is done by passing a pipe that will allow open communication between
 * the child components and the Parent
 * Props passed to the component:
 * `this.props.context` is the name of the batch. Used to query the back end using the context as a batchName
 * `` 
 * @method
 */
let now = 0;
// let answer2;
export default class Chicken extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      activeTab: [true, false, false],
      promises : [],
      context: 0,
      eggs: null,
      feeds: null,
      casualties: null,
      now: 0,
    };
    this.now = 0;
  }

  static navigationOptions = {
    title: NativeModules.Sessions.getCurrentSession(),
  };

  componentDidMount(){
  }

  UNSAFE_componentWillMount() {
  }

  componentWillUnmount() {
  }

  UNSAFE_componentWillUpdate() {
  }

  renderTab() {
  }
      
  render() {
    let batchInformation = this.props.navigation.getParam("batchInformation", {});


    return (
      <View style={styles.chickenNav}>
        {/* <View style={styles.header}></View>
        <View style={styles.navigationTab}>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 0)} 
            style={[styles.dormantTab, (this.state.activeTab[0]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>PRODUCE</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 1)} 
            style={[styles.dormantTab, (this.state.activeTab[1]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>FEEDS</Text>
          </TouchableHighlight>
          <TouchableHighlight 
            underlayColor={Theme.PARAGRAPH_COLOR} 
            onPress={this.switchToTab.bind(this, 2)} 
            style={[styles.dormantTab, (this.state.activeTab[2]) ? styles.activeTab : null]}
            >
              <Text style={styles.tabText}>CHICKEN</Text>
          </TouchableHighlight>
        </View>

        <ViewPager
          style={{flex: 1, maxHeight: (Dimensions.get("window").height -150)}}
          initialPage={0}
          onPageSelected={this.switchToTab}
        >
          <View key="0">
            <ProduceTab batchInformation={batchInformation} data={this.state.eggs} />
          </View>
          <View key="1">
            <FeedsTab batchInformation={batchInformation} data={this.state.feeds} />
          </View>
          <View key="2">
            <ChickenTab batchInformation={batchInformation} data={this.state.casualties}/>
          </View>
        </ViewPager>

        <View style={{
          position: "absolute",
          bottom: 40,
          right: 16,
          zIndex: 2,
          alignSelf: "flex-end",
          display: ((this.state.context != 0) ? "flex" : "none"),
        }}>
          <FloatingActionButton context={this.state.context} batchInformation={batchInformation} navigation={this.props.navigation} />
        </View> */}
        <TopTab style={styles.navBar}/>
      </View>
    );
  }
}


let styles = StyleSheet.create({
  chickenNav: {
    height: Dimensions.get("window").height,
  },
  header: {
    height: 50,
  },
  navBar: {
  },
  navigationTab: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dormantTab: {
    padding: 8,
    flex: 1,
  },
  activeTab: {
    padding: 8,
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: Theme.PRIMARY_COLOR_DARK,
  },
  tabText: {
    fontSize: 18,
    textAlign: "center",
    color: Theme.PRIMARY_COLOR_DARK,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  chickenTab: {
    // display: "none",
  },
  productionCard: {
    flex: 1,
    zIndex: 1,
    elevation: 2,
    marginTop: 8,
  },
  produceTab: {
    maxHeight: (Dimensions.get("window").height - 150),
    // maxHeight: 200,
  },
  FAB: {
    position: "absolute",
    bottom: 40,
    right: 16,
    zIndex: 2,
    alignSelf: "flex-end"
  },
});/*
let data = NativeModules.FileManager.fetchWeeker("Batch II", 67);
if(!data) {
  FileManager.write();
} else {
  console.log(data);
}
*/
