import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Title, Card, TextInput, Button, Colors } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';
import SecurityManager from '..';


export default class Authenticator extends PureComponent {

    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();
        this.state = {
            password: ""
        };
    }

    snapTo = (index) => {
        this.bottomSheetRef.current.snapTo(index);
    }

    setPassword = (password) => {
        this.setState({
            password
        });
    }

    authenticate = () => {
        let authenticated = SecurityManager.authenticate(this.state.password);
        this.props.action(authenticated);
        this.snapTo(0);
    }

    renderContent = () => {
        return (
            <View style={styles.bottomSheet}>
                <View style={styles.container}>
                    <TextInput
                        label="4 Digits"
                        mode="outlined"
                        style={styles.textInput}
                        textContentType="password"
                        secureTextEntry={true}
                        onChangeText={this.setPassword}
                        value={this.state.password}
                        onBlur={this.authenticate}
                    />
                    <Button
                        icon="fingerprint"
                        onPress={this.authenticate}
                        mode="outlined"
                        style={styles.button}
                        color={Colors.green700}
                    >
                        <Text>Authenticate</Text>
                    </Button>
                </View>
            </View>
        );
    }

    renderHeader = () => {
        return (
            <View style={styles.titleContainer}>
                <Title>Authenticate</Title>
            </View>
        );
    }

    render() {
        return (
            <BottomSheet
                snapPoints={["0%", "50%", "80%"]}
                initialSnap={0}
                renderContent={this.renderContent}
                renderHeader={this.renderHeader}
                style={styles.bottomSheet}
                ref={this.bottomSheetRef}
            />
        );
    }

}

const styles = StyleSheet.create({
    bottomSheet: {
        backgroundColor: "#fff",
        height: "100%"
    },
    container: {

    },
    titleContainer: {
        backgroundColor: "white",
    },
    textInput: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
        marginBottom: 8,
    },
    button: {
        padding: 8,
        width: "40%",
        margin: 8,
        alignSelf: "center"
    },
});
