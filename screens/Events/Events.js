import React, { Component } from 'react';
import {View, StyleSheet } from 'react-native';
import Year from './Fragments/Year';
import Theme from '../../theme/Theme';

export default class Events extends Component{
  static navigationOptions = {
    title: "Events",
    headerStyle: {
      backgroundColor: Theme.PRIMARY_COLOR,
      color: Theme.SUBTITLE_COLOR,
    },
    headerTitleStyle: {
      color: Theme.PARAGRAPH_COLOR,
    },
  };

  render(){
    return(
      <View>
        <Year initialMonth="28 March,2018"/>
      </View>
    );
  }
}