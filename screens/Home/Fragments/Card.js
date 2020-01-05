import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';
import { Title, Caption } from 'react-native-paper';

import FileManager from '../../../utilities/FileManager';
import Theme from './../../../theme/Theme';
import BalanceSheet from '../../../utilities/BalanceSheet';


export default class Card extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      age: null,
      batch: null,
    };
    this.updated = false
  }

  componentDidMount() {
    this.setState({
      batch: new BalanceSheet(this.props.batchName)
    });

  }
  goToBatch = () => {
    requestAnimationFrame(() => {
      let name = this.props.batchName;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("Chicken", {
            eggWeek: this.props.navigation
          });
        }
      });
    });
  }

  render() {
    if(this.state.batch) {
      return (
        <TouchableHighlight
          onPress={this.goToBatch}
          activeOpacity={0.6}
          style={styles.card}
          underlayColor={Theme.PRIMARY_COLOR_DARK}>
          <View>
            <View style={styles.titleHolder}>
              {/* <Text style={styles.name}> {batchInformation.name}</Text> */}
              <Text style={styles.name}> {this.state.batch.context}</Text>
              <Text style={styles.weekTitle}>{`From ${this.state.batch.getInitialDate()}`}</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
              }}>
              {/* <Text style={styles.pp}>{Math.round(68.9) + "%"}</Text> */}
              <Text style={styles.pp}>{this.state.batch.eggPercentage()}%</Text>
              <Text
                style={{
                  fontFamily: "serif",
                  textAlignVertical: "center",
                  color: "#444",
                }}>{" production"}</Text>
            </View>
            <View style={styles.navigate}>
              <Text style={styles.lpa}>Population: {this.state.batch.batchInformation.population[0].population}</Text>
              {/* <TouchableHighlight
                onPress={this.goToBatch}>
                <View style={{
                  flex: 1,
                  justifyContent: "center",
                }}>
                  <Icon name="arrow-dropdown" style={styles.arrow} />
                </View>
              </TouchableHighlight> */}
            </View>
            <View style={styles.feeds}>
              <Caption style={styles.feedsCaption}>Spent on Feeds:</Caption>
              <Title style={styles.feedsCost}>Ksh{ this.state.batch.balanceFeeds() }</Title>
            </View>
          </View>
        </TouchableHighlight>
      );
    } else {
      return <View></View>
    }
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
  feeds: {
    flexDirection: "row"
  },
  feedsCaption: {
    textAlignVertical: "center"
  },
  feedsCost: {
    color: "green"
  },
});
