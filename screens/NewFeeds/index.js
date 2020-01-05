import React, { PureComponent } from 'react';
import {
    View,
    Text,
    ToastAndroid,
    StyleSheet,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

import Icon from 'react-native-ionicons';
import { TextInput, Button } from 'react-native-paper';
import SecurityManager from '../../utilities/SecurityManager';

export default class NewFeeds extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

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

        // InventoryManager.addFeeds(feedsObject);
        console.log("Was able to authenticate");
        this.props.navigation.pop();
    }

    authenticate = (authenticated) => {
        if(authenticated) {
            this.restock();
        } else {
            ToastAndroid.show("Unable to verify password. Please try again");
            this.props.navigation.pop();
        }
    }

    callBottomSheet = () => {
        this.bottomSheetRef.current.snapTo(1);
    }

    render() {
        return (
            <View style={styles.screen}>
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
                    onPress={this.callBottomSheet}>
                        <Text>New Feeds</Text>
                </Button>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    },
});
