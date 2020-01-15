import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    ToastAndroid,
    StyleSheet,
    Dimensions,
    NativeModules,
} from 'react-native';

import {
    TextInput,
    Button,
    List
} from 'react-native-paper';

import Theme from '../../../theme';

import FileManager from '../../../utilities/FileManager';
import DATE from '../../../utilities/Date';
import SecurityManager from '../../../utilities/SecurityManager';

export default class Eggs extends Component {

    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();

        this.state = {
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0",
            todaysCollect: null,
        };

        // this.getDate();
    }

    componentDidMount() {
        if (this.props.batchInformation != null) {
            let { batchInformation } = this.props;
            // console.log(batchInformation.name, "from Eggs  Component");
            let exists = FileManager.checkForRecords(batchInformation, "eggs");
            if (exists) {
                let context = NativeModules.Sessions.getCurrentSession();
                let todaysCollect;
                NativeModules.FileManager.fetchData(context, "eggs", (data) => {
                    todaysCollect = JSON.parse(data);
                    let len = todaysCollect.length - 1;
                    todaysCollect = todaysCollect[len][0];

                    this.setState({
                        todaysCollect,
                    });
                });
            }
        }
    }

    getDate = async () => {
        let date = DATE.getDate();
        this.setState({
            date
        });
        console.log("this is the date --> ", date);
    }

    NEChange = (value) => {
        this.setState({
            normalEggs: value,
        });
    }

    BEChange = (value) => {
        this.setState({
            brokenEggs: value,
        });
    }

    SEChange = (value) => {
        this.setState({
            smallerEggs: value,
        });
    }

    LEChange = (value) => {
        this.setState({
            largerEggs: value,
        });
    }

    formValidation = () => {
        let data = this.state;
        let validatedData = {};
        let globalSum = 0;
        for (let key in data) {
            if (key == "todaysCollect") {
                continue;
            }
            let inputData = data[key];
            let splitData = inputData.split(".");
            inputData = splitData;
            inputData[0] = (Number(inputData[0]) * 30);
            if (inputData[1] > 29) {
                let title = "Invalid Data";
                let message = `The data entered for eggs is invalid\n${splitData.join(".")}; value ${splitData[1]} could fill a tray\nSolution:\n\nTry: ${key} = ${Number(splitData[0]) + Math.floor(Number(splitData[1]) / 30)}.${Number(splitData[1]) % 30}`;
                this.reenterValues(title, message);
                return null;
            }
            let sum = inputData[0] + Number(inputData[1]);
            globalSum += sum;
            validatedData[key] = sum;
        }

        return validatedData;
    }

    formatData = () => {
        let { batchInformation } = this.props;
        let { population } = batchInformation.population[0];
        if (this.formValidation()) {
            let {
                normalEggs,
                brokenEggs,
                largerEggs,
                smallerEggs
            } = this.formValidation();

            let data = {
                normalEggs,
                brokenEggs,
                largerEggs,
                smallerEggs
            };

            var sum = 0;
            for (let key in data) {
                console.log(data[key]);
                sum += data[key];
            }

            if (sum <= population)
                return JSON.stringify(data, null, 2);
            else {
                let title = "Too many eggs";
                let message = "The values you entered add up to an excess value of eggs: " + sum + "eggs.\n\nConsider revising the values "
                this.reenterValues(title, message);
                return null;
            }
        }
    }

    reenterValues(title, message) {
        Alert.alert(
            title,
            message,
            [
                {
                    text: "Revise Values",
                    onPress: () => { console.log("Agreed to revise") }
                }
            ]
        );
    }

    sendData = (authenticated) => {
        if(authenticated == true) {
            let { finalData, todaysCollect } = this.state;
            let { batchInformation } = this.props;
            FileManager.addEggs(batchInformation, finalData, todaysCollect);
            this.props.navigation.popToTop();
        } else {
            ToastAndroid.show("Unable to verify password. Please try again", ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    alert = () => {
        this.formValidation();
        let finalData = this.formatData();
        if (finalData) {
            Alert.alert(
                "Confirm Submission",
                `Normal Eggs: ${this.state.normalEggs.split(".")[0]} trays, ${this.state.normalEggs.split(".")[1]} eggs\nBroken Eggs: ${this.state.brokenEggs.split(".")[0]} trays, ${this.state.brokenEggs.split(".")[1]} eggs\nLarger Eggs: ${this.state.largerEggs.split(".")[0]} trays, ${this.state.largerEggs.split(".")[1]} eggs\nSmaller Eggs: ${this.state.smallerEggs.split(".")[0]} trays, ${this.state.smallerEggs.split(".")[1]} eggs`,
                [
                    {
                        text: "Cancel",
                        onPress: () => {
                            console.log("Cancel Pressed");
                        },
                        style: "cancel",
                    },
                    {
                        text: "Confirm",
                        onPress: () => {
                            this.setState({
                                finalData
                            });
                            this.bottomSheetRef.current.snapTo(1);
                        },
                        style: "default",
                    },
                ],
                { cancelable: false }
            );
        }
    }

    render() {
        let fixer = (state) => (state == "0.0") ? "" : state;
        return (
            <View style={styles.screen}>
                {/* <Text>{DATE.getDate()}</Text> */}
                <List.Item 
                    title={DATE.getDate()}
                    description="Earliest date which eggs weren't added"
                    left={props => <List.Icon {...props} icon="calendar"/>}
                />
                <TextInput
                    label="Normal Eggs"
                    mode="outlined"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.NEChange}
                    value={fixer(this.state.normalEggs)}
                />
                <TextInput
                    label="Broken Eggs"
                    mode="outlined"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.BEChange}
                    value={fixer(this.state.brokenEggs)}
                />
                <TextInput
                    label="Larger Eggs"
                    mode="outlined"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.LEChange}
                    value={fixer(this.state.largerEggs)}
                />
                <TextInput
                    label="Smaller Eggs"
                    style={styles.textInput}
                    mode="outlined"
                    keyboardType="numeric"
                    onChangeText={this.SEChange}
                    value={fixer(this.state.smallerEggs)}
                />
                <Button
                    style={styles.button}
                    title="Submit"
                    mode="text"
                    onPress={this.alert}
                    icon="egg"
                > 
                    Add Inventory
                </Button>
                {SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.sendData)}
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
    screen: {
        minHeight: "100%",
    },
    eggs: {
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },
    textInput: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
        marginBottom: 8,
    },
    button: {
        padding: 8
    }
});
