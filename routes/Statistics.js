import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Statistics from '../screens/Statistics';

let Stack = createStackNavigator(
    {
        Statistics: {
            screen: Statistics,
            navigationOptions: {
                headerTitle: "Statistics",
            },
        }
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "$444",
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#444",
            },
        },
    },
);


export default createAppContainer(Stack);
