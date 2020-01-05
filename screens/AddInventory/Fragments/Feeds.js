import React, { Component } from 'react';
import {
    View,
    Text,
    Alert,
    Button,
    ToastAndroid,
    StyleSheet,
    Dimensions,
    NativeModules,
} from 'react-native';

import {
    TextInput,
} from 'react-native-paper';

import Theme from '../../../theme/Theme';

import FileManager from '../../../utilities/FileManager';
import InventoryManager from '../../../utilities/InventoryManager';
import SecurityManager from '../../../utilities/SecurityManager';

export default class Feeds extends Component{
    constructor(props){
        super(props);

        this.bottomSheetRef = React.createRef();
        this.state = {
            number: 0,
            date: new Date().toDateString(),
            type: "",
        };

    }

    onInput = (value) => {
        this.setState({
            number: Number(value),
        });
    }

    feedsType = (value) => {
        this.setState({
            type: value
        });
    }

    feedsPrice = (value) => {
        this.setState({
            price: Number(value)
        });
    }

    formatData = () => {
        let {number, date, type, price} = this.state
        let data = {
            date,
            number,
            type, 
            price
        };

        let formatType = InventoryManager.normaliseFeedsName(type);
        if(NativeModules.InventoryManager.typeExists(formatType)) {
            let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            let stockNumber = currentInventory[1][formatType].number;
            let result = stockNumber - number;

            if(result >= 0) {
                return JSON.stringify(data, null, 2);
            } else {
                Alert.alert(
                    "Short on inventory",
                    "The number you entered is greater than the number of feeds in stock.\nTry adding to , or reducing the feeds number",
                    [
                        {
                            text: "Reduce Feeds",
                            onPress: () => {
                                /** Pass */
                            }
                        },
                        {
                            text: "Add to Stock",
                            onPress: () => {
                                this.props.navigation.push("Restock")
                            }
                        }
                    ]
                );

                return;
            }
        }

    }

    sendData = (authenticated) => {
        if(authenticated == true) {
            let data = this.formatData();
            let { batchInformation } = this.props;
            FileManager.addFeeds(batchInformation, data);
            console.log(JSON.stringify(data));
            this.props.navigation.popToTop();
        } else {
            ToastAndroid.show("Unable to verify password. Please try again", ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    alert = () => {
            let data;
            try {
                data = this.formatData();
            } catch (err) {
                data = null;
            }
            if(data) {
                Alert.alert(
                "Confirm Submission",
                `Date: ${this.state.date}\nFeeds Consumed: ${this.state.number}\nType: ${this.state.type}`,
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
                                this.bottomSheetRef.current.snapTo(1);
                            },
                        }
                    ],
                    { cancelable: false }
                );
            }
    }

    render(){
        return (
            <View style={styles.screen}>
                <View style={styles.dateHeader}>
                    <Text>Date: { this.state.date }</Text>
                </View>
                <TextInput
                    label="Number Used"
                    style={styles.textInput}
                    onChangeText={this.onInput}
                    mode="outlined"
                    value={(this.state.number==0)?"": String(this.state.number)}
                    keyboardType="numeric"/>
                <TextInput
                    label="Feeds Type"
                    style={styles.textInput}
                    onChangeText={this.feedsType}
                    keyboardType="default"
                    mode="outlined"
                    value={this.state.type}
                    />
                {/* <Text>Price:</Text>
                <TextInput
                    style={styles.textInput}
                    onChangeText={this.feedsPrice}
                    keyboardType="numeric"
                    /> */}
                <Button 
                    style={styles.button}
                    title="Submit"
                    onPress={this.alert}
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
        minHeight: "100%",
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
        margin: 8,
    },   
});
