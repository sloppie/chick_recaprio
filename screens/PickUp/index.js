import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Alert,
    NativeModules,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

import { FAB, Card, Title, DataTable, Surface } from 'react-native-paper';

// fragments
import LockScreen from './Fragments/LockScreen';
import PUC from './Fragments/PickUpCard';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

export default class PickUp extends Component {
    
    constructor(props) {
        super(props);

        let preview = {
            normalEggs: ["0", "0"],
            brokenEggs: ["0", "0"],
            smallerEggs: ["0", "0"],
            largerEggs: ["0", "0"],
        };

        this.state = {
            currentInventory: "",
            number: "",
            misc: 0,
            lock: false,
            preview,
            pickUp: null,
        };

    }

    async componentDidMount() {
        let pickUp = JSON.parse(await NativeModules.InventoryManager.fetchPickUpAsync());
        
        this.setState({
            pickUp
        });

        this.subscription = DeviceEventEmitter.addListener("update", this.listen);
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    // shouldComponentUpdate(nextProps, nextState) {
    //     return (this.state.lock != nextState.lock);
    // }

    listen = (event) => {
        if(event.done) {
            this.forceUpdate();
        }
    }

    forceUpdate = () => {
        let preview = InventoryManager.previewPickUp();
        for(let i in preview) {
            preview[i] = preview[i].split(".");
        }
        try {
            this.setState({
                preview
            });
            if(this.state.pickUp.length > 0) {
                let today = new Date().toDateString();
                //lpud = lastPickUpDate
                let lpud = this.state.pickUp[0].date
                if(today == lpud) {
                    this.lock();
                } else {

                }
            } else {
                this.lock();
            }
        } catch (err) {
            // pass
        }
    }

    lock = () => {
        this.setState({
            lock: true,
        });
    }

    getNumber = (trays) => {
        this.setState({
            number: trays
        });
    }

    getMisc = (misc) => {
        this.setState({
            misc: Number(misc)
        });
    }

    emptyInventory = () => {
        this.props.navigation.navigate("EmptyInventory", {
            lock: this.lock,
        });
    }

	renderPriceCards = () => {
        let cards = <View />;

        if(this.state.pickUp) {
            cards = [];
            for (let i = 0; i < this.state.pickUp.length; i++) {
                if (this.state.pickUp[i].price == undefined || !this.state.pickUp[i].price) {
                    cards.push(
                        <PUC pickUp={this.state.pickUp[i]} key={i} navigation={this.props.navigation} />
                    );
                }
            }
        }

        return cards;

    }
		
    renderScreen = () => {
    }

    render() {
        let cards = this.renderPriceCards();
        return (
            <View style={styles.screen}>
                <ScrollView style={styles.scrollView}>
                    <Title>Ready For Pick Up</Title>
                    <Surface style={styles.dataTable}>
                        <DataTable>
                            <DataTable.Header>
                                <DataTable.Title >Egg Type</DataTable.Title>
                                <DataTable.Title numeric>Full Trays</DataTable.Title>
                                <DataTable.Title numeric>Extra Eggs</DataTable.Title>
                            </DataTable.Header>
                            <DataTable.Row>
                                <DataTable.Cell>Normal Eggs</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.normalEggs[0]}</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.normalEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell>Broken Eggs</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.brokenEggs[0]}</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.brokenEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell>Smaller Eggs</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.smallerEggs[0]}</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.smallerEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                            <DataTable.Row>
                                <DataTable.Cell>Larger Eggs</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.largerEggs[0]}</DataTable.Cell>
                                <DataTable.Cell numeric>{this.state.preview.largerEggs[1]}</DataTable.Cell>
                            </DataTable.Row>
                        </DataTable>
                    </Surface>
                    <View style={styles.border}></View>
                    <Title>Add Prices</Title>
                    { cards }
                </ScrollView>
                {(!this.state.lock) ? <FAB icon="truck-delivery" onPress={this.emptyInventory} style={styles.fab} label="Empty Inventory" /> : <View />}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    pickUp: {
        position: 'absolute',
        top: 50,
    },
    errorScreen: {
        minHeight: Dimensions.get("window").height,
        justifyContent: "center"
    },
    errorTitle: {
        textAlign: "center",
        fontSize: 25,
        fontWeight: "600"
    },
    errorBody: {
        marginTop: 16,
    },
    title: {
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
        fontWeight: "600",
    },
    screen: {
        minHeight: Dimensions.get("window").height
    },
    scrollView: {
        minHeight: Dimensions.get("window").height,
    },
    inventoryCard: {
        maxWidth: (Dimensions.get("window").width - 16),
        minWidth: (Dimensions.get("window").width - 16),
        elevation: 1,
        padding: 16,
    },
    existingInventory: {
        alignSelf: "center",
        backgroundColor: "#999",
    },
    eggs: {
        textAlignVertical: "center",
    },
    miscellaneous: {
        elevation: 1,
        borderBottomColor: "#999",
        paddingTop: 4,
        borderBottomWidth: 1,
    },
    fab: {
        position: "absolute",
        bottom: 150,
        end: 16
    },
	rfp: {
		marginTop: 16,
		minWidth: (Dimensions.get("window").width - 32),
		maxWidth: (Dimensions.get("window").width - 32),
		padding: 8,
		backgroundColor: "#f3f3f3",
		borderRadius: 10,
		alignSelf: "center",
	},
	eggType: {
		fontSize: 18,
		fontWeight: "600"
	},
	eggNumber: {
		fontSize: 15,
		fontWeight: "700"
	},
	border: {
		marginTop: 18,
		marginBottom: 8,
		minHeight: 1,
		maxHeight: 1,
		backgroundColor: "#f4f4f4"
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
