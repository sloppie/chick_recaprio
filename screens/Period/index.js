import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  NativeModules,
} from 'react-native';

import { Title } from 'react-native-paper';

import DATE from '../../utilities/Date';
import MortalityRate from '../../utilities/MortalityRate';


export default class CasualtiesTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      beginning: "",
      batchName: "",
      px: 0,
    };
  }

  componentDidMount() {
    let beginning = DATE.stringify(7);
    let batchName = NativeModules.Sessions.getCurrentSession();
    let px = new MortalityRate("One").calculate(beginning);
    console.log(px + " This is the probability of death");
    this.setState({
      beginning,
      batchName,
      px
    });
  }

  render() {
    return (
      <View>
        <Title>{this.state.batchName}</Title>
        <Title>{this.state.px}</Title>
      </View>
    );
  }

}
