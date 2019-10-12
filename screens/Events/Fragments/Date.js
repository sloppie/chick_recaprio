import React, { Component } from 'react';
import { View, Text,StyleSheet, TouchableHighlight} from 'react-native';
import Theme from '../../../theme/Theme';

export default class date extends Component{

  render(){
    return(
      <View>
        <TouchableHighlight 
          onPress={()=>{
            console.log("presssed");
          }}
          style={styles.date}>
            {(this.props.date)? <Text style={styles.dateText}>{this.props.date}</Text>: <View></View>}
        </TouchableHighlight>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  date: {
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
    aspectRatio: 1/1,
    padding: 8,
    borderRadius: 100,
  },
  dateText: {
    color: Theme.PARAGRAPH_COLOR,
    fontWeight: Theme.HEADER_WEIGHT,
  },
});
