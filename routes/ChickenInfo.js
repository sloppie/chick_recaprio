
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import ProduceTab from './../screens/Chicken/Fragments/ProduceTab';
import FeedsTab from './../screens/Chicken/Fragments/FeedsTab';
import ChickenTab from './../screens/Chicken/Fragments/CasualtiesTab';

import Theme from '../theme/Theme';

    const TopTab = createMaterialTopTabNavigator(
      {
        Produce: {
          screen: ProduceTab,
        },
        Feeds: {
          screen: FeedsTab,
        },
        Chicken: {
          screen: ChickenTab,
        }
      },
      {
        initialRouteName: "Produce",
        tabBarOptions: {
          style: {
            backgroundColor: Theme.PRIMARY_COLOR_DARK,
          },
        },
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        lazy: true,
      }
    );


// export default class Chicken extends Component {
//   static navigationOptions = {
//     title: NativeModules.Sessions.getCurrentSession(),
//   };

//   render() {
//     return createAppContainer(TopTab); 
//   }
// } 
export default createAppContainer(TopTab);