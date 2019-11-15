import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    NativeModules,
    Dimensions,
} from 'react-native';

import EmptyInventory from './Fragments/PickUp';
import InventoryManager from '../../utilities/InventoryManager';

export default class PickUp extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            currentInventory: "",
            number: ""
        };
    }

    componentDidMount() {
        try {
            let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory())[0];
            console.log(currentInventory, "current Inventory");
            this.setState({
                currentInventory
            });
        } catch (err) {
            // pass
        }
    }

    getNumber = (trays) => {
        this.setState({
            number: trays
        });
    }

    confirm = () => {
        // let regEx = /d+.d{1,1}/gi;
        // if(regEx.test(this.state.number)) {
        //     console.log(this.state.number);

        // }
        InventoryManager.addPickUp();
    }

    renderScreen = () => {
        if(this.state.currentInventory == [] || this.state.currentInventory == "") {
            return (
                <View style={styles.errorScreen}>
                    <Text style={styles.errorTitle}>Oops, Something went wrong</Text>
                    <Text style={styles.errorBody}>There may be no eggs in your current inventory. Please add inventory to allow for pick up in the future</Text>
                </View>
            );
        } else {
            return (
                <View>
                    <Text style={styles.title}>Existing Inventory</Text>
                    <View style={styles.existingInventory}>
                        <Text style={styles.eggs}>{`Normal Eggs: ${this.state.currentInventory[0]}`}</Text>
                        <Text style={styles.eggs}>{`Broken Eggs: ${this.state.currentInventory[1]}`}</Text>
                        <Text style={styles.eggs}>{`Smaller Eggs ${this.state.currentInventory[2]}`}</Text>
                        <Text style={styles.eggs}>{`Larger Eggs: ${this.state.currentInventory[3]}`}</Text>
                        <Text style={styles.eggs}>{`Total: ${this.state.currentInventory[4]}`}</Text>
                    </View>
                    <TextInput 
                        keyboardType="numeric"
                        onChangeText={this.getNumber}/>
                    <EmptyInventory style={styles.pickUp} label="Empty Inventory" onClick={this.confirm}/>
                </View>
            );
        }
    }

    render() {
        return this.renderScreen();
    }

}

const styles = StyleSheet.create({
    pickUp: {
        position: 'absolute',
        top: 50,
    },
    errorScreen: {
        minHeight: Dimensions.get("window").height,
        justifyContent: "center"
    },
    errorTitle: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "600"
    },
    errorBody: {
        marginTop: 16,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "600",
    },
    existingInventory: {
        maxWidth: (Dimensions.get("window").width - 16),
        alignSelf: "center",
        backgroundColor: "#999",
    },
    eggs: {
        textAlignVertical: "center",
    },
});
