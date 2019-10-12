import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';

import Toggle from './../utilities/Toggle';
import PeriodMaker from '../utilities/PeriodMaker';
import Month from './Month';


export default class Year extends Component{
  constructor(props){
    super(props);

    this.state = {
      toggle: Toggle.CLOSED,
    }
  }

  renderMonths(initialMonth){
    let periods = new PeriodMaker().splitMonths(initialMonth);

    let years = [];
    periods.forEach((each)=>{
      let months = [];
      let key = 0;
      each.forEach((month)=>{
        months.push(<Month key={key} month={month[1]} days={month[0]} year={month[2]}/>)
        key++;
      });

      years.push(months);
    });

    return years;
  }

  render(){
    return(
      <ScrollView>
        {this.renderMonths(this.props.initialMonth)}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({

})
