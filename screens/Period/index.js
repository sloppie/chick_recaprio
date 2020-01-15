import React, { Component } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Dimensions,
  NativeModules,
} from 'react-native';

import { Card, Title, Colors } from 'react-native-paper';
import { StackedBarChart } from 'react-native-chart-kit';
import { ProgressCircle } from 'react-native-svg-charts';

import DATE from '../../utilities/Date';
import MortalityRate from '../../utilities/MortalityRate';

const chartConfig = {
  backgroundColor: Colors.white,
  backgroundGradientFrom: Colors.white,
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: Colors.white,
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(255, 0, 0, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 1.0,
  paddingTop: 8,
  propsForBackgroundLines: {
    color: Colors.white,
  },
  style: {
    paddingTop: 8,
  },
};

let bCD = {
  labels: [],
  legend: ["Illness", "Crowding", "Canibalism", "Unknown"],
  data: [],
  barColors: [Colors.amber500, Colors.green500, Colors.blue500, Colors.red500],
};


export default class CasualtiesTab extends Component {

  constructor(props) {
    super(props);

    this.state = {
      beginning: "",
      batchName: "",
      px: "0",
      barChartData: bCD,
    };
  }

  componentDidMount() {
    this.forceUpdate();
  }

  forceUpdate = async () => {
    let beginning = DATE.stringify(7);
    let batchName = NativeModules.Sessions.getCurrentSession();
    let mortalityRate = new MortalityRate(batchName);
    let px = `${mortalityRate.calculate(beginning)}`;
    let barChartData = await mortalityRate.casualtyManager();

    this.setState({
      beginning,
      batchName,
      px,
      barChartData
    });
  }

  reformat_px(value) {
    let answer;
    if(value == "1" || value == "0") {
      answer = 100;
    } else {
      let newValue = value.split("");
      newValue.forEach((num, index) => {
        if(index == 0) {
          answer = num;
        } else if(index > 7) {
        } else if(index == 1){
          answer += ".";
        } else {
          answer += num;
        }
      });
      // answer = `${newValue[0]}.${newValue[2]}${newValue[3]}${newValue[4]}${newValue[5]}${newValue[6]}${newValue[7]}`;
      answer = Number(answer) * 100;
      console.log(`reformatted_px: ${answer}`)
    }

    return `${answer}%`;
  }

  render() {
    let screenWidth = Dimensions.get("window").width;
    return (
      <ScrollView style={styles.screen}>
        <Card>
          <Card.Title title="Casualties graph" subtitle="A stacked graph for death, with respect to their causes" />
          <Card.Content>
            <StackedBarChart
              style={styles.graph}
              chartConfig={chartConfig}
              data={this.state.barChartData}
              width={(screenWidth - 32)}
              height={220}
              withInnerLines={false}
              hideLegend={true}
            />
          </Card.Content>
        </Card>
        <Card>
          <Card.Title title="Survival Probability" subtitle="Survival for probability for the remaining batch" />
          <Card.Content>
            <ProgressCircle
              style={styles.progressCircle}
              progress={this.state.px}
              progressColor={`rgba(${String(Number(0xa5))},${String(Number(0xd6))}, ${String(Number(0xa7))}, 1)`}
              animate={true}
              animateDuration={2}
            />
            <Title style={styles.px}>{this.reformat_px(this.state.px)}</Title>
          </Card.Content>
        </Card>
      </ScrollView>
    );
  }

}

const styles = StyleSheet.create({
  screen: {
    minHeight: "100%",
  },
  graph: {
    alignSelf: "center",
    padding: 8,
  },
  progressCircle: {
    height: 220,
  },
  px: {
    textAlign: "center",
  },
});
