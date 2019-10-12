import React, { Component } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Dimensions} from 'react-native';
import Icon from 'react-native-ionicons';

import Toggle from '../utilities/Toggle';
import Theme from '../../../theme/Theme';

import Week from './Week';

export default class Month extends Component{
  constructor(props){
    super(props);

    this.state = {
      toggle: Toggle.CLOSED,
    };
  }

  renderDates = ()=> {
    let month = this.props.month;
    let days = this.props.days;
    let loop = Math.ceil(days/7);
    let week = [];
    for(let i=0; i<loop; i++){
      let weekConstant = i * 7 + 1;
      let weeksDays = [];
      for(let d=i; d<(i+7); d++){
        if(weekConstant<=days){
          weeksDays.push(weekConstant++);
        }else{
          weeksDays.push(null);
        }
        
      }
      week.push(weeksDays);
    }
    let weeks = [];
    key=0;
    week.forEach((wk)=>{
      weeks.push(<Week style={styles.week} key={key} dates={wk}/>)
      key++;
    }); 

    return <View style={{aspectRatio: 16/10, backgroundColor: Theme.PRIMARY_COLOR_DARK}}>{weeks}</View>;

  }

  toggleStates = () => {
    console.log("Month component Pressed");
    this.setState({
      toggle: (this.state.toggle)? Toggle.CLOSED: Toggle.OPEN,
    });
  }

  renderMonth = (toggleState)=>{
    console.log("Month was rendered again")
    return(
      <View style={styles.month}>
        <View style={styles.monthDetails}>
          <Text style={styles.title}>{this.props.month}</Text>
          <Text style={styles.subTitle}>{", " + this.props.year}</Text>
        </View>
        <View style={styles.dropdown}>
          <Icon style={styles.icon} name={(!this.state.toggle)? "arrow-dropdown": "arrow-dropup"} />
        </View>
      </View>
    );
  }

  render(){
    return(
      <View >
        <TouchableHighlight onPress={this.toggleStates}>
          {this.renderMonth(Toggle.CLOSED)}
        </TouchableHighlight>
        {/* The display mode was chosen because the conditional rendering was taking up too much time */}
        <View style={{display: (!this.state.toggle)? "none": "flex",}}>
          <View style={{flexDirection:"row", justifyContent: "space-between", textAlign: "center", margin: 8}}>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>M</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>T</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>W</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>T</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>F</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>S</Text>
            <Text style={{flex: 1,textAlign: "center", alignSelf: "stretch",}}>S</Text>
          </View>
          <View style={styles.toggle}>
            {
              this.renderDates()
            }
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  month: {
    flex: 1,
    backgroundColor: "#f6f6f6",
    flexDirection: "row",
  },
  monthDetails: {
    flex: 7,
    flexDirection: "row",
  },
  title: {
    paddingLeft: 8,
    textAlignVertical: "center",
    fontSize: 16,
    color: Theme.HEADER_COLOR,
    fontWeight: Theme.HEADER_WEIGHT,
  },
  subTitle: {
    fontWeight: Theme.LIGHT_WEIGHT,
    fontSize: 16,
    textAlignVertical: "center",
    color: Theme.COMMENT_COLOR,
  },
  dropdown: {
    flex: 1,
  },
  toggle: {
  },
  icon: {
    color: Theme.SECONDARY_COLOR,
  },
  week: {
    minWidth: Dimensions.get("window").width,
    // backgroundColor: "blue",
  },
})
