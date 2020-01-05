import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Settings from '../screens/Settings';
import NotificationSettings from '../screens/NotificationSettings';
import BatchSettings from '../screens/BatchSettings';
import SecuritySettings from '../screens/SecuritySettings';


const StackNavigator = createStackNavigator(
    {
        Home: {
            screen: Settings,
            navigationOptions: {
                headerTitle: "Settings"
            }
        },
        BatchSettings: {
            screen: BatchSettings,
            navigationOptions: {
                headerTitle: "Batch Settings"
            },
        },
        NotificationSettings: {
            screen: NotificationSettings,
            navigationOptions: {
                headerTitle: "Notification Settings"
            },
        },
        SecuritySettings: {
            screen: SecuritySettings,
            navigationOptions: {
                headerTitle: "Security",
            },
        },
    },
    {
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
            },
            headerTintColor: "#444",
        },
    }
);

export default createAppContainer(StackNavigator);
