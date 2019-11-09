import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

// screens
import Inventory from '../screens/Inventory';
import Restock from '../screens/Restock';
import PickUp from '../screens/PickUp';

import Theme from '../theme/Theme';

const bottomTabNavigator = createMaterialBottomTabNavigator(
    {
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
                headerStyle: {
                    elevation: 0
                },
            },
        },
        Restock: {
            screen: Restock,
            navigationOptions: {
                headerTitle: "Restock",
            }
        },
        PickUp: {
            screen: PickUp
        }
        
    },
    {
		activeColor: "gold",
		inactiveColor: "white",
    },
);

export default createAppContainer(bottomTabNavigator);
