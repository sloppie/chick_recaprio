import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Alert,
    StyleSheet,
    Button,
    Dimensions,
} from 'react-native';

import Theme from '../../../theme/Theme';

import FileManager from '../../../utilities/FileManager';

export default class Feeds extends Component{
    constructor(props){
        super(props);

        this.state = {
            number: 0,
            date: new Date().toLocaleDateString(),
        };

    }

    onInput = (value) => {
        this.setState({
            number: Number(value),
        });
    }

    formatData = () => {
        let {number, date} = this.state
        let data = {
            date,
            number,
        };

        return JSON.stringify(data, null, 2);
    }

    sendData = (data) => {
        let { batchInformation } = this.props;
        FileManager.addFeeds(batchInformation, data);
        this.props.navigation.popToTop();
    }

    alert = () => {
        let data = this.formatData();
        Alert.alert(
            "Confirm Submission",
            `Date: ${this.state.date}\nFeeds Consumed: ${this.state.number}`,
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log("Button Cancelled");
                    },
                    style: "cancel",
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        this.sendData(data);
                    },
                }
            ],
            { cancelable: false }
        );
    }

    render(){
        return (
            <View>
                <Text>Date: {this.state.date}</Text>
                <TextInput
                    style={styles.number}
                    onChangeText={this.onInput}
                    keyboardType="numeric"/>
                <Button 
                    style={styles.button}
                    title="Submit"
                    onPress={this.alert}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lockedPage: {
        minHeight: Dimensions.get("window").height,
        alignContent: "center",
        justifyContent: "center",
    },
    info: {
        textAlign: "center",
        color: Theme.HEADER_COLOR,
        fontWeight: Theme.NORMAL_WEIGHT,
    },
    eggs: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },
    textInput: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },   
});
