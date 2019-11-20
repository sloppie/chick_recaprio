import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// screens
import Home from '../screens/Restock';
import Restock from '../screens/RestockExisting';
import NewFeeds from '../screens/NewFeeds';

let StackNavigator = createStackNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                headerTitle: "Feeds Inventory",
            },
        },
        NewFeeds: {
            screen: NewFeeds,
            navigationOptions: {
                headerTitle: "New Feed Type",
            },
        },
        Restock: {
            screen: Restock,
            navigationOptions: {
                headerTitle: "Restock"
            }
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "#444"
            },
            headerTintColor: "#444",
        },
    }
);

export default createAppContainer(StackNavigator);
