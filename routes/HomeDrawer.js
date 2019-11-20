import { createAppContainer } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

// routes
import Home from './HomeRoute';
import Inventory from './Inventory';
import Statistics from './Statistics';

// theme
import Theme from '../theme/Theme';

const Drawer = createDrawerNavigator(
    {
        Home: {
            screen: Home,
            navigationOptions: {
                headerTitle: "Home",
                drawerLabel: "Home",
            },
        },
        Inventory: {
            screen: Inventory,
            navigationOptions: {
                headerTitle: "Inventory",
                drawerLabel: "Inventory",
                title: "Inventory",
            },
        },
        Statistics: {
            screen: Statistics,
            navigationOptions: {
                headerTitle: "Statistics",
                drawerLabel: "Statistics",
            }
        }
    },
    {
        minSwipeDistance: 30,
        // overlayColor: Theme.PRIMARY_COLOR_LIGHT,
        // drawerBackgroundColor: Theme.PRIMARY_COLOR,
    }
);

export default createAppContainer(Drawer);
