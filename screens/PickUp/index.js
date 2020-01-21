import React, { Component } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Alert,
    ActivityIndicator,
    NativeModules,
    Dimensions,
    DeviceEventEmitter,
} from 'react-native';

import { FAB, Card, List, Title, DataTable, Surface } from 'react-native-paper';

// fragments
import LockScreen from './Fragments/LockScreen';
import PUC from './Fragments/PickUpCard';

// utilities
import InventoryManager from '../../utilities/InventoryManager';
import Theme from '../../theme';
import { APP_STORE } from '../..';
import { PICK_UP_ADDED } from '../../store';

let DUMMY_DATA = {
    date: "Thu Jul 12 2018",
    number: {
        normalEggs: "243.12",
        brokenEggs: "12.10",
        largerEggs: "3.23",
        smallerEggs: "1.3"
    },
    price: null,
    misc: null
};


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
            rendered: false,
        }; 

    }

    componentDidMount() {
        this.setPickUp();

        this.pickUpAdded = APP_STORE.subscribe(PICK_UP_ADDED, this.setPickUp.bind(this));
    }

    componentWillUnmount() {
        APP_STORE.unsubscribe(PICK_UP_ADDED, this.pickUpAdded);
    }

    listen = (event) => {
        if (event.done) {
            this.forceUpdate();
        }
    }

    setPickUp = async () => {
        let pickUp = JSON.parse(await NativeModules.InventoryManager.fetchPickUpAsync());

        this.setState({
            pickUp,
            rendered: true,
        });

        this.forceUpdate();
    }

    forceUpdate = () => {
        let preview = InventoryManager.previewPickUp();
        for (let i in preview) {
            preview[i] = preview[i].split(".");
        }
        try {
            this.setState({
                preview,
            });
            if (this.state.pickUp.length > 0) {
                let today = new Date().toDateString();
                //lpud = lastPickUpDate
                let lpud = this.state.pickUp[0].date
                if (today == lpud) {
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

        if (this.state.pickUp) {
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
        if(this.state.rendered) {
            return (
                <SafeAreaView style={styles.screen}>
                    <ScrollView style={styles.scrollView} stickyHeaderIndices={[0, 3]}>
                        <View style={styles.headerContainer}>
                            <Card style={styles.header}>
                                <Card.Title
                                    style={styles.titleContainer}
                                    title="Preview of eggs ready for pick up"
                                    titleStyle={styles.headerTitle}
                                    right={props => <List.Icon icon="clipboard-outline" color={Theme.PRIMARY_COLOR} />} />
                            </Card>
                        </View>
                        <Surface style={styles.dataTable}>
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title >Egg Type</DataTable.Title>
                                    <DataTable.Title numeric>Full Trays</DataTable.Title>
                                    <DataTable.Title numeric>Extra Eggs</DataTable.Title>
                                </DataTable.Header>
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.dataCell}>Normal Eggs</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.normalEggs[0]}</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.normalEggs[1]}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.dataCell}>Broken Eggs</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.brokenEggs[0]}</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.brokenEggs[1]}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.dataCell}>Smaller Eggs</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.smallerEggs[0]}</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.smallerEggs[1]}</DataTable.Cell>
                                </DataTable.Row>
                                <DataTable.Row>
                                    <DataTable.Cell style={styles.dataCell} borderless={true}>Larger Eggs</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.largerEggs[0]}</DataTable.Cell>
                                    <DataTable.Cell style={styles.dataCell} numeric>{this.state.preview.largerEggs[1]}</DataTable.Cell>
                                </DataTable.Row>
                            </DataTable>
                        </Surface>
                        <View style={styles.border}></View>
                        <Card style={styles.header}>
                            <Card.Title
                                style={styles.titleContainer}
                                title="Add price details on previous pick ups"
                                titleStyle={styles.headerTitle}
                                right={props => <List.Icon icon="truck-check" color={Theme.PRIMARY_COLOR} />} />
                        </Card>
                        {this.renderPriceCards()}
                        <PUC pickUp={DUMMY_DATA} navigation={this.props.navigation} />
                    </ScrollView>
                    {(!this.state.lock) ? <FAB icon="truck-delivery" onPress={this.emptyInventory} style={styles.fab} /> : <View />}
                </SafeAreaView>
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
        height: "100%",
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
        flex: 1,
    },
    container: {
        borderTopEndRadius: 30,
        borderTopStartRadius: 30,
        backgroundColor: Theme.WHITE,
        height: "100%",
    },
    headerContainer: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    header: {
        elevation: 1,
        width: Dimensions.get("window").width,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        paddingBottom: 0,
        marginBottom: 0,
    },
    titleContainer: {
        padding: 0,
        marginBottom: 0,
    },
    headerTitle: {
        textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    scrollView: {
        // minHeight: Dimensions.get("window").height,
        minHeight: "100%",
        backgroundColor: Theme.WHITE,
        maxHeight: "100%",
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
        backgroundColor: Theme.SECONDARY_COLOR_DARK,
        bottom: 0,
        end: 0,
        margin: 16,
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
        // marginTop: 18,
        // marginBottom: 8,
        // minHeight: 1,
        // maxHeight: 1,
        // backgroundColor: "#f4f4f4"
    },
    dataTable: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        elevation: 0,
        zIndex: 1,
        marginTop: 8,
        borderWidth: 1,
        borderColor: "rgba(0, 0, 0, 0.12)"
    },
    dataCell: {
        borderWidth: 0,
    },
});
