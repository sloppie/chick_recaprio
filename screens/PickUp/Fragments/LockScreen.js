import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';

import Icon from 'react-native-ionicons';


export default class LockScreen extends PureComponent {

    render() {
        return (
            <View style={styles.lockScreen}>
                <Icon name="lock" style={styles.lock}/>
                <Text style={styles.warning}>No Inventory ready for pick Up as of now</Text>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    lockScreen: {
        minHeight: Dimensions.get("window").height,
        justifyContent: "center",
    },
    lock: {
        textAlign: "center",
    },
    warning: {
        textAlign: "center",
    },
});
