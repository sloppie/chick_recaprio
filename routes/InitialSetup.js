import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import InitialSetup from '../screens/InitialSetup';
import Theme from '../theme';

let StackNavigator = createStackNavigator(
    {
        InitialSetup: {
            screen: InitialSetup,
            navigationOptions: {
                headerTitle: "Setup your application"
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                color: "#444",
                elevation: 0,
                backgroundColor: Theme.PRIMARY_COLOR_DARK,
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#333",
            },
        }
    }
);


export default createAppContainer(StackNavigator);