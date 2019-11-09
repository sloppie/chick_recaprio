import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';

import FileManager from '../../../utilities/FileManager';
import Theme from './../../../theme/Theme';


export default class Card extends Component {
  constructor(props) {
    super(props);

    this.state = {
      age: null
    };
  }

  componentDidMount() {
    let weeks = new FileManager(this.props.batchInformation).calculateWeek();
    let age = (weeks[1])? weeks[0] + 1 : weeks[0];
    this.setState({
      age
    });
  }

  goToBatch = () => {
    requestAnimationFrame(() => {
      let { name } = this.props.batchInformation;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("Chicken");
        }
      });
    });
  }

  render() {
    let { batchInformation } = this.props;
    let len = batchInformation.population.length - 1;
    return (
      <TouchableHighlight
        onPress={this.goToBatch}
        activeOpacity={0.6}
        style={styles.card}
        underlayColor={Theme.PRIMARY_COLOR_DARK}>
        <View>
          <View style={styles.titleHolder}>
            <Text style={styles.name}> {batchInformation.name}</Text>
            <Text style={styles.weekTitle}>{`Week ${this.state.age}, from ${new Date(this.props.batchInformation.population[len].date).toLocaleDateString()}`}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
            }}>
            <Text style={styles.pp}>{Math.round(68.9) + "%"}</Text>
            <Text
              style={{
                fontFamily: "serif",
                textAlignVertical: "center",
                color: "#444",
              }}>{" production"}</Text>
          </View>
          <View style={styles.navigate}>
            <Text style={styles.lpa}>Population: {this.props.batchInformation.population[0].population}</Text>
            <TouchableHighlight
              onPress={this.goToBatch}>
              <View style={{
                flex: 1,
                justifyContent: "center",
              }}>
                <Icon name="arrow-forward" style={styles.arrow} />
              </View>
            </TouchableHighlight>
          </View>
        </View>
      </TouchableHighlight>
    );
  }
}

let styles = StyleSheet.create({
  card: {
    padding: 8,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 10,
    paddingBottom: 10,
    width: (Dimensions.get("window").width - 16),
    alignSelf: "center",
    elevation: 1,
    // backgroundColor: Theme.PRIMARY_COLOR,
    backgroundColor: "#f3f3f3"
  },
  titleHolder: {
    marginBottom: 24,
  },
  name: {
    fontSize: 25,
    color: Theme.HEADER_COLOR,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    width: (Dimensions.get("window").width - 20),
    alignSelf: "center",
    fontWeight: "500",
  },
  weekTitle: {
    color: "#212121",
    fontSize: 16,
    fontStyle: "italic",
  },
  pp: {
    fontFamily: "serif",
    fontWeight: "700",
    color: "#444",
    fontSize: 30,
  },
  navigate: {
    flexDirection: "row",
  },
  lpa: {
    fontSize: 16,
    color: "#212121",
    flex: 4,
  },
  arrow: {
    color: Theme.PRIMARY_COLOR_LIGHT,
  },
});
