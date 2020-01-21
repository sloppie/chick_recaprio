import React, { PureComponent } from 'react';
import { View, SafeAreaView, ToastAndroid, StyleSheet, Dimensions } from 'react-native';
import { Card, List, Title, TextInput } from 'react-native-paper';
import BottomSheet from 'reanimated-bottom-sheet';

import SecurityManager from '../../utilities/SecurityManager';
import Theme from '../../theme';
let context = "";


export default class SecuritySettings extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            resetCode: "",
            oldPassword: "",
            newPassord: "",
            label: "Password",
            placeholder: "Enter Password",
            renderSecondInput: false,
            secondNewPass: "",
        };

        this.context = "";
    }

    renderSecondTextInput = () => {
        return (
            <TextInput
                label="Re-enter new password"
                placeholder="Re-enter password"
                style={styles.textInput}
                onChangeText={this.reenterCode}
                secureTextEntry
                onBlur={this.verifyNewPassword}
                value={this.state.secondNewPass}
            />
        );
    }

    reenterCode = (secondNewPass) => {
        this.setState({
            secondNewPass
        });
    }

    renderHeader = () => {
        let header;

        if (context == CONTEXT.CHANGE_PASSWORD) {
            header = <Title>Old Password</Title>
        } else if(context == CONTEXT.RESET_PASSWORD) {
            header = <Title>Reset Password</Title>
        } else {
            header = <Title>New Password</Title>
        }

        return header;
    }

    renderContent = () => {
        return (
            <View style={styles.bottomSheet}>
                <TextInput
                    label={this.state.label}
                    placeholder={this.state.placeholder}
                    style={styles.textInput}
                    onChangeText={this.setCode}
                    secureTextEntry
                    value={(context == CONTEXT.CHANGE_PASSWORD)?this.state.oldPassword:(context == CONTEXT.RESET_PASSWORD)? this.state.resetCode: this.state.newPassord}
                    onBlur={((context != CONTEXT.NEW_PASSWORD))? this.verify: this.doNothing}
                />
                { this.state.renderSecondInput? this.renderSecondTextInput(): <View /> }
            </View>
        );
    }

    setCode = (value) => {
        if(context == CONTEXT.CHANGE_PASSWORD) {
            this.setState({
                oldPassword: value,
            });
        } else if(context == CONTEXT.RESET_PASSWORD) {
            this.setState({
                resetCode: value,
            });
        } else {
            this.setState({
                newPassord: value,
            });
        }
    }

    findValue = () => {
        if(context == CONTEXT.CHANGE_PASSWORD) {
            return this.state.oldPassword;
        } else if(context == CONTEXT.RESET_PASSWORD) {
            return this.state.resetCode;
        } else {
            return this.state.newPassord;
        }
    }

    doNothing = () => {
    }

    verify = () => {

        let authenticated;

        if(context == CONTEXT.CHANGE_PASSWORD) {
            let value = this.state.oldPassword;
            console.log("This is change password: CHANGE_PASSWORD");
            authenticated = SecurityManager.authenticate(value);
        } else {
            let value = this.state.resetCode;
            console.log("This is change password: RESET_PASSWORD");
            authenticated = SecurityManager.authenticateResetCode(value);
        }

        if (authenticated == true) {
            // this.bottomSheetRef.current.snapTo(0);
            this.secondCallBottomSheetRef(CONTEXT.NEW_PASSWORD);
        } else {
            ToastAndroid.show("Unable to authenticate Password", ToastAndroid.SHORT);
            this.bottomSheetRef.current.snapTo(0);
        }
    }

    verifyNewPassword = () => {
        let { newPassord, secondNewPass } = this.state;

        if(newPassord == secondNewPass) {
            console.log("Password would have been reset to: " + newPassord);
            this.bottomSheetRef.current.snapTo(0);
            // SecurityManager.resetPassword(newPassord);
        } else {
            ToastAndroid.show("WARNING: Both passwords entered must be similar.", ToastAndroid.SHORT);
        }
    }

    secondCallBottomSheetRef = (contxt) => {
        console.log(contxt);
        context = contxt;
        if(context == CONTEXT.CHANGE_PASSWORD) {
            this.setState({
                placeholder: "Enter Old Password",
                label: "Old Password"
            });
        } else if(context == CONTEXT.RESET_PASSWORD) {
            this.setState({
                label: "Reset code",
                placeholder: "ResetCode"
            });
        } else {
            this.setState({
                label: "New Password",
                placeholder: "Enter new password",
                renderSecondInput: true
            });
        }
        this.bottomSheetRef.current.snapTo(1);
    }

    callBottomSheetRef = (contxt) => {
        console.log(contxt);
        context = contxt;
        if(context == CONTEXT.CHANGE_PASSWORD) {
            this.setState({
                placeholder: "Enter Old Password",
                label: "Old Password"
            });
        } else if(context == CONTEXT.RESET_PASSWORD) {
            this.setState({
                label: "Reset code",
                placeholder: "ResetCode"
            });
        } else {
            this.setState({
                label: "New Password",
                placeholder: "Enter new password"
            });
        }
        this.bottomSheetRef.current.snapTo(1);
    }

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title
                        style={styles.titleContainer}
                        title="Configure your app security"
                        titleStyle={styles.headerTitle}
                        right={props => <List.Icon icon="bell" color={Theme.PRIMARY_COLOR} />} />
                </Card>
                <List.Section style={styles.container}>
                    <List.Item 
                        title="Change Password"
                        description="Change password to another number"
                        left={props => <List.Icon {...props} color={Theme.PRIMARY_COLOR} icon="lock-smart"/>}
                        onPress={this.callBottomSheetRef.bind(this, CONTEXT.CHANGE_PASSWORD)}
                    />
                    <List.Item 
                        title="Reset Password"
                        description="Forgot Password? Press here to reset."
                        left={props => <List.Icon {...props} icon="lock-reset" color={Theme.SECONDARY_COLOR_DARK} />}
                        onPress={this.callBottomSheetRef.bind(this, CONTEXT.RESET_PASSWORD)}
                    />
                </List.Section>
                <BottomSheet 
                    snapPoints={["0%", "50%", "80%"]}
                    initialSnap={0}
                    renderContent={this.renderContent}
                    renderHeader={this.renderHeader}
                    ref={this.bottomSheetRef}
                />
            </SafeAreaView>
        );
    }

}

class CONTEXT {
    static get RESET_PASSWORD() {
        return "RESET_PASSWORD";
    }

    static get CHANGE_PASSWORD() {
        return "CHANGE_PASSWORD";
    }

    static get NEW_PASSWORD() {
        return "NEW_PASSWORD";
    }
}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
        backgroundColor: Theme.PRIMARY_COLOR_DARK,
    },
    container: {
        backgroundColor: Theme.WHITE,
        height: "100%",
        marginTop: 0,
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
    bottomSheet: {
        height: "100%",
        backgroundColor: "#fff",
        backfaceVisibility: "hidden",
    },
    textInput: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginTop: 8,
        marginBottom: 8,
    },
});
