import React, { Component } from 'react';
import {
  TouchableHighlight,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-ionicons';

/* Theme colors */
import Theme from '../../../theme/Theme';
import FileManager from '../../../utilities/FileManager';

export default class FloatingActionButton extends Component {
  constructor(props) {
    super(props);

    this.state = {
      context: this.props.context,
    };

    this.pushContext = this.pushContext.bind(this);
  }

  pushContext = () => {
    let { batchInformation } = this.props;
    let { context } = this.state;
    let ac = this.context[context];
    console.log(`this is ${batchInformation}`);
    // !TODO refactor the ternary operator to not be so loose
    return this.props.navigation.navigate(
      "AddInventory",
      {
        context: (this.props.context == 2) ? "Casualties" : (this.props.context == 1) ? "Feeds" : "Eggs",
        batchInformation,
      });
  }

  render() {
    return (
      <TouchableHighlight
        underlayColor="#777"
        style={styles.container}
        onPress={this.pushContext}>
        <Icon
          name="add"
          style={styles.icon} />
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    minHeight: 64,
    minWidth: 64,
    aspectRatio: 1 / 1,
    elevation: 2,
    backgroundColor: Theme.SECONDARY_COLOR,
    alignContent: "center",
  },
  icon: {
    color: "white",
    textAlignVertical: "center",
    textAlign: "center",
    minHeight: 64,
    minWidth: 64,
    alignSelf: "center"
  },
})
