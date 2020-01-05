import React, { PureComponent } from 'react';
import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Title,
    Card,
    List,
} from 'react-native-paper';


export default class BatchSettings extends PureComponent {

    render() {
        return (
            <View style={styles.screen}>
                <Title>This is the Batch Settings</Title>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
    },
});
