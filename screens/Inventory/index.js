import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

import Eggs from './Fragments/Eggs';
import Feeds from './Fragments/Feeds';

export default class Inventory extends Component {
    static navigationOptions = {
        headerTitle: "Inventory"
    };

    render() {
        return (
            <View>
                <Text>Inventory Will Go Here</Text>
            </View>
        );
    }
}
