import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

import Event from '../screens/Calendar';
import AddEvent from '../screens/AddEvent';
import Events from '../screens/Events';
import ArchiveEvent from '../screens/ArchiveEvent';


const EventStack = createStackNavigator(
    {
        Event: {
            screen: Event,
            navigationOptions: {
                headerTitle: "Events"
            },
        },
        AddEvent: {
            screen: AddEvent,
            navigationOptions: {
                headerTitle: "Add Event"
            },
        },
        Events: {
            screen: Events,
            navigationOptions: {
                headerTitle: "Events"
            },
        },
        ArchiveEvent: {
            screen: ArchiveEvent,
            navigationOptions: {
                headerTitle: "Archive Event"
            }
        },
    },
    {
        initialRouteName: "Event",
        defaultNavigationOptions: {
            headerStyle: {
                elevation: 0,
                color: "#444"
            },
            headerTintColor: "#444"
        },
    }
);

export default createAppContainer(EventStack);
