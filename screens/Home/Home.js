import React, { Component } from 'react';
import {
  View, 
  ScrollView,
  StyleSheet, 
  Dimensions,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';

/* Fragments */
import FAB from './Fragments/FloatingActionButton';
import Card from './Fragments/Card';

// Theme
import Theme from './../../theme/Theme';


export default class Home extends React.PureComponent{

  constructor(props) {
    super(props);
    this._isMounted = false;

    this.state = {
      batches: {},
    };

    this.subscription = DeviceEventEmitter.addListener("update", this.listen);
  }
  
  componentDidMount() {
    this.forceUpdate();
  }
  
  componentWillUnmount() {
    this.subscription.remove();
    this._isMounted = false;
  }
  
  listen = (event) => {
    if(event.done) {
      this.forceUpdate();
    }
  }
  
  forceUpdate = () => {
    this._isMounted = true;
    this._isMounted && NativeModules.FileManager.fetchBatches((data) => {
      let newData = data.replace(',"eggs":', "");
      console.log(newData);
      this.setState({
        batches: JSON.parse(newData),
      });
    
    });
  }

  setBatches(name, data) {
    this.batches[name] = data;
  }

  _parseKey(name) {
    return name.toLowerCase().replace(" ", "_");
  }

  /**
   * 
   * @param {Component} batchName is the react screenn to be navigated to 
   */
  goToBatch(batchName) {
    this.props.navigation.push(batchName);
  }

  static navigationOptions = {
    title: "Chick Ledger",
    // headerStyle: {
    //   color: "white",
    //   elevation: 0
    // },
      // headerTintColor: "#fff",
      headerTitleStyle: {
        color: "#444",
      },
  }

  renderCards = () => {
    let cards = [];

    if(this.state.batches instanceof Object && this._isMounted){
      for(let i in this.state.batches){
        let batchInformation = this.state.batches[i];
        cards.push(
          <Card
            key={batchInformation.name}
            navigation={this.props.navigation}
            style={styles.card}
            batchInformation={batchInformation}/>
          );
      }
    }

    return cards;
  }

  render() {
    let renderedCards = this.renderCards();

    return(
      <View>
        <ScrollView style={styles.home}>
          {renderedCards}
        <View style={styles.FAB}>
          <FAB navigation={this.props.navigation} />
        </View>
        </ScrollView>
      </View>
      );
    }

}

const styles = StyleSheet.create({
  home: {
    height: Dimensions.get("window").height,
    // backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
  FAB: {
    alignSelf: "flex-end"
  }, 
});
