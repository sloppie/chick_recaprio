
import { createAppContainer } from 'react-navigation';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';

import ProduceTab from './../screens/Produce';
import FeedsTab from './../screens/Feeds';
import ChickenTab from './../screens/Period';

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
					swipeEnabled: true,
          style: {
            backgroundColor: Theme.PRIMARY_COLOR_DARK,
          },
        },
        tabBarPosition: 'top',
        swipeEnabled: true,
        animationEnabled: true,
        // lazy: true,
      }
    );


export default createAppContainer(TopTab);
