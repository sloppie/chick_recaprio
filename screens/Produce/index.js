import React, { Component } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Dimensions,
  NativeModules,
} from 'react-native';

import { orderFinder } from './utilities';
import { Colors, List, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../theme';

import { switchToEggWeek } from '../../routes/HomeRoute';
import InventoryManager from '../../utilities/InventoryManager';


export default class ProduceTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      data: null
    };

  }

  componentDidMount() {
    let context = NativeModules.Sessions.getCurrentSession();
    true && NativeModules.FileManager.fetchList(context, "eggs", (data) => {
      try {
        let parsedData = JSON.parse(data);
        this.weekOrder = orderFinder();
        this.setState({
          data: parsedData,
        });
      } catch (err) {
        this.setState({
          data: [],
        });
      }
      console.log(JSON.stringify(this.state.data) + " this is the data");
    });
  }

  componentWillUnmount() {
  }

  option = () => {
    if (this.state.data !== null) {
      if (this.state.data.length == 0) {
        console.log('WERE HERE')
        return (
          <View style={{justifyContent: "center", height: "100%"}}>
            <Icon 
              style={styles.noDataIcon}
              size={50}
              name="null"
              color={Theme.SECONDARY_COLOR_DARK}
            />
            <Title style={styles.noDataTitle}>I'll wait for you ;)</Title>
          </View>
        );
      } else {
        return (
          <FlatList
            legacyImplementation={true}
            data={this.state.data}
            renderItem={({ item }) =>
              <WeeklyCard
                navigateToEggs={this.props.navigation}
                weekOrder={this.weekOrder}
                week={item.eggs}
                weekNumber={item.weekNumber} />} />
        );
      }
    } else {
      return (
          <View style={{justifyContent: "center", height: "100%"}}>
            <ActivityIndicator 
              animating={true}
              color={Theme.PRIMARY_COLOR}
            />
          </View>
      );
    }
  }

  render() {
    return (
      <View>
        {this.option()}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  noDataIcon: {
    textAlign: "center",
  },
  noDataTitle: {
    textAlign: "center",
    fontSize: 24,
    color: Theme.APP_BAR_HEADER_COLOR,
  },
});


export class WeeklyCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      expandDayCard: false,
    };
  }

  viewWeek = () => {
    requestAnimationFrame(() => {
      let params = {
        week: this.props.week,
        weekOrder: this.props.weekOrder,
        weekNumber: this.props.weekNumber
      };
  
      switchToEggWeek(params);
    });
  }

  render() {
    let sum = 0;

    this.props.week.forEach((data) => {
      if (data != null)
        sum += data[4];
    });

    let trays = InventoryManager.findTrays(String(sum)).split(".");

    return (
      <List.Item
        title={`Week ${this.props.weekNumber}`}
        description={`Trays: ${trays[0]} Extra Eggs: ${trays[1]}`}
        left={props => <List.Icon {...props} icon="clipboard-outline" />}
        right={props => <List.Icon {...props} icon="arrow-right" />}
        onPress={this.viewWeek}
        rippleColor={Colors.blue100}
        style={WCStyles.card}
      />
    );
  }

}

let WCStyles = StyleSheet.create({
  card: {
    flex: 1,
    width: (Dimensions.get("window").width - 16),
    marginTop: 8,
    padding: 4,
    elevation: 1,
    alignSelf: "center",
  },
});
