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

import FAB from './Fragments/FloatingActionButton';
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
    true && NativeModules.FileManager.fetchList(context, "feeds", (data) => {
      // console.log(data);
      try{
        let parsedData = JSON.parse(data);
        this.setState({
            data: parsedData,
          });
        } catch(err) {
        console.log(err);
        this.setState({
          data: {},
        });
      }
      }); 
  }

  option = () => {
    if(this.state.data) {
      return (
        <View>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => <FeedCard week={item.week} weekNumber={item.weekNumber}/>}
          />
          {/* <FAB style={styles.FAB} navigation={this.props.navigation}/> */}
        </View>
      );
    } else {
      return(
        <View>
          <Text>Loading List...</Text>
        </View>
      );
    }
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

const styles = StyleSheet.create({
  FAB: { 
    position: "absolute", 
    alignSelf: "flex-end", 
    bottom: 100, 
    right: 16, 
    zIndex: 2 
  },
});


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
    let sum = 0;
    let { week } = this.props;
    for(let i=0; i<week.length; i++) {
      sum += week[i][1];
    }

    this.sum = sum;
  }

  shouldComponentUpdate() {
    return this.sum
  }

  expand = () => {
    this.setState({
      expanded: !this.state.expanded,
    });
  }

  renderDays = () => {
    let {week} = this.props;
    let renderedWeek = [];
    let days = ["SUN", "MON", "TUE", "WED", "THUR", "FRI", "SAT"];
    for(let i=0; i<week.length; i++) {
      renderedWeek.push(
        <View style={FCStyles.day} key={i}>
          <Text style={FCStyles.dayText}>{`${days[new Date(week[i][0]).getDay()]}: ${week[i][1]}`}</Text> 
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
              <Text style={FCStyles.subtitle}>Total Feeds Consumed: {this.sum}</Text>
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
