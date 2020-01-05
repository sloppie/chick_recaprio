import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    ToastAndroid,
    StyleSheet,
    Button,
    Dimensions,
} from 'react-native';

import {  
    TextInput
} from 'react-native-paper';

import Theme from '../../../theme/Theme';

import FileManager from '../../../utilities/FileManager';
import SecurityManager from '../../../utilities/SecurityManager';

export default class Casualties extends Component {
    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();
        this.state = {
            date: new Date().toDateString(),
            number: 0,
            description: "",
        };
    }

    handleChange = (value) => {
        this.setState({
            number: Number(value)
        });
    }

    handleDesc = (value) => {
        this.setState({
            description: value
        });
    }

    formatData = () => {
        let {date, number, description} = this.state;

        let finalData = {
            date,
            number,
            description
        };

        let popo = this.props.batchInformation.population[0].population;

        Alert.alert(
            `Confirm casualty count`,
            `The number of chicken dead is: ${number}\nReason being: ${description}\nNew Population: ${popo - number}`,
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        console.log(`useropted to cancel`);
                    },
                    style: "cancel"
                },
                { 
                    text: "Confirm",
                    onPress:() => {
                        this.setState({
                            finalData
                        });
                        this.bottomSheetRef.current.snapTo(1)
                    },
                    style: "default"
                }
            ],
            { cancelable: false }
        );
    }

    sendData = (authenticated) => {
        if(authenticated == true) {
            let { finalData } = this.state;
            FileManager.addCasualties(this.props.batchInformation, JSON.stringify(finalData));
            this.props.navigation.popToTop();
        } else {
            ToastAndroid.show("Unable to authenticate", ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.dateHeader}>
                    <Text style={styles.date}>{this.state.date}</Text>
                </View>
                <TextInput 
                    label="Number"
                    onChangeText={this.handleChange}
                    style={styles.textInput}
                    keyboardType="numeric"
                    value={(this.state.number)?String(this.state.number):""}
                />
                <TextInput
                    label="Cause of Death" 
                    onChangeText={this.handleDesc}
                    value={this.state.description}
                    style={styles.textInput}
                />
                <Button 
                    title="submit"
                    onPress={this.formatData}
                />
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.sendData) }
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
    screen: {
        minHeight: "100%"
    },
    dateHeader: {
        padding: 16,
        elevation: 1,
        alignContent: "center",
    },
    date: {
        fontSize: 20,
        fontWeight: "600"
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
