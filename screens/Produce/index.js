import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableHighlight,
    // ScrollView,
    FlatList,
    Dimensions,
    // DeviceEventEmitter,
    NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';

import Theme from '../../theme/Theme';


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
      // console.log(data);
        let parsedData = JSON.parse(data);
        this.setState({
            data: parsedData,
          });
        });
  }

  componentWillUnmount() {
  }

  option = () => {
    if(this.state.data) {
      return (
        <FlatList
            data={this.state.data}
            renderItem={({item}) => <WeeklyCard week={item.eggs} weekNumber={item.weekNumber}/>}/>
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


class EWC extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  render() {
    return (
      <View style={{
        elevation: 2,
        display: this.state.visible ? "flex" : "none",
      }}>
        <View style={EWCStyles.card}>
          <Button
            title="Show"
            onPress={() => {
              this.setState({
                visible: !this.state.visible,
              });
            }}
          />
        </View>
      </View>
    );
  }
}

let EWCStyles = StyleSheet.create({
  card: {
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
    backgroundColor: Theme.PRIMARY_COLOR_DARK,
  },
});

/**
 * 
 * This Component displays Eggs produce per day and is grouped with weeks
 * `this.props.weekNumber` contains the week's object
 * ```js
 *  this.props.weekNumber = {
 *    weekNumber: Number,
 *    MON: {
 *      normalEggs: Number,
 *      brokenEggs: Number,
 *      largerEggs: Number,
 *      smallerEggs: Number,
 *    },
 *    ...
 *    // Goes on the same for all other days of the week
 *    ...
 *  };
 * ```
 */
export class WeeklyCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      expandDayCard: false,
    };
  }

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  feedsCard = () => {

  }

  renderDays = () => {
    let {week} = this.props;
    let days = [];
    if(week) {
      for(let i=0; i<week.length; i++) {
        /**
         *  [normalEggs, brokenEggs, smallerEggs, largerEggs] 
         */
        days.push(
          <View style={WCStyles.day} key={i}>
            <Text style={WCStyles.dayText}>{week[i][4]}</Text>
            <TouchableHighlight onPress={() => { console.log("Hello") }}>
              <Icon name="create" style={WCStyles.editIcon} />
            </TouchableHighlight>
          </View>
        );
      }
    }

    return days;
  }

  render() {
    let copiedStyles = Object.create(WCStyles.expanded);
    let sum = 0;
    this.props.week.forEach((data) => {
      sum += data[4];
    });
    copiedStyles.display = this.state.expanded ? "flex" : "none";
    return (
      <View style={WCStyles.card}>
        <TouchableHighlight onPress={this.expand} >
          <View style={WCStyles.summary}>
            <View style={WCStyles.cardInfo}>
              <Text style={WCStyles.cardTitle}>WEEK {this.props.weekNumber}</Text>
              <Text style={WCStyles.totalTally}>Total eggs produced: {sum}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={WCStyles.expand} />
          </View>
        </TouchableHighlight>
        <View style={copiedStyles}>
          {this.renderDays()}
        </View>
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
    // textAlignVertical: "center",
    textAlign: "center",
  },
});
