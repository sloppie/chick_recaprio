import React, { Component, PureComponent } from 'react';
import {
    View,
    ScrollView,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';


export default class Statistics extends PureComponent {

    render() {
        return (
            <ScrollView style={styles.screen}>
                <View style={styles.chicken}>
                    <Text>Chicken</Text>
                </View>
                <View style={styles.finance}></View>
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: Dimensions.get("window").height,
        flex: 1,
    },
    chicken: {
        marginBottom: 16,
        elevation: 1,
    },
    finance: {
        elevation: 1,
    },
});
