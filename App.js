import React, { Component } from 'react';

import 'react-native-gesture-handler';

import HomeDrawer from './routes/HomeDrawer';

import SecurityManager from './utilities/SecurityManager';



export default class App extends Component {

  componentDidMount() {
    new SecurityManager();
  }

  render() {
    return <HomeDrawer />;
  }

}
