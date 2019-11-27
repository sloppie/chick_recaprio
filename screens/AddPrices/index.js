import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Alert,
    StyleSheet,
    Dimensions,
} from 'react-native';

import {
    TextInput,
    Button,
} from 'react-native-paper';

import InventoryManager from '../../utilities/InventoryManager';


export default class AddPrices extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            normalEggs: "",
            largerEggs: "",
            smallerEggs: "",
            brokenEggs: ""
        };
    }

    getNormal = (value) => {
        this.setState({
            normalEggs: Number(value)
        });
    }

    getBroken = (value) => {
        this.setState({
            brokenEggs: Number(value)
        });
    }
    getLarger = (value) => {
        this.setState({
            largerEggs: Number(value)
        });
    }
    getSmaller = (value) => {
        this.setState({
            smallerEggs: Number(value)
        });
    }
    alert = () => {
        Alert.alert(
            "Invalid Price",
            "The price is too low!",
            [
                {
                    text: "Cancel",
                    onPress: () => {
                        this.props.navigation.pop();
                    }
                },
                {
                    text: "Adjust",
                    onPress: () => {},
                },
            ],
            {cancelable: true},
        );
    }

    addPrices = () => {
        let pickUp = this.props.navigation.getParam("pickUp", {
            pickUp: null
        });
        if(pickUp) {
            let {
                normalEggs,
                largerEggs,
                smallerEggs,
                brokenEggs
            } = this.state;

            if(normalEggs > 0) {
                let price = {
                    normalEggs,
                    largerEggs,
                    smallerEggs,
                    brokenEggs
                };
    
                pickUp.price = price;
                console.log(price);
                InventoryManager.addPrices(pickUp);
                this.props.navigation.pop();
            } else {
                this.alert();
            }
        }
    }

    render() {
        return (
            <View style={styles.screen}>
                <View style={styles.inputContainer}>
                    <TextInput
												value={String(this.state.normalEggs)}
                        style={styles.input}
                        editable={true}
                        label="Normal Eggs"
                        onChangeText={this.getNormal}
                        keyboardType="numeric"
                    />
                    <TextInput
												value={String(this.state.smallerEggs)}
                        style={styles.input}
                        editable={true}
                        label="Smaller Eggs"
                        onChangeText={this.getSmaller}
                        keyboardType="numeric"
                    />
                    <TextInput
												value={String(this.state.largerEggs)}
                        style={styles.input}
                        editable={true}
                        label="Larger Eggs"
                        onChangeText={this.getLarger}
                        keyboardType="numeric"
                    />
                    <TextInput
												value={String(this.state.brokenEggs)}
                        style={styles.input}
                        editable={true}
                        label="Broken Eggs"
                        onChangeText={this.getBroken}
                        keyboardType="numeric"
                    />
                </View>
                <Button 
                    mode="text"
                    onPress={this.addPrices}>
                        <Text>ADD PRICES</Text>
                </Button>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    screen: {},
    inputContainer: {
        marginTop: 8,
        maxWidth: (Dimensions.get("window").width - 32),
        minWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
    },
    input: {
        marginBottom: 8,
    },
});
