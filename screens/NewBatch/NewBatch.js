import React, { Component } from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  Alert,
  NativeModules,
} from 'react-native';

import {
  TextInput,
} from 'react-native-paper';

import FileManager from '../../utilities/FileManager';

export default class NewBatch extends Component{

  constructor(props){
    super(props);
    this.state = {
      name: "",
      population: "",
      complete: null,
    };
    
  }

  nameChange = (value) => {
    console.log(value);
    this.setState({
      name: value,
    });
  }

  populationChange = (value) => {
    // type checker
    if(!(/\D+/.test(value))){
      this.setState({
        population: Number(value),
      });
    }
  }

  normalise(name){
    let splitName = name.split(" ");

    for(let i=0; i<splitName.length; i++){
      let temp = splitName[i].split("");
      temp[0] = temp[0].toUpperCase();

      splitName[i] = temp.join("");
    }

    return splitName.join(" ");
  }

  /**
   * ```js
   *  {
   *    "name": "Patient Zero",
   *    "population": [
   *      {
   *        "population": 1200,
   *        "date": Number()
   *      }
   *    ]
   *  }
   * ```
   */
  createBatch = () => {
    let population = {
      population: Number(this.state.population),
      date: new Date().getTime(),
    };
    let construct = {
      name: this.normalise(this.state.name),
      population: [population],
      description: this.state.description, 
    };
    
    if(!FileManager.batchExists(construct.name)) {

      this.setState({
        complete: JSON.stringify(construct, null, 2),
      });
  
      Alert.alert(
        'Confirm Batch Information',
        `Batch Name: ${construct.name}\nPopulation: ${this.state.population}\nDate: ${new Date(population.date).toLocaleDateString()}`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'OK', 
            onPress: () => {
              NativeModules.FileManager.create(construct.name, JSON.stringify(construct), (success, err) => {
                if (success) {
                  return this.props.navigation.goBack();
                }
              });
            }
          },
        ],
        { cancelable: false },
      );
    } else {
      Alert.alert(
        "Name already used",
        `${construct.name} already used\nTry using another name.`,
        [
          {
            text: "Okay",
            onPress: () => {
              this.setState({
                name: ""
              });
            },
            style: "default",
          },
        ],
      );
    }
  }

  render() {
    return (
      <View>
        <TextInput 
          label="Batch Name"
          style={styles.textInput}
          onChangeText={this.nameChange}
          value={this.state.name}
        />
        <TextInput
          label="Population"
          style={styles.textInput}
          keyboardType="numeric"
          onChangeText={this.populationChange} 
          value={String(this.state.population)}
          />
        <Button 
          title="create"
          onPress={this.createBatch}
        />
        {/* <Text>{this.state.complete}</Text> */}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  textInput: {
    margin: 8,
  },
});
