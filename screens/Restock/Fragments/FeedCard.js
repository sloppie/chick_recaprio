import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

import InventoryManager from '../../../utilities/InventoryManager';
import { APP_STORE } from '../../..';
import { INVENTORY_FEEDS_ADDED } from '../../../store';


export default class FeedCard extends Component {

    constructor(props) {
        super(props);
        let { type } = this.props;
        // this.props.type structure --> [date, Number, normalisedFeedsName]
        let feedsName = InventoryManager.redoFeedsName(type[2])
        let date = type[0];
        let quantity = type[1];
        this.state = {
            feedsName,
            quantity,
            date
        };
    }

    componentDidMount() {
        this.feedsListener = APP_STORE.subscribe(INVENTORY_FEEDS_ADDED, this.listen.bind(this));
    }

    componentWillUnmount() {
        APP_STORE.unsubscribe(INVENTORY_FEEDS_ADDED, this.feedsListener);
    }

    listen = () => {
        let norm = InventoryManager.normaliseFeedsName(this.state.feedsName);
        let ci = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
        let quantity = ci[1][norm].number;
        let date = ci[1][norm].date;
        this.setState({
            quantity,
            date
        });
    }

    renderCard = () => {
        let norm = InventoryManager.normaliseFeedsName(this.state.feedsName);
        let ci = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
        let quantity = ci[1][norm].number;
        let date = ci[1][norm].date;
        this.setState({
            quantity,
            date
        });
    }

    restock = () => {
        let { feedsName } = this.state;
        this.props.navigation.navigate("Restock", {
            feedsName,
        });
    }

    render() {
        return (
            <View style={styles.card}>
                <Text style={styles.feedsName}>{this.state.feedsName}</Text>
                <Text style={styles.restock}>Last Restock: {this.state.date}</Text>
                <Text style={styles.quantity}><Text style={styles.sizeLabel}>Stock size: </Text>{this.state.quantity}</Text>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.restock}
                    underlayColor="#777" >
                    <Text style={styles.buttonLabel}>RESTOCK</Text>
                </TouchableHighlight>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    card: {
        width: (Dimensions.get("window").width - 16),
        alignSelf: "center",
        backgroundColor: "#f3f3f3",
        borderRadius: 10,
        borderTopLeftRadius: 10,
        elevation: 0,
    },
    feedsName: {
        paddingTop: 8,
        paddingStart: 8,
        fontSize: 20,
        fontWeight: "700",
    },
    restock: {
        paddingStart: 8,
        fontSize: 12,
        fontStyle: "italic",
    },
    quantity: {
        paddingStart: 8,
        fontSize: 16,
        fontWeight: "700",
    },
    sizeLabel: {
        fontWeight: "300",
    },
    button: {
        padding: 8,
        backgroundColor: "teal",
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },
    buttonLabel: {
        textAlign: "center",
        color: "white",
        fontWeight: "700",
    },
});
