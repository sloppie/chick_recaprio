import React, { Component } from 'react';
import {
    Text,
    Button,
    View,
    ScrollView,
    SafeAreaView,
    ActivityIndicator,
    Alert,
    Dimensions,
    StyleSheet,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import { DataTable, Surface, Title, Card, List } from 'react-native-paper';

import { APP_STORE } from '../../';
import { INVENTORY_FEEDS_ADDED } from '../../store';

import Theme from '../../theme';


export default class Inventory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rendered: false,
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0",
            rendered: false
        };

        this.eggInventoryListen = APP_STORE.subscribe(INVENTORY_FEEDS_ADDED, this.listen.bind(this));
    }

    static navigationOptions = {
        headerTitle: "Inventory"
    };
    
    shouldComponentUpdate(nextProps, nextState) {
        return nextState.rendered;
    }

    
    componentDidMount() {
        this.forceUpdate();
    }

    componentWillUnmount() {
        APP_STORE.unsubscribe(INVENTORY_FEEDS_ADDED, this.eggInventoryListen);
    }

    listen = () => {
        this.forceUpdate();
    }

    forceUpdate = async () => {
        try {
            this.currentInventory = JSON.parse(await NativeModules.InventoryManager.fetchCurrentInventoryAsync());
            this.feeds = [];
            for(let feedName in this.currentInventory[1]) {
                let feed = [];
                let name = InventoryManager.redoFeedsName(feedName);
                feed.push(name, this.currentInventory[1][feedName].number); 
                this.feeds.push(feed);
            }
            this.renderFeedsInventory();
            
            if(!isNaN(this.currentInventory[0][0])) {
                this.setState({
                    normalEggs: InventoryManager.findTrays(this.currentInventory[0][0]),
                    brokenEggs: InventoryManager.findTrays(this.currentInventory[0][1]),
                    smallerEggs: InventoryManager.findTrays(this.currentInventory[0][2]),
                    largerEggs: InventoryManager.findTrays(this.currentInventory[0][3]),
                    rendered: true,
                });
            }
        } catch (err) {
            // pass
        }

    }

    renderFeedsInventory = () => {
        let feed = [];
        for(let i=0; i<this.feeds.length; i++) {
            feed.push(
                <DataTable.Row key={this.feeds[i][0]} theme={Theme.TEXT_INPUT_THEME}>
                    <DataTable.Cell>{this.feeds[i][0]}</DataTable.Cell>
                    <DataTable.Cell numeric>{this.feeds[i][1]}</DataTable.Cell>
                </DataTable.Row>
            );
        }
        this.fd = feed;
        this.setState({
            rendered: true
        });
    }

    restockInventory = () => {
        this.props.navigation.navigate("Restock");
    }


    addPickUp = () => {
        Alert.alert(
            "Confirm",
            "Confirm pick up of eggs in inventory today",
            [
                {
                    text: "Deny",
                    onPress: () => {/**Pass */}
                },
                {
                    text: "Confirm",
                    onPress: () => {
                        console.log("Agreed to pick up")
                    }
                }
            ],
            {
                cancelable: false,
            }
        );
    }

    render() {

        if(this.state.rendered) {
            return (
                <ScrollView style={styles.page} stickyHeaderIndices={[0, 2]}>
                    <View style={styles.headerContainer}>
                        <Card style={styles.header}>
                            <Card.Title
                                style={styles.titleContainer}
                                title="Eggs in inventory"
                                titleStyle={styles.headerTitle}
                                right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                        </Card>
                    </View>
                    <Surface style={styles.dataTable}>
                        <DataTable >
                            <DataTable.Header>
                                <DataTable.Title >Egg Type</DataTable.Title>
                                <DataTable.Title numeric>Full Trays</DataTable.Title>
                                <DataTable.Title numeric>Extra Eggs</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Normal Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.normalEggs.split(".")[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.normalEggs.split(".")[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Broken Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.brokenEggs.split(".")[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.brokenEggs.split(".")[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Smaller Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.smallerEggs.split(".")[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.smallerEggs.split(".")[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell style={styles.dataCell}>Larger Eggs</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.largerEggs.split(".")[0]}</DataTable.Cell>
                                <DataTable.Cell style={styles.dataCell} numeric>{this.state.largerEggs.split(".")[1]}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Surface>
                    <Card style={styles.header}>
                        <Card.Title
                            style={styles.titleContainer}
                            title="Feeds in inventory"
                            titleStyle={styles.headerTitle}
                            right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                    </Card>
                    <Surface style={styles.dataTable}>
                        <DataTable>
                            <DataTable.Header theme={Theme.TEXT_INPUT_THEME}>
                                <DataTable.Title>Feeds Name</DataTable.Title>
                                <DataTable.Title numeric>Stock</DataTable.Title>
                            </DataTable.Header>
                            {this.state.rendered? this.fd: <View />}
                            <DataTable.Pagination 
                                page={0}
                                onPageChange={page => console.log(page)}
                                numberOfPages={2}
                                label="1-2 of 4"
                                onPageChange={(pageNumber) => console.log(pageNumber)}
                            />
                        </DataTable>
                    </Surface>
                </ScrollView>
            );
        } else {
            return (
                <SafeAreaView style={{justifyContent: "center", minHeight: "100%",}}>
                    <ActivityIndicator 
                        color={Theme.PRIMARY_COLOR}
                        animating={true}
                        size="large"
                    />
                </SafeAreaView>
            );
        }
    }

}


const styles = StyleSheet.create({
    page: {
        // minHeight: Dimensions.get("screen").height
        height: "100%",
    },
    header: {
        elevation: 1,
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
    currentInventory: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 16,
    },
    currentEggs: {
        width: "48%",
        // backgroundColor: "#f3f3f3",
        aspectRatio: 1/1,
        borderRadius: 10,
    },
    currentCardTitle: {
        marginBottom: 8,
        textAlign: "center",
        color: "coral",
        fontWeight: "700",
        fontSize: 24,
        borderBottomWidth: 1,
        borderBottomColor: "#999"
    },
    eggCategories: {
        color: "teal",
        marginStart: 8,
        fontSize: 13,
        textAlignVertical: "center",
    },
    number: {
        color: "coral",
        fontSize: 18,
        textAlignVertical: "center",
        fontWeight: "700",
    },
    currentFeeds: {
        // backgroundColor: "#f3f3f3",
        width: "48%",
        aspectRatio: 1/1,
        borderRadius: 10
    },
    history: {
        marginStart: 16,
        marginEnd: 16,
        width: (Dimensions.get("window").width - 32),
        height: 30,
        backgroundColor: "#999",
    },
    fab: {
        alignSelf: "flex-end"
    },
    pickUp: {
    },
    label: {
        margin: 8,
    },
    dataTable: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        elevation: 0,
        zIndex: 0,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)"
    },
});
