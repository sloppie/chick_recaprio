import React, { Component } from 'react';

import { NativeModules } from 'react-native';
import FileManager from './utilities/FileManager';
import HomeDrawer from './routes/HomeDrawer';

//  if(!NativeModules.FileManager.batchExists("Batch II")){
//    FileManager.write();
// }

export default class App extends Component {
  render() {
    return <HomeDrawer />;
  }
}
