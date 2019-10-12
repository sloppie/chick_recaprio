import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    FlatList,
    Dimensions,
} from 'react-native';

import { LineChart } from 'react-native-chart-kit';

import Theme from '../../../theme/Theme';

export default class ChickenTab extends Component {
  render() {
    return (
      <View>
        <ScrollView
          style={{
            maxHeight: Dimensions.get("window").height - 150,
            // display: this.state.activeTab[0] ? "flex" : "none",
          }}
        >
          <View style={styles.productionCard}>
            <Text style={{ marginLeft: 8, fontWeight: Theme.HEADER_WEIGHT, fontSize: 18, }}>PRODUCTION CHART</Text>
            <LineChart
              data={{
                labels: ['W01', 'W02', 'W03', 'W04', 'W05', 'W06'],
                datasets: [{
                  data: [
                    1024,
                    999,
                    1111,
                    976,
                    1200,
                    1032,
                  ]
                }]
              }}
              width={Dimensions.get('window').width - 16} // from react-native
              height={220}
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: Theme.PRIMARY_COLOR,
                backgroundGradientFrom: Theme.PRIMARY_COLOR_LIGHT,
                backgroundGradientTo: Theme.PRIMARY_COLOR_LIGHT,
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                alignSelf: "center",
              }}
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({

})