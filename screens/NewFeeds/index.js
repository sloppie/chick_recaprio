import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

import Icon from 'react-native-ionicons';
import { TextInput, Button } from 'react-native-paper';

export default class NewFeeds extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            number: 0,
        };
    }

    getType = (value) => {
        this.setState({
            type: value,
        });
    }

    getQuantity = (value) => {
        this.setState({
            number: Number(value)
        });
    }

    getPrice = (value) => {
        this.setState({
            price: Number(value)
        });
    }

    restock = () => {
        let { price, number, type} = this.state;

        let feedsObject = {
            type,
            price,
            number,
        };

        InventoryManager.addFeeds(feedsObject);
        this.props.navigation.pop();
    }
    render() {
        return (
            <View>
                <Text>Type:</Text>
                <TextInput
                    onChangeText={this.getType}/>
                <Text>Quantity</Text>
                <TextInput
                    keyboardType="decimal-pad" 
                    onChangeText={this.getQuantity}/>
                <Text>Price</Text>
                <TextInput
                    keyboardType="numeric"
                    onChangeText={this.getPrice}/>
                <Button 
                    icon={<Icon name="add" />}
                    title="Restock"
                    theme="text"
                    mode="contained"
                    label={true}
                    onPress={this.restock}>
                        <Text>New Feeds</Text>
                </Button>
            </View>
        );
    }

}

const styles = StyleSheet.create({

});
