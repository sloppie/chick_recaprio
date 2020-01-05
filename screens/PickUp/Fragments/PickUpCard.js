import React, { PureComponent } from 'react';
import {
    View,
    Text,
    TouchableHighlight,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {  } from 'react-native-paper';


export default class PickUpCard extends PureComponent {

    addPrices = () => {
        this.props.navigation.navigate("AddPrices", {
            pickUp: this.props.pickUp
        });
    }

    render() {
        return (
            <View style={styles.card}>
                <Text style={styles.date}>{this.props.pickUp.date}</Text>
                <View style={styles.eggContainer}>
                    <Text style={styles.eggCategory}>Normal Eggs: {this.props.pickUp.number.normalEggs}</Text>
                    <Text style={styles.eggCategory}>Smaller Eggs: {this.props.pickUp.number.smallerEggs}</Text>
                    <Text style={styles.eggCategory}>Broken Eggs: {this.props.pickUp.number.brokenEggs}</Text>
                    <Text style={styles.eggCategory}>Larger Eggs: {this.props.pickUp.number.largerEggs}</Text>
                </View>
                <TouchableHighlight onPress={this.addPrices} style={styles.btn}>
                    <Text style={styles.btnText}>ADD PRICES</Text>
                </TouchableHighlight>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    card: {
        marginTop: 8,
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        backgroundColor: "#f2f4f6",
        borderRadius: 10,
    },
    date: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    eggContainer: {
        padding: 8,
    },
    eggCategory: {
        fontWeight: "400"
    },
    btn: {
        width: "100%",
        backgroundColor: "teal",
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
    },
    btnText: {
        color: "#fff",
        fontWeight: "900",
        textAlign: "center",
        paddingBottom: 8,
        paddingTop: 8
    },
});
