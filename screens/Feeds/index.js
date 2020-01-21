import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Dimensions,
    NativeModules,
} from 'react-native';
import { List, Title } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Theme from '../../theme';

import { switchToWeekInFeeds } from '../../routes/HomeRoute';


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
        this.setState({
          data: [],
        });
      }
      }); 
  }

  option = () => {
    if(this.state.data) {
      if(this.state.data.length == 0) {
        return (
          <View style={{justifyContent: "center", height: "100%"}}>
            <Icon 
              style={styles.noData}
              size={40}
              name="weather-windy"
              color={Theme.SECONDARY_COLOR_DARK}
            />
            <Title style={styles.noDataTitle}>Such emptiness :(</Title>
          </View>
        );
      }
      return (
        <View>
          <FlatList
            data={this.state.data}
            renderItem={({item}) => <FeedCard week={item.week} weekNumber={item.weekNumber}/>}
          />
        </View>
      );
    } else {
      return(
          <View style={{justifyContent: "center", height: "100%"}}>
            <ActivityIndicator 
              animating={true}
              color={Theme.PRIMARY_COLOR_LIGHT}
            />
          </View>
      );
    }
  }

  renderWeeks = () => {
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
  FAB: { 
    position: "absolute", 
    alignSelf: "flex-end", 
    bottom: 100, 
    right: 16, 
    zIndex: 2 
  },
  noData: {
    textAlign: "center",
  },
  noDataTitle: {
    textAlign: "center",
    color: Theme.APP_BAR_HEADER_COLOR,
    fontSize: 24,
  },
});


export class FeedCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      sum: 0,
    };
  }

  componentDidMount() {
    // this.renderedDays = this.renderDays();
    let sum = 0;
    let { week } = this.props;
    for(let i=0; i<week.length; i++) {
      sum += week[i][1];
    }

    this.setState({
      sum,
    });
    this.sum = sum;
  }

  viewFullWeek = () => {
    let params = {
      week: this.props.week,
      weekNumber: this.props.weekNumber,
    }

    switchToWeekInFeeds(params);
  }

  render() {
    return (
      <View style={FCStyles.card}>
        <List.Item
          title={`Week ${this.props.weekNumber}`}
          description={`Total feeds consumed: ${this.state.sum}`}
          left={props => <List.Icon  {...props} icon="clipboard-outline" color={Theme.PRIMARY_COLOR}/>}
          right={props => <List.Icon {...props} icon="arrow-right" color={Theme.PRIMARY_COLOR_LIGHT} />}
          onPress={this.viewFullWeek}
        ></List.Item>
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
});
