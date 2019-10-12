import React, { Component } from 'react';
import {
  View,
//   StyleSheet,
  Text,
//   TouchableHighlight,
//   Dimensions,
//   NativeModules,
//   DeviceEventEmitter,
} from 'react-native';
// import { LineChart } from 'react-native-chart-kit';

// import Theme from '../../../theme/Theme';
// import FileManager from './../../../utilities/FileManager';
// const BinaryTree = require("./../../../utilities/DataStructures/BinarySearchTrees").BinarySearchTree;

// let length = 0;

// export default class Casualties extends Component {
//   constructor(props) {
//     super(props);
//     this.data = [[], []]
//     this.state = {
//       rendered: false,
//     }
//   }

//   componentDidMount() {
//   }

//   componentWillUnmount() {
//   }

//   renderGraph = () => {
//     return (
//       <View style={styles.productionCard}>
//         <Text style={{ marginLeft: 8, fontWeight: Theme.HEADER_WEIGHT, fontSize: 18, }}>PRODUCTION CHART</Text>
//         <LineChart
//           data={{
//             labels: [...this.data[0]],
//             datasets: [{
//               data: [...this.data[1]]
//             }]
//           }}
//           width={Dimensions.get('window').width} // from react-native
//           height={220}
//           yAxisLabel={''}
//           chartConfig={{
//             backgroundColor: Theme.PRIMARY_COLOR,
//             backgroundGradientFrom: Theme.PRIMARY_COLOR_LIGHT,
//             backgroundGradientTo: Theme.PRIMARY_COLOR_LIGHT,
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
//             style: {
//               borderRadius: 16
//             }
//           }}
          
//           style={{
//             marginVertical: 8,
//             alignSelf: "center",
//           }}
//         />
//       </View>
//     );
//   }

//   render() {
//     // this.updter();
//     return (
//       // <Flatlist
//       //   data={this.props.data} 
//       //   renderItems={({item}) => <WeeklyCas week={item.casualties} weekNumber={item.weekNumber}/>}
//       // />
//       <View>
//         {/* <ScrollView
//           style={{
//             maxHeight: Dimensions.get("window").height - 150,
//             // display: this.state.activeTab[0] ? "flex" : "none",
//           }}
//         > */}
//         {/* {(this.state.rendered)?this.renderGraph(): <Text style={styles.loadText}>loading graph...</Text>} */}
//         {/* </ScrollView> */}
//       </View>
//     );
//   }
// }

// class WeeklyCas extends React.PureComponent {
//   constructor(props) {
//     super(props);    
//   }

//   renderDays() {
//     let {week} = this.props;
//     let days = [];
//     for(let d in week) {
//       days.renderDays.push(d);
//     }
//   }

//   render() {
//     return(
//       <View>

//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   productionCard: {
//     flex: 1,
//     zIndex: 1,
//     elevation: 2,
//     marginTop: 8,
//   },
//   loadText: {
//     alignSelf: "center",
//     textAlign: "center",
//     textAlignVertical: "center",
//   },
// });

export default class CasualtiesTab extends Component {
  render() {
    return (
      <View>
        <Text>Hey...</Text>
      </View>
    );
  }
}
