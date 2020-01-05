import 'react-native-gesture-handler';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import Inventory from '../screens/AddInventory';

const Modal = createStackNavigator(
    {
        Add: {
            screen: Inventory,
        },
    },
    {
        mode: "modal",
        defaultNavigationOptions: {
            header: null,
        },
        headerMode: null,
        transparentCard: true, 
    }
);


export default createAppContainer(Modal);