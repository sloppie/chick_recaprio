import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    TouchableHighlight,
    Text,
    // ScrollView,
    FlatList,
    Dimensions,
    // DeviceEventEmitter,
    NativeModules,
} from 'react-native';
import Icon from 'react-native-ionicons';

import Theme from '../../theme/Theme';
// import FileManager from './../../../utilities/FileManager';


export default class FeedsTab extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: null,
    };
  }

  componentDidMount() {
    let context = NativeModules.Sessions.getCurrentSession();
    NativeModules.FileManager.fetchList(context, "feeds", (data) => {
      let parsedData = JSON.parse(data);
      this.setState({
        data: parsedData
      });
    });
    // let data = NativeModules.FileManager.fetchList(context, "eggs");
    // let parsedData = JSON.parse(data);
    // this.setState({
    //   data: parsedData
    // });
  }

  option = () => {
    return (
      <FlatList
        data={this.state.data}
        renderItem={({item}) => <FeedCard week={item.week} weekNumber={item.weekNumber}/>}
      />
    );
  }

  renderWeeks = () => {
  }
  render() {
    return (
      <View>
        {/* <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[2]? "flex": "none",
          }}
        >
          {view}
        </ScrollView> */}
        {this.option()}
      </View>
    );
  }
}


/**
 * This Component displays feeds consumeed respective to the week
 * The object is passed into the Component through `this.props.weekNumber`
 * 
 * ```
 * this.props.data = {
 *  weekNumber: Number,
 *  MON: Number,
 *  ...
 *  // Goes the same for the whole week for any day that feeds were added
 *  ...
 * };
 * ```
 */
export class FeedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  componentDidMount() {
    this.renderedDays = this.renderDays();
  }

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  renderDays = () => {
    let {week} = this.props;
    let renderedWeek = [];
    for(let i=0; i<week.length; i++) {
      renderedWeek.push(
        <View style={FCStyles.day} key={i}>
          <Text style={FCStyles.dayText}>{`${new Date(week[i][1]).getDay()}: ${week[i][0]}`}</Text>
          <Icon style={FCStyles.editIcon} name="create" />
        </View>
      );
    }

    return renderedWeek;
  }

  render() {
    return (
      <View style={FCStyles.card}>
        <TouchableHighlight
          onPress={this.expand}
          style={FCStyles.expand}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={FCStyles.cardInfo}>
              <Text style={FCStyles.title}>WEEK {this.props.weekNumber}</Text>
              <Text style={FCStyles.subtitle}>Total Feeds Consumed: {30}</Text>
            </View>
            <Icon name={this.state.expanded ? "arrow-dropup-circle" : "arrow-dropdown-circle"} style={FCStyles.icon} />
          </View>
        </TouchableHighlight>
        {(this.state.expanded)?this.renderedDays:<View/>}
      </View>
    );
  }
}

let FCStyles = StyleSheet.create({
  card: {
    marginTop: 8,
    padding: 4,
    width: (Dimensions.get("window").width - 16),
    alignSelf: "center",
  },
  expand: {
    backgroundColor: Theme.GRAY,
  },
  cardInfo: {
    flex: 7,
    paddingStart: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  subtitle: {
    fontWeight: Theme.NORMAL_WEIGHT,
  },
  icon: {
    flex: 1,
    textAlignVertical: "center",
    textAlignVertical: "center",
  },
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
    textAlign: "center",
  },
});
