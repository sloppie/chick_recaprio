import React, { PureComponent } from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    Dimensions
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import { TextInput } from 'react-native-paper';


export default class RestockExisting extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            number: 0,
        };
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
        let { price, number} = this.state;
        let type = this.props.navigation.getParam("feedsName", {
            type: "notAvailable"
        });

        let feedsObject = {
            type,
            price,
            number,
        };

        InventoryManager.addFeeds(feedsObject);
        this.props.navigation.pop();
    }

    render() {
        let { feedsName } = this.props;
        return (
            <View style={styles.screen}>
                <Text>{feedsName}</Text>
                <Text>Quantity</Text>
                <TextInput
                    keyboardType="decimal-pad" 
                    onChangeText={this.getQuantity}/>
                <Text>Price</Text>
                <TextInput
                    keyboardType="numeric"
                    onChangeText={this.getPrice}/>
                <Button 
                    title="Restock"
                    onPress={this.restock}/>
            </View>
        );
    }

} 

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get("window").height,
    },
});
