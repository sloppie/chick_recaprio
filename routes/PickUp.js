import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

//screens
import PickUp from '../screens/PickUp';
import EmptyInventory from '../screens/EmptyInventory';
import AddPrices from '../screens/AddPrices';


const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: PickUp,
            navigationOptions: {
                headerTitle: "Pick Up",
            }
        },
        EmptyInventory: {
            screen: EmptyInventory,
            navigationOptions: {
                headerTitle: "Empty Inventory"
            },
        },
        AddPrices: {
            screen: AddPrices,
            navigationOptions: {
                headerTitle: "Add Prices"
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                color: "#444",
                elevation: 0
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#444",
            },
        },
    }
);

export default createAppContainer(StackNavigator);
