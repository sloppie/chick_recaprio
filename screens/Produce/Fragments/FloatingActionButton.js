import React, { Component } from 'react';
import { 
  TouchableHighlight, 
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-ionicons';

import Theme from '../../../theme/Theme';

export default class FloatingActionButton extends Component{
  render(){
    return(
      // <View style={styles.icon}>
        <TouchableHighlight 
          underlayColor="#777"
          style={styles.container}
          onPress={()=>{this.props.navigation.navigate("AddInventory")}}>
            <Icon 
              name="md-add" 
              style={styles.icon} />
        </TouchableHighlight>

      // </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100, 
    minHeight: 64, 
    minWidth: 64, 
    aspectRatio: 1/1,
    elevation: 2,
    backgroundColor: Theme.SECONDARY_COLOR,
    alignContent:"center",
  },
  icon: {
    color: "white", 
    textAlignVertical: "center", 
    textAlign: "center",
    minHeight:64,
    minWidth: 64,
    alignSelf: "center"
  },
})
