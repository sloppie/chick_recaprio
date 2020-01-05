import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Alert,
    Dimensions,
    StyleSheet,
    NativeModules,
    DeviceEventEmitter,
} from 'react-native';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import { DataTable, Surface, Title } from 'react-native-paper';


export default class Inventory extends Component {

    constructor(props) {
        super(props);

        this.state = {
            rendered: false,
            normalEggs: "0.0",
            brokenEggs: "0.0",
            smallerEggs: "0.0",
            largerEggs: "0.0"
        };

        this.subscription = DeviceEventEmitter.addListener("update", this.listen);
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
        this.subscription.remove();
    }

    listen = (event) => {
        if (event.done) {
            this.forceUpdate();
        }
    }

    forceUpdate = () => {
        try {
            this.currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory());
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
                <DataTable.Row key={this.feeds[i][0]}>
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

        return (
            <View style={styles.page}>
                <Title style={styles.label}>Eggs In Inventory</Title>
                <Surface style={styles.dataTable}>
                    <DataTable 
                        collapsable
                        >
                        <DataTable.Header>
                            <DataTable.Title >Egg Type</DataTable.Title>
                            <DataTable.Title numeric>Full Trays</DataTable.Title>
                            <DataTable.Title numeric>Extra Eggs</DataTable.Title>
                        </DataTable.Header>
                        <DataTable.Row>
                            <DataTable.Cell>Normal Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.normalEggs.split(".")[0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.normalEggs.split(".")[1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Broken Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.brokenEggs.split(".")[0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.brokenEggs.split(".")[1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Smaller Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.smallerEggs.split(".")[0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.smallerEggs.split(".")[1]}</DataTable.Cell>
                        </DataTable.Row>
                        <DataTable.Row>
                            <DataTable.Cell>Larger Eggs</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.largerEggs.split(".")[0]}</DataTable.Cell>
                            <DataTable.Cell numeric>{this.state.largerEggs.split(".")[1]}</DataTable.Cell>
                        </DataTable.Row>
                    </DataTable>
                </Surface>
                <Title style={styles.label}>Feeds In Inventory</Title>
                <Surface style={styles.dataTable}>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Feeds Name</DataTable.Title>
                            <DataTable.Title numeric>Stock</DataTable.Title>
                        </DataTable.Header>
                        {this.state.rendered? this.fd: <View />}
                        <DataTable.Pagination 
                            page={1}
                            onPageChange={page => console.log(page)}
                            numberOfPages={2}
                        />
                    </DataTable>
                </Surface>
            </View>
        );
    }

}


const styles = StyleSheet.create({
    page: {
        minHeight: Dimensions.get("screen").height
    },
    currentInventory: {
        flexDirection: "row",
        justifyContent: "space-between",
        margin: 16,
    },
    currentEggs: {
        width: "48%",
        backgroundColor: "#f3f3f3",
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
        backgroundColor: "#f3f3f3",
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
        elevation: 1,
        zIndex: 1,
        marginTop: 8,
    },
});
