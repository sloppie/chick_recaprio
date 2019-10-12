import React, { Component } from 'react';
import {
  View, 
  StyleSheet, 
  Dimensions,
  NativeModules,
} from 'react-native';

/* Fragments */
import FAB from './Fragments/FloatingActionButton';
import Card from './Fragments/Card';

// Theme
import Theme from './../../theme/Theme';


export default class Home extends React.PureComponent{
  constructor(props){
    super(props);
    this._isMounted = false;
    this.state = {
      batches: {},
    };

  }
  
  componentDidMount(){
    console.log("Current session --> ", NativeModules.Sessions.getCurrentSession());
    this._isMounted = true;
    this._isMounted && NativeModules.FileManager.fetchBatches((data)=>{
      // console.log(data);
      this.setState({
        batches: JSON.parse(data),
      });
    
    });
    
    // console.log(Object.keys(this.batches));
  }

  setBatches(name, data){
    this.batches[name] = data;
  }

  _parseKey(name){
    return name.toLowerCase().replace(" ", "_");
  }

  componentWillUnmount(){
    this._isMounted = false;
  }

  /**
   * 
   * @param {Component} batchName is the react screenn to be navigated to 
   */
  goToBatch(batchName){
    this.props.navigation.push(batchName);
  }

  static navigationOptions = {
    title: "Chick Ledger",
    headerStyle: {
      backgroundColor: Theme.PRIMARY_COLOR,
      color: "white",
    },
      headerTintColor: "#fff",
      headerTitleStyle: {
        color: "white",
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
      <View style={styles.home}>
        {renderedCards}
        <View style={styles.FAB}>
          <FAB navigation={this.props.navigation}/>
        </View>
      </View>
      );
    }
  }

const styles = StyleSheet.create({
  home: {
    height: Dimensions.get("window").height,
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
  FAB: {
    position: "absolute",
    bottom:100,
    right: 16, 
    alignSelf: "flex-end"
  }, 
});
