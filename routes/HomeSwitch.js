import 'react-native-gesture-handler';
import { createAppContainer } from 'react-navigation';
import createAnimatedSwitchNavigator from 'react-navigation-animated-switch';

import React from 'react';
import { NativeModules } from 'react-native';

import InitialSetup from './InitialSetup';
import { Transition } from 'react-native-reanimated';
import HomeDrawer from './HomeDrawer';
import Theme from '../theme';
import { Colors } from 'react-native-paper';

let isSetup = NativeModules.InitialSetup.isSetup();


let AnimatedSwitch = createAnimatedSwitchNavigator(
    {
        InitialSetup: {
            screen: InitialSetup,
        },
        HomeDrawer: {
            screen: HomeDrawer,
        },
    },
    {
        // initialRouteName: (isSetup? "HomeDrawer": "InitialSetup"),
        initialRouteName: "HomeDrawer",
        defaultNavigationOptions: {
            headerStyle: {
                color: "#444",
                elevation: 0,
            },
            headerTintColor: "#444",
            headerTitleStyle: {
                color: "#444",
            },
            headerBackground: Colors.teal100,
        },
        transition: (
            <Transition.Together>
                <Transition.Out
                    type="slide-bottom"
                    durationMs={300}
                    interpolation="easeIn"
                />
                <Transition.In 
                    type="fade"
                    durationMs={400}
                />
            </Transition.Together>
        ),
    }
);

export default createAppContainer(AnimatedSwitch);
