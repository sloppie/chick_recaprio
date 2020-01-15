import React, { Component } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Dimensions,
  NativeModules,
  DeviceEventEmitter,
} from 'react-native';
import { List, Title, Divider, Colors, FAB } from 'react-native-paper'

/* Fragments */
import BatchCard from './Fragments/Card';

// utilities
import BalanceSheet from '../../utilities/BalanceSheet';
import Theme from '../../theme';


export default class Home extends React.PureComponent {

  constructor(props) {
    super(props);
    this._isMounted = false;

    let returns = BalanceSheet.balanceEggs();
    this.state = {
      batches: null,
      feedsTotal: [],
      returns,
      profit: 0,
      batchBalanceSheets: null,
      cardsRendered: false
    };
    this.sum = 0;

    this.subscription = DeviceEventEmitter.addListener("update", this.listen);
    this.ref = React.createRef();
    console.log("Constructor got passt")
  }

  getProfit = () => {
    let profit = this.state.returns - this.getFeedsBalance();
    return profit;
  }

  getFeedsBalance = () => {
    let sum = 0;
    if (this.state.batchBalanceSheets) {
      this.state.batchBalanceSheets.forEach((batch: BalanceSheet) => {
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

    let batches = NativeModules.FileManager.fetchBatchNames();
    if (batches !== "" || batches !== ",") {
      batches = batches.split(",");
      batches.pop();
      console.log(batches)
      let batchBalanceSheets = [];
      batches.forEach((batch) => {
        batchBalanceSheets.push(new BalanceSheet(batch));
      });

      this.setState({
        batches,
        batchBalanceSheets
      });
    }
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
          <BatchCard
            key={this.state.batches[i]}
            navigation={this.props.navigation}
            style={styles.card}
            batchName={this.state.batches[i]}
          />
        )
        console.log(this.state.batches[i] + " This is the batch after the fact");
      }
    }

    return cards;
  }

  newBatch = () => {
    this.props.navigation.navigate("NewBatch");
  }

  render() {
    // let renderedCards = this.renderCards();

    return (
      <View style={styles.screen}>
          <ScrollView style={styles.home} >
        <View style={styles.container}>
            <List.Accordion
              theme={Theme.TEXT_INPUT_THEME}
              title="Batches Summary"
              description="Statistical summary on batches"
              style={styles.summaryCard}
            >
              <List.Item
                title={`KSH${this.getFeedsBalance()}`}
                titleStyle={styles.titleStyle}
                description="Amount spent on: feeds, events and etc."
                left={props => <List.Icon {...props} color={Colors.red500} icon="arrow-top-right" />}
                style={styles.summaryItems}
              />
              <List.Item
                title={`KSH${this.state.returns}`}
                titleStyle={styles.titleStyle}
                description="Amount received from eggs sold"
                left={props => <List.Icon  {...props} color={Colors.green600} icon="arrow-bottom-left" />}
                style={styles.summaryItems}
              />
              <List.Item
                title={`KSH${this.getProfit()}`}
                titleStyle={styles.titleStyle}
                description="Net profit"
                style={styles.summaryItems}
                left={props => <List.Icon {...props} color={Colors.green400} icon="cash" />}
              />
            </List.Accordion>
            <Divider style={{ marginBottom: 8 }} />
            {/* <Title style={styles.bil}>Batch Information</Title> */}
            {this.renderCards()}
        </View>
          </ScrollView>
        <FAB
          style={styles.FAB}
          icon="plus"
          onPress={this.newBatch}
        />
      </View>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  home: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    minHeight: "100%",
    maxHeight: "100%",
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
  container: {
    minHeight: Dimensions.get("window").height,
    backgroundColor: Theme.GRAY,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  summaryCard: {
    backgroundColor: Theme.WHITE,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
  },
  summaryItems: {
    backgroundColor: Colors.white,
  },
  titleStyle: {
    fontFamily: "monospace"
  },
  FAB: {
    position: "absolute",
    bottom: 0,
    right: 0,
    margin: 16,
    backgroundColor: Theme.SECONDARY_COLOR_DARK,
  },
});
