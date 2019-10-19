import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Inventory from '../screens/Inventory';
import Theme from '../theme/Theme';

const StackNavigator = createStackNavigator(
    {
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                backgroundColor: Theme.PRIMARY_COLOR_DARK,
                color: "white",
            },
            headerTintColor: "white",
            headerTitleStyle: {
                color: "white",
            },
        },
    },
);

export default createAppContainer(StackNavigator);
