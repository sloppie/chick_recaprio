import React, { Component } from 'react';
import {
    TouchableHighlight,
    Text,
    StyleSheet,
    Dimensions,
} from 'react-native';


export default class PickUp extends Component {

    render() {
        return (
            <TouchableHighlight 
                style={styles.button}
                onPress={this.props.onClick}
                underlayColor="#888">
                <Text style={styles.buttonLabel}>PICK UP</Text>
            </TouchableHighlight>
        );
    }

}


const styles = StyleSheet.create({
    button: {
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        position: "absolute",
        start: 16,
        top: (Dimensions.get("window").height - 128),
        backgroundColor: "#f2f3f6",
        borderRadius: 10,
    },
    buttonLabel: {
        paddingBottom: 8,
        paddingTop: 8,
        fontWeight: "700",
        color: "#777",
        textAlignVertical: "center",
        textAlign: "center",
    },
});