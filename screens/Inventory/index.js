import React, { Component } from 'react';
import {
    View,
    Text,
    Button,
    Dimensions,
    StyleSheet,
} from 'react-native';


export default class Inventory extends Component {
    static navigationOptions = {
        headerTitle: "Inventory"
    };

    restockInventory = () => {
        this.props.navigation.navigate("Restock");
    }

    render() {
        return (
            <View style={styles.page}>
                <View style={styles.currentInventory}>
                    <View style={styles.currentEggs}>
                        <Text style={styles.currentCardTitle}>Eggs in Stock</Text>
                        <Text style={styles.eggCategories}>Normal Eggs: <Text style={styles.number}>120.23</Text></Text>
                        <Text style={styles.eggCategories}>Broken Eggs: <Text style={styles.number}>20.23</Text></Text>
                        <Text style={styles.eggCategories}>Smaller Eggs: <Text style={styles.number}>10.23</Text></Text>
                        <Text style={styles.eggCategories}>Larger Eggs: <Text style={styles.number}>8.23</Text></Text>
                    </View>
                    <View style={styles.currentFeeds}>
                        <Text style={styles.currentCardTitle}>Feeds</Text>
                        <Text style={styles.eggCategories}>Pembe Growers Mash: <Text style={styles.number}>30</Text></Text>
                        <Text style={styles.eggCategories}>Pembe Layers Mash: <Text style={styles.number}>30</Text></Text>
                        <Text style={styles.eggCategories}>Pembe Chick Mash: <Text style={styles.number}>30</Text></Text>
                    </View>
                </View>
                <View style={styles.history}>
                    <View></View>
                </View>
                <View style={styles.fab}>
                    <Button
                        style={styles.fab}
                        title="Restock Feeds"
                        onPress={this.restockInventory}/>
                </View>
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
        overflow: "scroll",
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
        backgroundColor: "blue",
    },
    fab: {
        position: "absolute",
        bottom: 0,
        elevation: 2,
        alignSelf: "flex-end"
    },
});