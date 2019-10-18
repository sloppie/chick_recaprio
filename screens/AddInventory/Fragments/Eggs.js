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

export default class Eggs extends Component{
    constructor(props){
        super(props);

        this.state = {
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0",
        };
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
        for(let key in data){
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
        console.log(`This is batch information from AI:\n${batchInformation}`)
        let { population } = batchInformation.population[0];
        if (this.formValidation()){
            console.log(this.formValidation());
    
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
    
            console.log("Egg Number below");
            console.log(JSON.stringify(data, null, 2));
    
            var sum = 0;
            for (let key in data) {
                console.log(data[key]);
                sum += data[key];
            }
    
            console.log(sum);
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

    sendData(data){
        let { batchInformation } = this.props;
        FileManager.addEggs(batchInformation, data);
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
                            this.sendData(finalData);
                        },
                        style: "default",
                    },
                ],
                { cancelable: false }
            );
        }
    }

    render(){
        return (
            <View>
                <Text>Normal Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.NEChange}
                />
                <Text>Broken Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.BEChange}
                />
                <Text>Larger Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.LEChange}
                />
                <Text>Smaller Eggs: </Text>
                <TextInput 
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.SEChange}
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
        borderBottomColor: Theme.PRIMARY_COLOR_DARK,
        borderBottomWidth: 2,
    },   
});
