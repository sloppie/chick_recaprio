import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    Alert,
    StyleSheet,
    SafeAreaView,
    NativeModules,
} from 'react-native';

import InventoryManager from '../../utilities/InventoryManager';


export default class Restock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null,
            number: null,
            price: null,
        };
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
        if(NativeModules.InventoryManager.typeExists(formattedTypeName)) {
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
                        onPress: () => {/* pass  */}
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

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.view}>
                    <Text>Feeds Name:</Text>
                    <TextInput 
                        onChangeText={this.getName}
                        />
                    <Text>Quantity: </Text>
                    <TextInput 
                        keyboardType="numeric"
                        onChangeText={this.getQuantity}/>
                    <Text>Price: </Text>
                    <TextInput 
                        keyboardType="numeric"
                        onChangeText={this.getPrice}/>
                </View>
                <Button 
                    title="Restock"
                    onPress={this.restock}
                    style={styles.fab}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    view: {},
    fab: {
        position: "absolute",
        bottom: 0,
        width: "30%",
        alignSelf: "flex-end",
        backgroundColor: "coral",
    },
});
