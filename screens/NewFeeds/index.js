import React, { PureComponent } from 'react';
import {
    View,
    Text,
    ToastAndroid,
    StyleSheet,
    Dimensions,
} from 'react-native';

import { TextInput, Button, List, Divider } from 'react-native-paper';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import SecurityManager from '../../utilities/SecurityManager';

export default class NewFeeds extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            number: 0,
            type: "",
            price: 0,
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
        let { price, number, type } = this.state;

        let feedsObject = {
            type,
            price,
            number,
        };

        InventoryManager.addFeeds(feedsObject);
        ToastAndroid.show(`${this.state.type} was added successfully`, ToastAndroid.SHORT);
        this.props.navigation.pop();
    }

    authenticate = (authenticated) => {
        if (authenticated) {
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
                <List.Item 
                    title="Add a new feeds type"
                    description="Enter details on the new feedstype below Name, stock size, etc."
                    left={props => <List.Icon {...props} icon="card-text" />}
                />
                <Divider />
                <List.Section
                    title="Feeds details"
                />
                <TextInput
                    onChangeText={this.getType}
                    label="Feeds Name"
                    placeholder="Enter feeds name here"
                    mode="outlined"
                    style={styles.textInput}
                />
                <TextInput
                    label="Initial quantity"
                    placeholder="Initial quantity goes here"
                    keyboardType="decimal-pad"
                    onChangeText={this.getQuantity}
                    mode="outlined"
                    style={styles.textInput}
                />
                <TextInput
                    label="Feeds price"
                    placeholder="Feeds price goes here"
                    keyboardType="numeric"
                    onChangeText={this.getPrice}
                    mode="outlined"
                    style={styles.textInput}
                />
                <Button
                    icon="plus"
                    title="Restock"
                    mode="outlined"
                    label={true}
                    onPress={this.callBottomSheet}
                    style={styles.button}
                >
                    <Text>Add New Feed Type</Text>
                </Button>
                {SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate)}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    },
    textInput: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
    button: {
        marginTop: 8,
        width: "60%",
        padding: 8,
        alignSelf: "center",
    },
});
