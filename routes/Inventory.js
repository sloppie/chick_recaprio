import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs'

// screens
import Inventory from '../screens/Inventory';
import PickUp from './PickUp';
import Restock from './Restock';


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
            screen: PickUp,
            navigationOptions: {
                headerTitle: "Pick Up"
            },
        }
        
    },
    {
		activeColor: "gold",
		inactiveColor: "white",
    },
);

export default createAppContainer(bottomTabNavigator);
