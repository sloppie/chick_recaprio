import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    Button,
    Dimensions,
    NativeModules,
} from 'react-native';

import {
    TextInput
} from 'react-native-paper';

import Theme from '../../../theme/Theme';

import FileManager from '../../../utilities/FileManager';

export default class Eggs extends Component{

    constructor(props){
        super(props);

        this.state = {
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0",
            todaysCollect: null,
        };
    }

    componentDidMount() {
        if(this.props.batchInformation != null) {
            let { batchInformation } = this.props;
            // console.log(batchInformation.name, "from Eggs  Component");
            let exists = FileManager.checkForRecords(batchInformation, "eggs");
            if(exists) {
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
        for(let key in data) {
            if(key == "todaysCollect") {
                continue;
            }
            let inputData = data[key];
            let splitData = inputData.split(".");
            inputData = splitData;
            inputData[0] = (Number(inputData[0]) * 30);
            if(inputData[1] > 29) {
                let title = "Invalid Data";
                let message = `The data entered for eggs is invalid\n${splitData.join(".")}; value ${splitData[1]} could fill a tray\nSolution:\n\nTry: ${key} = ${Number(splitData[0]) + Math.floor(Number(splitData[1])/30)}.${Number(splitData[1])%30}`;
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
    
            if(sum <= population)
                return JSON.stringify(data, null, 2);
            else{
                let title = "Too many eggs";
                let message = "The values you entered add up to an excess value of eggs: " + sum + "eggs.\n\nConsider revising the values "
                this.reenterValues(title, message);
                return null;
            }
        }
    }

    reenterValues(title, message){
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

    sendData(data, todaysCollect){
        let { batchInformation } = this.props;
        FileManager.addEggs(batchInformation, data, todaysCollect);
        this.props.navigation.popToTop();
    }

    alert = () => {
        this.formValidation();
        let finalData = this.formatData();
        if(finalData){
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
                            console.log("This is todaysColect ", this.state.todaysCollect);
                            this.sendData(finalData, this.state.todaysCollect);
                        },
                        style: "default",
                    },
                ],
                { cancelable: false }
            );
        }
    }

    render(){
				let fixer = (state) => (state == "0.0")? "": state;
        return (
            <View>
                <TextInput 
                    label="Normal Eggs"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.NEChange}
                    value={fixer(this.state.normalEggs)}
                />
                <TextInput 
                    label="Broken Eggs"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.BEChange}
                    value={fixer(this.state.brokenEggs)}
                />
                <TextInput 
                    label="Larger Eggs"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.LEChange}
                    value={fixer(this.state.largerEggs)}
                />
                <TextInput 
                    label="Smaller Eggs"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.SEChange}
                    value={fixer(this.state.smallerEggs)}
                />
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
        margin: 8,
    },   
});
