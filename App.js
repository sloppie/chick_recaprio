import 'react-native-gesture-handler';

import React, { Component } from 'react';

import HomeSwitch from './routes/HomeSwitch';
import SecurityManager from './utilities/SecurityManager';

new SecurityManager();

export default class App extends Component {

  render() {
    return <HomeSwitch />;
  }

}
