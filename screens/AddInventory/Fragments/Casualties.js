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

export default class Casualties extends Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date().toLocaleDateString(),
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
            `The number of chicken dead is: ${date}\nReason being: ${description}\nNew Population: ${popo - number}`,
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
                    onPress: () => {
                        console.log(JSON.stringify(finalData, null, 2));
                        this.props.navigation.goBack();
                    },
                    style: "default"
                }
            ],
            {cancelable: false}
        );
    }

    render() {
        return (
            <View>
                <Text>{this.state.date}</Text>
                <Text>Number: </Text>
                <TextInput 
                    onChangeText={this.handleChange}
                    style={styles.textInput}
                    keyboardType="numeric"
                />
                <Text>Cause of death:</Text>
                <TextInput 
                    onChangeText={this.handleDesc}
                    style={styles.textInput}
                />
                <Button 
                    title="submit"
                    onPress={this.formatData}
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
