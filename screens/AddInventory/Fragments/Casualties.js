import React, { Component } from 'react';
import {
    View,
    ScrollView,
    Text,
    Alert,
    ToastAndroid,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {  
    TextInput, 
    List,
    Button,
} from 'react-native-paper';

import Theme from '../../../theme';

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

        if(number <= 0 || description == "") {
            Alert.alert(
                `Enter all the data fully`,
                `Please make sure all the data entered is correct.\n\t(i)Make sure you have selected from the DESCRIPTION.\t(ii)Make sure the number entered in the casualties is GREATER than 0`,
                [
                    {
                        text: "Ok",
                        onPress: () => {
                            console.log(`useropted to cancel`);
                        },
                        style: "cancel"
                    },
                ],
                { cancelable: true }
            );
        } else {
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
            <ScrollView style={styles.screen}>
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
                <List.Section title="Cause of death">
                    <List.Accordion
                        title={this.state.description}
                        description="Click to choose a cause of death from the choices given below"
                    >
                        <List.Item
                            title="Illness"
                            description="Killed by a known illness"
                            onPress={this.handleDesc.bind(this, "Illness")}
                        />
                        <List.Item
                            title="Canibalism"
                            description="Eaten by other chicken in the population"
                            onPress={this.handleDesc.bind(this, "Canibalism")}
                        />
                        <List.Item
                            title="Crowding"
                            description="Chicken was slept on by others"
                            onPress={this.handleDesc.bind(this, "Crowding")}
                        />
                        <List.Item
                            title="Unknown"
                            description="The cause of death is unknown"
                            onPress={this.handleDesc.bind(this, "Unknown")}
                        />
                    </List.Accordion>
                </List.Section>
                <Button 
                    style={styles.button}
                    mode="outlined"
                    icon="send"
                    onPress={this.formatData}
                >
                    Submit
                </Button>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.sendData) }
            </ScrollView>
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
    button: {
        width: "45%",
        padding: 8,
        alignSelf: "center",
    },
});
