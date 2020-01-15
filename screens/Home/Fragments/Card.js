import React, { PureComponent } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableHighlight,
  NativeModules,
} from 'react-native';

import { Title, Caption, Card, List, Button, Colors } from 'react-native-paper';

import BalanceSheet from '../../../utilities/BalanceSheet';
import Theme from '../../../theme';


export default class BatchCard extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      age: null,
      batch: null,
    };
    this.updated = false
  }

  componentDidMount() {
    this.setState({
      batch: new BalanceSheet(this.props.batchName)
    });

  }
  goToBatch = () => {
    requestAnimationFrame(() => {
      let name = this.props.batchName;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("Chicken", {
            eggWeek: this.props.navigation
          });
        }
      });
    });
  }

  addEggs = () => {
      let name = this.props.batchName;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("AddInventory", {
            context: "eggs"
          });
        }
      });
  }

  addFeeds = () => {
      let name = this.props.batchName;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("AddInventory", {
            context: "feeds"
          });
        }
      });
  }

  addCasualties = () => {
      let name = this.props.batchName;
      NativeModules.Sessions.createSession(name, (state) => {
        if (state) {
          this.props.navigation.push("AddInventory", {
            context: "casualties"
          });
        }
      });
  }

  render() {
    if(this.state.batch) {
      return (
        <View>
          <Card onPress={this.goToBatch} style={styles.card} >
            <Card.Title 
              title={this.state.batch.context} 
              titleStyle={styles.headerTitleStyle}
              subtitle={`From: ${this.state.batch.getInitialDate()}`}
            />
            <Card.Content style={styles.cardContent}>
              <View style={styles.infoContainer}>
                <Card style={styles.population}>
                  <Card.Title title="Population" titleStyle={styles.titleStyle}/>
                  <Card.Content>
                    <Title style={styles.numbersStyle}>{this.state.batch.batchInformation.population[0].population}</Title>
                  </Card.Content>
                </Card>
                <Card style={styles.percentage}>
                  <Card.Title title="Productive" titleStyle={styles.titleStyle}/>
                  <Card.Content>
                    <Title style={styles.numbersStyle}>{this.state.batch.eggPercentage()}%</Title>
                  </Card.Content>
                </Card>
              </View>
              <List.Item
                title={`KSH${this.state.batch.balanceFeeds()}`}
                titleStyle={styles.numbersStyle}
                description="Amount spent on feeds"
                left={props => <List.Icon {...props} icon="tag" color={Theme.PRIMARY_COLOR} />}
              />
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                style={styles.button}
                onPress={this.addEggs}
                color={Theme.SECONDARY_COLOR_DARK}
              >
                Add Eggs
                </Button>
              <Button
                style={styles.button}
                onPress={this.addFeeds}
                color={Theme.SECONDARY_COLOR_DARK}
              >
                Add Feeds
                </Button>
              <Button
                style={styles.button}
                onPress={this.addCasualties}
                color={Theme.SECONDARY_COLOR_DARK}
              >
                Add Casualties
                </Button>
            </Card.Actions>
          </Card>
        </View>
      );
    } else {
      return <View></View>
    }
  }
}

const styles = StyleSheet.create({
  card: {
    minWidth: (Dimensions.get("window").width - 32),
    maxWidth: (Dimensions.get("window").width - 32),
    alignSelf: "center",
    marginBottom: 8,
    paddingBottom: 0,
    // backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
  },
  cardContent: {
    paddingBottom: 0,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  population: {
    minWidth: "50%",
    maxWidth: "50%",
    elevation: 0,
    borderEndColor: Theme.PRIMARY_COLOR, 
    borderEndWidth: 1,
    // backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    borderTopEndRadius: 0,
    borderBottomEndRadius: 0,
  },
  percentage: {
    minWidth: "50%",
    maxWidth: "50%",
    elevation: 0,
    // backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
  },
  titleStyle: {
    fontFamily: "monospace",
  },
  headerTitleStyle: {
    fontFamily: "monospace",
    color: Theme.SECONDARY_COLOR_DARK,
    fontWeight: "700",
  },
  numbersStyle: {
    fontFamily: "monospace",
    color: Theme.SECONDARY_COLOR_DARK,
  },
  cardActions: {
    alignSelf: "center",
    borderTopWidth: 2,
    borderTopColor: Theme.PRIMARY_COLOR,
    marginBottom: 0,
    minWidth: (Dimensions.get("window").width - 32),
    maxWidth: (Dimensions.get("window").width - 32),
  },
  eggPercentage: {
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 30,
  },
  button: {
  },
});
