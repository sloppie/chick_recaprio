import React, {Component} from 'react';
import {View, Text} from 'react-native';

import Events from '../Events/Events';

export default class Period extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <View>
        <Events />
      </View>
    );
  }
}
