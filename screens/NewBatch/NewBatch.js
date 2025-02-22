import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ToastAndroid,
  Dimensions,
  NativeModules,
} from 'react-native';

import { Button, TextInput, Card, List } from 'react-native-paper';

import FileManager from '../../utilities/FileManager';
import SecurityManager from '../../utilities/SecurityManager';

import Theme from '../../theme';

export default class NewBatch extends Component {

  constructor(props) {
    super(props);

    this.bottomSheetRef = React.createRef();

    this.state = {
      name: "",
      population: "",
      price: "",
      complete: null,
    };

  }

  componentDidMount() {
    this.bottomSheetRef.current.snapTo(0)
  }

  nameChange = (value) => {
    this.setState({
      name: value,
    });
  }

  populationChange = (value) => {
    // type checker
    if (!(/\D+/.test(value))) {
      this.setState({
        population: Number(value),
      });
    }
  }

  getPrice = (value) => {
    let price = Number(value);
    this.setState({
      price
    });
  }

  normalise(name) {
    let splitName = name.split(" ");

    for (let i = 0; i < splitName.length; i++) {
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
      price: this.state.price,
    };

    if (!FileManager.batchExists(construct.name)) {

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
              this.setState({
                construct
              });
              this.bottomSheetRef.current.snapTo(2);
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

  makeBatch = (authenticated) => {
    if (authenticated == true) {
      let { construct } = this.state;
      console.log(JSON.stringify(construct));
      NativeModules.FileManager.create(construct.name, JSON.stringify(construct), (success, err) => {
        if (success) {
          return this.props.navigation.goBack();
        }
      });
    } else {
      ToastAndroid.show("Wrong Password. Unable to authenticate.", ToastAndroid.SHORT)
      this.props.navigation.goBack();
    }
  }

  render() {
    return (
      <View style={styles.screen}>
        <View style={styles.container}>
          <Card style={styles.header}>
            <Card.Title
              style={styles.titleContainer}
              title="Add batch information"
              titleStyle={styles.headerTitle}
              right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
          </Card>
          <TextInput
            theme={Theme.TEXT_INPUT_THEME}
            label="Batch Name"
            mode="outlined"
            style={styles.textInput}
            onChangeText={this.nameChange}
            value={this.state.name}
          />
          <TextInput
            theme={Theme.TEXT_INPUT_THEME}
            label="Population"
            mode="outlined"
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={this.populationChange}
            value={String(this.state.population)}
          />
          <TextInput
            theme={Theme.TEXT_INPUT_THEME}
            label="Initial Cost"
            mode="outlined"
            style={styles.textInput}
            keyboardType="numeric"
            onChangeText={this.getPrice}
            value={String(this.state.price)}
          />
          <Button
            style={styles.button}
            icon="clipboard-check"
            title="create"
            onPress={this.createBatch}
            color={Theme.SECONDARY_COLOR_DARK}
          >
            Create Batch
          </Button>
        </View>
        {/* <Text>{this.state.complete}</Text> */}
        {SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.makeBatch)}
      </View>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    minHeight: Dimensions.get("window").height,
    backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
  },
  container: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    backgroundColor: Theme.WHITE,
    height: "100%",
  },
  header: {
    elevation: 0,
    width: Dimensions.get("window").width,
    borderTopStartRadius: 30,
    borderTopEndRadius: 30,
    paddingBottom: 0,
    marginBottom: 0,
  },
  titleContainer: {
    padding: 0,
    marginBottom: 0,
  },
  headerTitle: {
    // textAlign: "center",
    fontSize: 16,
    color: "#777"
  },
  textInput: {
    alignSelf: "center",
    minWidth: Dimensions.get("window").width - 32,
    maxWidth: Dimensions.get("window").width - 32,
    marginBottom: 8,
  },
  button: {
    alignSelf: "center",
    maxWidth: "60%",
    padding: 8
  }
});
