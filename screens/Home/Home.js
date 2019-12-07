import React, { Component } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import { Title, Divider } from 'react-native-paper'

/* Fragments */
import FAB from './Fragments/FloatingActionButton';
import Card from './Fragments/Card';

// Theme
import Theme from './../../theme/Theme';

// utilities
import BalanceSheet from '../../utilities/BalanceSheet';


export default class Home extends React.PureComponent {

  constructor(props) {
    super(props);
    this._isMounted = false;

    let returns = BalanceSheet.balanceEggs();
    this.state = {
      batches: {},
      feedsTotal: [],
      returns,
      profit: 0,
    };
    this.sum = 0;

    this.subscription = DeviceEventEmitter.addListener("update", this.listen);
  }

  getProfit = () => {
    let profit = this.state.returns - this.getFeedsBalance();
    return profit;
  }

  getFeedsBalance = () => {
    let sum = 0;
    if(this.state.batchBalanceSheets) {
      this.state.batchBalanceSheets.forEach((batch:BalanceSheet) => {
        sum += batch.balanceFeeds();
      });
    }

    return sum;
  }

  setFeedsTotal = (number) => {
    this.state.feedsTotal.push(number);
    this.getReturns();
  }

  componentDidMount() {
    this.forceUpdate();
    this.setState({
      returns: BalanceSheet.balanceEggs(),
    });
  }

  componentWillUnmount() {
    this.subscription.remove();
    this._isMounted = false;
  }

  listen = (event) => {
    if (event.done) {
      this.forceUpdate();
    }

  }

  forceUpdate = () => {
    this._isMounted = true;

    let batches = NativeModules.FileManager.fetchBatchNames().split(",");
    batches.pop();
    let batchBalanceSheets = [];
    batches.forEach((batch) => {
      batchBalanceSheets.push(new BalanceSheet(batch));
    });

    this.setState({
      batches,
      batchBalanceSheets
    });
  }

  setBatches(name, data) {
    this.batches[name] = data;
  }

  _parseKey(name) {
    return name.toLowerCase().replace(" ", "_");
  }

  /**
   * 
   * @param {Component} batchName is the react screenn to be navigated to 
   */
  goToBatch(batchName) {
    this.props.navigation.push(batchName);
  }

  static navigationOptions = {
    title: "Chick Ledger",
    headerTitleStyle: {
      color: "#444",
    },
  }

  renderCards = () => {
    let cards = [];

    if (this.state.batches instanceof Array && this._isMounted) {
      for (let i = 0; i < this.state.batches.length; i++) {
        cards.push(
          <Card
            key={this.state.batches[i]}
            navigation={this.props.navigation}
            style={styles.card}
            batchName={this.state.batches[i]}
          />
        )
      }
    }

    return cards;
  }

  render() {
    let renderedCards = this.renderCards();

    return (
      <View>
        <ScrollView style={styles.home}>
          <Title>Batches Summary</Title>
          <View style={styles.summary}>
            <Text style={styles.feedsTotal}>Feeds Expenditure: Ksh{ this.getFeedsBalance() }</Text>
            <Text style={styles.returns}>Returns: Ksh{this.state.returns}</Text>
            <Text style={styles.profit}>Profit: Ksh{this.getProfit()}</Text>
          </View>
          <Divider />
          <Title style={styles.bil}>Batch Information</Title>
          {renderedCards}
        </ScrollView>
        <View style={styles.FAB}>
          <FAB navigation={this.props.navigation} />
        </View>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  home: {
    height: Dimensions.get("window").height - 100,
    // backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
  summary: {
    marginTop: 12,
    marginBottom: 12,
    minWidth: (Dimensions.get("window").width - 32),
    maxWidth: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    padding: 8,
    backgroundColor: "#f3f3f3",
    borderRadius: 10,
    elevation: 1,
  },
  feedsTotal: {
    fontSize: 18,
  },
  returns: {
    fontSize: 18,
  },
  profit: {
    fontSize: 18,
  },
  bil: {
    marginBottom: 8,
    marginTop: 8,
  },
  FAB: {
    alignSelf: "flex-end",
  },
});
