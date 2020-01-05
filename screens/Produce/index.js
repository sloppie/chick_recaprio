import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ScrollView,
  FlatList,
  Dimensions,
  // DeviceEventEmitter,
  NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';

import Theme from '../../theme/Theme';

import { orderFinder } from './utilities';
import { TouchableRipple, Colors, Title, Caption, Divider } from 'react-native-paper';

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
          data: {},
        });
      }
    });
  }

  componentWillUnmount() {
  }

  option = () => {
    if (this.state.data) {

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
    } else {
      return <Text>Loading List...</Text>
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


export class WeeklyCard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      expandDayCard: false,
    };
  }

  viewWeek = () => {
    let params = {
      week: this.props.week,
      weekOrder: this.props.weekOrder,
      weekNumber: this.props.weekNumber
    };

    switchToEggWeek(params);
  }

  render() {
    let sum = 0;
    this.props.week.forEach((data) => {
      if (data != null)
        sum += data[4];
    });
    let trays = InventoryManager.findTrays(String(sum)).split(".");
    return (
      <View style={WCStyles.card}>
        <TouchableRipple
          style={WCStyles.week}
          onPress={this.viewWeek}
          color={Colors.amber500}>
          <View style={WCStyles.weekHolder}>
            <Icon name="clipboard" style={WCStyles.weekIcon} />
            <View style={WCStyles.weekInfo}>
              <Title>WEEK {this.props.weekNumber}</Title>
              <Caption>Total: {InventoryManager.findTrays(String(sum))}: Trays: {trays[0]} Extra Eggs: {trays[1]}</Caption>
              <Divider />
            </View>
          </View>
        </TouchableRipple>
      </View>
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
  summary: {
    flexDirection: "row",
    backgroundColor: Theme.GRAY,
  },
  cardInfo: {
    flex: 7,
    paddingStart: 8,
  },
  cardTitle: {
    fontWeight: Theme.HEADER_WEIGHT,
    fontSize: 16,
  },
  totalTally: {
    fontWeight: Theme.NORMAL_WEIGHT,
  },
  expand: {
    flex: 1,
    textAlignVertical: "center",
    textAlign: "center",
  },
  expanded: {},
  day: {
    padding: 8,
    flexDirection: "row",
    borderBottomWidth: 2,
    borderBottomColor: Theme.GRAY,
  },
  dayText: {
    flex: 4,
  },
  editIcon: {
    flex: 1,
    color: Theme.PRIMARY_COLOR,
    textAlign: "center",
  },
  weekHolder: {
    flexDirection: "row",
  },
  weekIcon: {
    flex: 1,
    textAlignVertical: "center",
    marginEnd: 8,
  },
  week: {
    minWidth: (Dimensions.get("window").width - 32),
    maxWidth: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    backgroundColor: "#f4f4f4",
    paddingStart: 8,
  },
  weekInfo: {
    flex: 8,
    alignSelf: "stretch",
  },
});
