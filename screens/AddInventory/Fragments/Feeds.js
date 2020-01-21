import React, { Component } from 'react';
import {
    Text,
    Picker,
    View,
    SafeAreaView,
    Alert,
    ToastAndroid,
    StyleSheet,
    Dimensions,
    NativeModules,
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
import InventoryManager from '../../../utilities/InventoryManager';
import SecurityManager from '../../../utilities/SecurityManager';

export default class Feeds extends Component{
    constructor(props){
        super(props);

        this.bottomSheetRef = React.createRef();
        this.state = {
            number: 0,
            date: new Date().toDateString(),
            type: "Pick feed type",
        };

    }

    onInput = (value) => {
        this.setState({
            number: Number(value),
        });
    }

    feedsType = (value, index) => {
        this.setState({
            type: value
        });
    }

    feedsPrice = (value) => {
        this.setState({
            price: Number(value)
        });
    }

    renderFeeds = () => {
        let pickerItems = [];
        let feeds = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory())[1];

        for(let i in feeds) {
            let name = InventoryManager.redoFeedsName(i);
            pickerItems.push(
                <Picker.Item label={name} value={name} key={i}/>
            );
        }

        return pickerItems;
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
            ToastAndroid.show("Activity added to batch.", ToastAndroid.SHORT);
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

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <View style={styles.container}>
                    <Card style={styles.header}>
                        <Card.Title
                            style={styles.titleContainer}
                            title={`${this.state.date}`}
                            titleStyle={styles.headerTitle}
                            right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                    </Card>
                    <Caption style={styles.pickerCaption}>Pick feed's type</Caption>
                    <Picker
                        selectedValue={this.state.type}
                        onValueChange={this.feedsType}
                        style={styles.picker}
                        mode="dropdown"
                    >
                        { this.renderFeeds() }
                        <Picker.Item label="Pick feed type" value="Pick feed type"/>
                    </Picker>
                    <TextInput
                        theme={Theme.TEXT_INPUT_THEME}
                        label="Number Used"
                        style={styles.textInput}
                        onChangeText={this.onInput}
                        mode="outlined"
                        value={(this.state.number == 0) ? "" : String(this.state.number)}
                        keyboardType="numeric" 
                    />
                    <Button
                        style={styles.button}
                        onPress={this.alert}
                        mode="text"
                        icon="send"
                        color={Theme.SECONDARY_COLOR_DARK}
                    >
                        Submit
                    </Button>
                </View>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.sendData) }
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
        height: "100%",
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
    pickerCaption: {
        marginTop: 16,
        marginStart: 16,
        width: (Dimensions.get("window").width - 32),
    },
    picker: {
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
        padding: 8,
        width: "45%",
        alignSelf: "center",
    },
});
