import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Alert,
    Dimensions,
    StyleSheet,
    NativeModules,
} from 'react-native';

import { createAppContainer } from 'react-navigation';

import InventoryManager from '../../utilities/InventoryManager';
import Produce from '../Produce';


export default class Inventory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rendered: false
        };
    }

    static navigationOptions = {
        headerTitle: "Inventory"
    };
    
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.rendered;
    }

    componentDidMount() {
        this.currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
        this.feeds = [];
        for(let feedName in this.currentInventory[1]) {
            let feed = [];
            let name = InventoryManager.redoFeedsName(feedName);
            feed.push(name, this.currentInventory[1][feedName].number); 
            this.feeds.push(feed);
        }
        this.renderFeedsInventory();

        this.setState({
            normalEggs: InventoryManager.findTrays(this.currentInventory[0][0]),
            brokenEggs: InventoryManager.findTrays(this.currentInventory[0][1]),
            smallerEggs: InventoryManager.findTrays(this.currentInventory[0][2]),
            largerEggs: InventoryManager.findTrays(this.currentInventory[0][3]),
        });
    }

    renderFeedsInventory = () => {
        let feed = [];
        for(let i=0; i<this.feeds.length; i++) {
            feed.push(<Text key={this.feeds[i][0]} style={styles.eggCategories}>{this.feeds[i][0]}: <Text style={styles.number}>{this.feeds[i][1]}</Text></Text>);
        }
        this.fd = feed;
        this.setState({
            rendered: true
        });
    }

    restockInventory = () => {
        this.props.navigation.navigate("Restock");
    }


    addPickUp = () => {
        Alert.alert(
            "Confirm",
            "Confirm pick up of eggs in inventory today",
            [
                {
                    text: "Deny",
                    onPress: () => {/**Pass */}
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        console.log("Agreed to pick up")
                        // InventoryManager.addPickUp();
                    }
                }
            ],
            {
                cancelable: false,
            }
        );
    }

    render() {
        return (
            <View style={styles.page}>
                <View style={styles.currentInventory}>
                    <View style={styles.currentEggs}>
                        <Text style={styles.currentCardTitle}>Eggs in Stock</Text>
                        <Text style={styles.eggCategories}>Normal Eggs: <Text style={styles.number}>{this.state.normalEggs}</Text></Text>
                        <Text style={styles.eggCategories}>Broken Eggs: <Text style={styles.number}>{this.state.brokenEggs}</Text></Text>
                        <Text style={styles.eggCategories}>Smaller Eggs: <Text style={styles.number}>{this.state.smallerEggs}</Text></Text>
                        <Text style={styles.eggCategories}>Larger Eggs: <Text style={styles.number}>{this.state.largerEggs}</Text></Text>
                    </View>
                    <View style={styles.currentFeeds}>
                        <Text style={styles.currentCardTitle}>Feeds</Text>
                        {(this.state.rendered)?this.fd:<View></View>}
                    </View>
                </View>
                <View style={styles.history}>
                    <View></View>
                </View>
                <View style={styles.fab}>
                </View>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    page: {
        minHeight: Dimensions.get("screen").height
    },
    currentInventory: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 16,
    },
    currentEggs: {
        width: "48%",
        backgroundColor: "#f3f3f3",
        aspectRatio: 1/1,
        borderRadius: 10,
    },
    currentCardTitle: {
        marginBottom: 8,
        textAlign: "center",
        color: "coral",
        fontWeight: "700",
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#999"
    },
    eggCategories: {
        color: "teal",
        marginStart: 8,
        fontSize: 13,
        textAlignVertical: "center",
    },
    number: {
        color: "coral",
        fontSize: 18,
        textAlignVertical: "center",
        fontWeight: "700",
    },
    currentFeeds: {
        backgroundColor: "#f3f3f3",
        width: "48%",
        aspectRatio: 1/1,
        borderRadius: 10
    },
    history: {
        marginStart: 16,
        marginEnd: 16,
        width: (Dimensions.get("window").width - 32),
        height: 30,
        backgroundColor: "#999",
    },
    fab: {
        alignSelf: "flex-end"
    },
    pickUp: {
    },
});
