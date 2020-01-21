import React, { Component } from 'react';
import {
    Text,
    Picker,
    View,
    SafeAreaView,
    ScrollView,
    Alert,
    ToastAndroid,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {  
    TextInput, 
    Card,
    List,
    Button,
    Caption,
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

    handleDesc = (value, index) => {
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
            <SafeAreaView style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title
                        style={styles.titleContainer}
                        title={`${this.state.date}`}
                        titleStyle={styles.headerTitle}
                        right={props => <List.Icon icon="calendar" color={Theme.PRIMARY_COLOR} />} />
                </Card>
                <ScrollView style={styles.container}>
                    {/* <View style={styles.dateHeader}>
                    <Text style={styles.date}>{this.state.date}</Text>
                </View> */}
                    <TextInput
                        theme={Theme.TEXT_INPUT_THEME}
                        label="Number"
                        onChangeText={this.handleChange}
                        style={styles.textInput}
                        keyboardType="numeric"
                        value={(this.state.number) ? String(this.state.number) : ""}
                        mode="outlined"
                    />
                    <Caption style={styles.pickerCaption}>Pick the cause</Caption>
                    <Picker
                        selectedValue={this.state.description}
                        onValueChange={this.handleDesc}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        <Picker.Item label="Illness" value="Illness"/>
                        <Picker.Item label="Canibalism" value="Canibalism"/>
                        <Picker.Item label="Crowding" value="Crowding"/>
                        <Picker.Item label="Unknown" value="Unknown"/>
                    </Picker>
                    <Button
                        style={styles.button}
                        mode="text"
                        icon="send"
                        onPress={this.formatData}
                        color={Theme.SECONDARY_COLOR_DARK}
                    >
                        Submit
                    </Button>
                </ScrollView>
                {SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.sendData)}
            </SafeAreaView>
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
        minHeight: "100%",
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    container: {
        minHeight: "100%",
        backgroundColor: Theme.WHITE,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
    },
    header: {
        elevation: 1,
        width: Dimensions.get("window").width,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingBottom: 0,
        marginBottom: 0,
    },
    titleContainer: {
        padding: 0,
        marginBottom: 0,
    },
    headerTitle: {
        textAlign: "center",
        fontSize: 16,
        color: "#777"
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
    pickerCaption: {
        marginTop: 16,
        marginStart: 16,
        width: (Dimensions.get("window").width - 32),
    },
    picker: {
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
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
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
    },   
    button: {
        width: "45%",
        padding: 8,
        alignSelf: "center",
    },
});
