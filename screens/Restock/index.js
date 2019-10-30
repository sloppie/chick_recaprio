import React, { Component } from 'react';
import {
    View,
    Text,
    TextInput,
    Button,
    StyleSheet,
    SafeAreaView,
} from 'react-native';

export default class Restock extends Component {
    constructor(props) {
        super(props);
    }

    restock = () => {
        console.log("Pressed");
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={styles.view}>
                    <TextInput 
                        onChangeText={}/>
                </View>
                <Button 
                    title="Restock"
                    onPress={this.restock}
                    style={styles.fab}/>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {

    },
    view: {},
    fab: {
        position: "absolute",
        bottom: 0,
        width: "30%",
        alignSelf: "flex-end",
        backgroundColor: "coral",
    },
});
