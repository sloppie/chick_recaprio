import React, { PureComponent } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Title, Card, List, TextInput, Button, Colors } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';

import SecurityManager from '..';

import Theme from '../../../theme';


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
                        theme={Theme.TEXT_INPUT_THEME}
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
            <Card style={styles.header}>
                <Card.Title
                    style={styles.titleContainer}
                    title="Authenticate"
                    titleStyle={styles.headerTitle}
                    right={props => <List.Icon icon="safe" color={Theme.PRIMARY_COLOR} />} 
                />
            </Card>
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
    container: {
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
