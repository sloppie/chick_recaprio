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

import { FAB, Card, Title } from 'react-native-paper';

// fragments
import LockScreen from './Fragments/LockScreen';
import PUC from './Fragments/PickUpCard';

// utilities
import InventoryManager from '../../utilities/InventoryManager';

export default class PickUp extends Component {
    
    constructor(props) {
        super(props);

        this.state = {
            currentInventory: "",
            number: "",
            misc: 0,
            lock: false,
        };
            let pickUp = JSON.parse(NativeModules.InventoryManager.fetchPickUp());
            this.pickUp = pickUp;
        this.subscription = DeviceEventEmitter.addListener("update", this.listen);
    }

    componentDidMount() {
        this.forceUpdate();
    }

    componentWillUnmount() {
        this.subscription.remove();
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.state.lock != nextState.lock);
    }

    listen = (event) => {
        if(event.done) {
            this.forceUpdate();
        }
    }

    forceUpdate = () => {
        try {
            let currentInventory = JSON.parse(NativeModules.InventoryManager.fetchCurrentInventory())[0];
            // fetch pickUp and compare dates
            this.setState({
                currentInventory
            });
            if(this.pickUp.length > 0) {
                let today = new Date().toDateString();
                //lpud = lastPickUpDate
                let lpud = this.pickUp[0].date
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

	preview = () => {
		let preview = InventoryManager.previewPickUp();
		
		return (
			<View style={styles.rfp}>
				<Text style={styles.eggType}>Normal Eggs: <Text style={styles.eggNumber}>{preview.normalEggs}</Text></Text>
				<Text style={styles.eggType}>Broken Eggs: <Text style={styles.eggNumber}>{preview.brokenEggs}</Text></Text>
				<Text style={styles.eggType}>Smaller Eggs: <Text style={styles.eggNumber}>{preview.smallerEggs}</Text></Text>
				<Text style={styles.eggType}>Larger Eggs: <Text style={styles.eggNumber}>{preview.largerEggs}</Text></Text>
			</View>
			);
	}
		
    renderScreen = () => {
            let cards = [];
            for(let i=0; i<this.pickUp.length; i++) {
                if(this.pickUp[i].price == undefined || !this.pickUp[i].price) {
                    cards.push(
                        <PUC pickUp={this.pickUp[i]} key={i} navigation={this.props.navigation}/>
                    );
                }
            }

            return (
                <View style={styles.screen}>
                    <ScrollView style={styles.scrollView}>
						<Title>Ready For Pick Up</Title>
						{ this.preview() }
						<View style={styles.border}></View>
						<Title>Add Prices</Title>
                        { cards }
                    </ScrollView>
                    {(!this.state.lock)?<FAB onPress={this.emptyInventory} style={styles.fab} label="Empty Inventory"/>: <View />}
                </View>
            );
    }

    render() {
        return this.renderScreen();
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
});
