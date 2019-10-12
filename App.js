import React, { Component } from 'react';
import HomeRoute from './routes/HomeRoute';

import { NativeModules } from 'react-native';
import FileManager from './utilities/FileManager';

 if(!NativeModules.FileManager.batchExists("Batch II")){
   FileManager.write();
 }

export default class App extends Component{
  render(){
    return <HomeRoute />;
  }
}
