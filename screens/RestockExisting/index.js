import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ToastAndroid,
    Dimensions
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import { TextInput, List, Button } from 'react-native-paper';
import SecurityManager from '../../utilities/SecurityManager';


export default class RestockExisting extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            number: 0,
            feedType: "",
            previousNumber: 0,
        };
    }

    componentDidMount() {
        let feedType = this.props.navigation.getParam("feedsName", {
            feedsName: ""
        });

        let previousNumber = this.props.navigation.getParam("number", {
            number: 0,
        });

        this.setState({
            feedType,
            previousNumber,
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
        return (
            <View style={styles.screen}>
                <List.Item 
                    title={`Restock on: ${this.state.feedType}`}
                    description="Add details on the added stock size and price of the new stock"
                    left={props => <List.Icon {...props} icon="information"/>}
                />
                <List.Item 
                    title={`${this.state.previousNumber} sacks`}
                    description="Number of sacks remaining in stock"
                    left={props => <List.Icon {...props} icon="card-text"/>}
                />
                <TextInput
                    label="Quantity"
                    mode="outlined"
                    style={styles.textInput}
                    keyboardType="decimal-pad" 
                    onChangeText={this.getQuantity}/>
                <TextInput
                    label="price"
                    mode="outlined"
                    style={styles.textInput}
                    keyboardType="numeric"
                    onChangeText={this.getPrice}/>
                <Button 
                    mode="outlined"
                    icon="plus"
                    style={styles.button}
                    onPress={this.callBottomSheet}
                >
                    Restock
                </Button>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
            </View>
        );
    }

} 

const styles = StyleSheet.create({
    screen: {
        minHeight: Dimensions.get("window").height,
    },
    textInput: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
    button: {
        width: "45%",
        alignSelf: "center",
        padding: 8,
        marginTop: 8,
    },
});
