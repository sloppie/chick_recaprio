import React, { PureComponent } from 'react';
import { 
    View, 
    ToastAndroid, 
    StyleSheet, 
    Dimensions, 
} from 'react-native';

import { Card, TextInput, Button, List, Colors, Surface, Title } from 'react-native-paper';

import SecurityManager from '../../../utilities/SecurityManager';

import Theme from '../../../theme';


export default class PageOne extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
        };

    }

    confirmNewPassword = () => {
        let { password } = this.state;
        let { confirmPassword } = this.state;
        let passwordRegEx = /\d{4}/gi;
        let splitPassword = password.split("");
        let passedRegEx = passwordRegEx.test(password);
        let length = (splitPassword.length === 4);
        let similar = password === confirmPassword;

        if(passedRegEx && length && similar) {
            let RESET_CODE = SecurityManager.RESET_CODE;

            // SecurityManager.resetPassword(RESET_CODE, password);
            ToastAndroid.show("Password successfully set:)", ToastAndroid.SHORT);
            let nextPage = Dimensions.get("window").width;
            this.scrollTo(nextPage);
        } else {
            if(!passedRegEx) {
                ToastAndroid.show("Password must be four numbers", ToastAndroid.SHORT);
            } else if(!length){
                ToastAndroid.show("Password must be only four numbers", ToastAndroid.SHORT);
            } else {
                ToastAndroid.show("The two passwords entered are not the same", ToastAndroid.SHORT)
            }
        }

    }

    passwordChange = (password) => {
        this.setState({
            password
        });
    }

    confirmPasswordChange = (confirmPassword) => {
        this.setState({
            confirmPassword,
        });
    }

    scrollTo = (x) => {
        let scrollOptions = {
            x,
            y: 0,
            animated: true
        };
        this.props.scrollViewRef.current.scrollTo(scrollOptions);
    }

    render() {
        return (
            <View style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title 
                        style={styles.titleContainer}
                        title="Create Password" 
                        titleStyle={styles.headerTitle} 
                        right={props => <List.Icon icon="lock-smart" color={Theme.PRIMARY_COLOR}/>}/>
                </Card>
                <View style={styles.container}>
                    <TextInput
                        theme={Theme.TEXT_INPUT_THEME}
                        mode="outlined"
                        style={styles.textInput}
                        label="New Password"
                        placeholder="Enter password"
                        value={this.state.password}
                        secureTextEntry={true}
                        textContentType="password"
                        onChangeText={this.passwordChange}
                    />
                    <TextInput
                        theme={Theme.TEXT_INPUT_THEME}
                        mode="outlined"
                        style={styles.textInput}
                        label="Confirm Password"
                        placeholder="Re-enter password"
                        secureTextEntry={true}
                        textContentType="password"
                        value={this.state.confirmPassword}
                        onChangeText={this.confirmPasswordChange}
                    />
                    <Button
                        style={styles.button}
                        icon="fingerprint"
                        onPress={this.confirmNewPassword}
                        color={Theme.SECONDARY_COLOR_DARK}
                    >
                        Secure App
                </Button>
                    <List.Item
                        left={props => <List.Icon {...props} icon="information" color={Colors.red500} />}
                        title="Type"
                        titleStyle={styles.sectionTitle}
                        description="The password should consist of only numbers"
                    />
                    <List.Item
                        left={props => <List.Icon {...props} icon="information" color={Colors.red500} />}
                        title="Password length"
                        titleStyle={styles.sectionTitle}
                        description="The password should be four numbers long"
                    />
                    <List.Item
                        left={props => <List.Icon {...props} icon="information" color={Colors.red500} />}
                        title="Confirm password"
                        titleStyle={styles.sectionTitle}
                        description="Both fields should have the same password entered"
                    />
                </View>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
        backgroundColor: Colors.white,
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
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
        // textAlign: "center",
        fontSize: 16,
        color: "#777"
    },
    sectionTitle: {
        color: Theme.PRIMARY_COLOR,
    },
    container: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        height: "100%",
        paddingTop: 8,
    },
    textInput: {
        marginBottom: 8,
    },
    page: {
        minWidth: Dimensions.get("window").width,
        maxWidth: Dimensions.get("window").width,
        height: "100%",
    },
    button: {
        width: "60%",
        alignSelf: "center",
        padding: 8,
        color: Colors.white,
    },
    textInput2: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
    secondButton: {
        width: "60%",
        alignSelf: "center",
        padding: 8,
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
    },
});
