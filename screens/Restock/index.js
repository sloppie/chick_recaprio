import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    TouchableHighlight,
    Alert,
    StyleSheet,
    SafeAreaView,
    NativeModules,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

// fragments
import FeedCard from './Fragments/FeedCard';
import { FAB } from 'react-native-paper';


export default class Restock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null,
            number: null,
            price: null,
            counter: 0,
        };

        this.subscription = DeviceEventEmitter.addListener("update", this.listen);
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.counter > this.state.counter) {
            return true;
        }
    }

    listen = (event) => {
        if (event.done) {
            this.counter();
        }
    }

    counter = () => {
        this.setState({
            counter: (this.state.counter + 1)
        });
    }

    renderCards() {
        let current = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
        console.log(current)
        let feedsInventory = current[1];
        let cards = [];

        for (let i in feedsInventory) {
            let type = feedsInventory[i];
            type = [type.date, type.number];
            // new `type` Array = [date, Number, normalisedFeedsName]
            type.push(i);

            cards.push(<FeedCard
                type={type}
                key={i}
                toggleState={this.toggleState}
                navigation={this.props.navigation} />);
        }


        return cards;
    }

    getName = (name) => {
        this.setState({
            type: name,
        });
    }

    getQuantity = (quantity) => {
        this.setState({
            number: Number(quantity)
        });
    }

    getPrice = (price) => {
        this.setState({
            price: Number(price),
        });
    }

    restock = () => {
        let { type, number, price } = this.state;
        let formattedTypeName = InventoryManager.normaliseFeedsName(type);
        if (NativeModules.InventoryManager.typeExists(formattedTypeName)) {
            let currInv = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            let inventoryNumber = currInv[1][formattedTypeName].number;
            let feedsObject = {
                type,
                number,
                price
            };
            Alert.alert(
                "Confirm adding new feed type",
                `Confirm adding new feed type: ${feedsObject.type}\nPrice: Kshs ${feedsObject.price}\nQuatity: ${feedsObject.number} sacks`,
                [
                    {
                        text: "Revoke",
                        onPress: () => {/* pass  */ }
                    },
                    {
                        text: "Confirm",
                        onPress: () => InventoryManager.addFeeds(feedsObject)
                    },
                ],
                {
                    cancelable: true
                }
            );
        } else {
            let { type, number, price } = this.state;
            let feedsObject = {
                type,
                number,
                price
            };
            Alert.alert(
                "Add new feeds",
                `${this.state.type} do not exist in the inventory. Confirm adding it to inventory.`,
                [
                    {
                        text: "Confirm",
                        onPress: () => {
                            this.confirm(feedsObject);
                        }
                    }
                ]
            );
        }
    }

    confirm = (feedsObject) => {
        InventoryManager.addFeeds(feedsObject);
        this.props.navigation.goBack();
    }

    newFeeds = () => {
        this.props.navigation.navigate("NewFeeds");
    }

    render() {
        let renderedCards = this.renderCards();
        return (
            <SafeAreaView style={styles.container}>
                {renderedCards}
            <FAB 
                onPress={this.newFeeds}
                style={styles.fab1}
                label="New Feeds"/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingTop: 16,
        minHeight: Dimensions.get("window").height
    },
    view: {},
    fab: {
        position: "absolute",
        bottom: 0,
        width: "30%",
        alignSelf: "flex-end",
        backgroundColor: "coral",
    },
    modal: {
        height: Dimensions.get("window").height,
    },
    modalWrapper: {
        position: "relative",
        top: "20%",
    },
    modalText: {
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },
    modalFeedsName: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    textInput: {
        alignSelf: "center",
        width: (Dimensions.get("window").width - 32),
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    modalBtn: {
        marginTop: 8,
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#f4f4f4",
        //alignSelf: "center",
        //width: 100,
    },
    buttonTxt: {
        textAlign: "center",
    },
    fab1: {
        position: "absolute",
        bottom: 150,
        end: 16,
    }
});
