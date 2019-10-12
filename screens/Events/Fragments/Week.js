import React, { Component} from 'react';
import { View, StyleSheet, Dimensions} from 'react-native';

import Dater from "./Date";
import Theme from './../../../theme/Theme';

export default class Week extends Component{
  render(){
    let week = [];
    for(let i=0; i<7; i++){
      week.push(<Dater key={i} date={this.props.dates[i]}/>);
    }
    return(
      <View style={styles.week}>{week}</View>
    );
  }
}

const styles = StyleSheet.create({
  week: {
    minWidth: Dimensions.get("window").width,
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
});
