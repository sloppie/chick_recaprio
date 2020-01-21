import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableHighlight,
    ScrollView,
    Alert,
    StyleSheet,
    SafeAreaView,
    NativeModules,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

// fragments
import FeedCard from './Fragments/FeedCard';
import { Title, FAB, Card, List, Button, Colors } from 'react-native-paper';

import Theme from '../../theme';
import { APP_STORE } from '../..';
import { NEW_FEED_TYPE_ADDED } from '../../store';


export default class Restock extends Component {

    constructor(props) {
        super(props);
        this.state = {
            type: null,
            number: null,
            price: null,
            counter: 0,
            current: [],
        };

    }

    componentDidMount() {
        this.fetchCurrentInventory();

        this.currentInventory = APP_STORE.subscribe(NEW_FEED_TYPE_ADDED, this.fetchCurrentInventory.bind(this));
    }

    componentWillUnmount() {
        APP_STORE.unsubscribe(NEW_FEED_TYPE_ADDED, this.currentInventory);
    }

    fetchCurrentInventory = async () => {
        let current = JSON.parse(await NativeModules.InventoryManager.fetchCurrentInventoryAsync());
        this.setState({
            current,
        });
    }

    renderCards() {
        if(this.state.current.length > 0) {
            // let current = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
            let { current } = this.state;
            let feedsInventory = current[1];
            let cards = [];
    
            for (let i in feedsInventory) {
                let type = feedsInventory[i];
                type = [type.date, type.number];
                // new `type` Array = [date, Number, normalisedFeedsName]
                let redoneFeedsName = InventoryManager.redoFeedsName(i);
                type.push(redoneFeedsName);
    
               cards.push(
                   <Card key={i} style={styles.card}>
                       <Title style={styles.cardTitle}>{type[1]}</Title>
                       <Card.Title title={type[2]} subtitle={`Last restock on: ${type[0]}`}/>
                       <Card.Actions>
                           <Button
                                onPress={this.restockFeeds.bind(this, type[2], type[1])}
                                icon="layers-plus"
                                color={Theme.SECONDARY_COLOR_DARK}
                                style={styles.button}
                           >
                               Restock
                            </Button>
                       </Card.Actions>
                   </Card>
               );
            }
    
    
            return cards;
        } else {
            return <View />
        }
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
        if (NativeModules.InventoryManager.typeExists(formattedTypeName)) {
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
                        onPress: () => {/* pass  */ }
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

    restockFeeds = (feedsName, number) => {
        this.props.navigation.navigate("Restock", {
            feedsName,
            number
        });
    }

    confirm = (feedsObject) => {
        InventoryManager.addFeeds(feedsObject);
        this.props.navigation.goBack();
    }

    newFeeds = () => {
        this.props.navigation.navigate("NewFeeds");
    }

    render() {
        // let renderedCards = this.renderCards();
        return (
            <SafeAreaView style={styles.container}>
                <ScrollView style={styles.scrollView} stickyHeaderIndices={[0]}>
                    <View style={styles.headerContainer}>
                        <Card style={styles.header}>
                            <Card.Title
                                style={styles.titleContainer}
                                title="List of feeds in inventory"
                                titleStyle={styles.headerTitle}
                                right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                        </Card>
                    </View>
                    {this.renderCards()}
                </ScrollView>
                <FAB
                    onPress={this.newFeeds}
                    icon="plus"
                    style={styles.fab1}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    card: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
        elevation: 0,
    },
    cardContent: {
    },
    cardTitle: {
        minHeight: 80,
        position: "absolute",
        right: 0,
        top: 0,
        margin: 16,
        fontSize: 50,
        fontWeight: "700",
        textAlignVertical: "bottom",
        color: Theme.PRIMARY_COLOR,
    },
    container: {
        // minHeight: Dimensions.get("window").height,
        height: "100%",
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    header: {
        elevation: 0,
        width: Dimensions.get("window").width,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingBottom: 0,
        marginBottom: 0,
    },
    headerContainer: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    titleContainer: {
        padding: 0,
        marginBottom: 0,
    },
    headerTitle: {
        // textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    scrollView: {
        height: "100%",
        backgroundColor: Theme.WHITE,
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
    },
    view: {},
    fab: {
        position: "absolute",
        bottom: 0,
        width: "30%",
        alignSelf: "flex-end",
        backgroundColor: "coral",
    },
    modal: {
        height: Dimensions.get("window").height,
    },
    modalWrapper: {
        position: "relative",
        top: "20%",
    },
    modalText: {
        fontSize: 17,
        fontWeight: "700",
        textAlign: "center",
    },
    modalFeedsName: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    textInput: {
        alignSelf: "center",
        width: (Dimensions.get("window").width - 32),
        borderBottomColor: "black",
        borderBottomWidth: 1,
    },
    modalBtn: {
        marginTop: 8,
        padding: 16,
        borderRadius: 10,
        backgroundColor: "#f4f4f4",
        //alignSelf: "center",
        //width: 100,
    },
    button: {
        // backgroundColor: Colors.orange300,
        marginStart: 8,
    },
    fab1: {
        position: "absolute",
        margin: 16,
        bottom: 0, 
        end: 0,
        backgroundColor: Theme.SECONDARY_COLOR_DARK,
    }
});
