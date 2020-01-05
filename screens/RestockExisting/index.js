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
import SecurityManager from '../../utilities/SecurityManager';


export default class RestockExisting extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

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

        // InventoryManager.addFeeds(feedsObject);
        console.log("Was able to authenticate");
        this.props.navigation.pop();
    }

    authenticate = (authenticated) => {
        if(authenticated == true) {
            this.restock();
        } else {
            ToastAndroid.show('Unable to authenticate. Please try again', ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    callBottomSheet = () => {
        this.bottomSheetRef.current.snapTo(1);
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
                    onPress={this.callBottomSheet}/>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
            </View>
        );
    }

} 

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get("window").height,
    },
});
