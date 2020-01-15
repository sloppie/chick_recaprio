import React, { PureComponent } from 'react';
import { 
    SafeAreaView, 
    View, 
    ScrollView, 
    Alert, 
    ToastAndroid, 
    StyleSheet, 
    Dimensions, 
    PermissionsAndroid 
} from 'react-native';

import { Card, TextInput, Button, List, Switch, TouchableRipple, FAB, Colors, Surface } from 'react-native-paper';
import PushNotification from 'react-native-push-notification';

import SecurityManager from '../../utilities/SecurityManager';
import InventoryManager from '../../utilities/InventoryManager';
import * as NotificationManager from '../../utilities/NotificationManager';

import * as Fragments from './Fragments';
import Theme from '../../theme';

let context = "";


export default class InitialSetup extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            password: "",
            confirmPassword: "",
            feedsType: "",
            feedsNumber: 0,
            feedsPrice: 0,
            vibrationEnabled: true,
            ringtoneEnabled: true,
            eggVibrationEnabled: true,
            eggRingtoneEnabled: true,
        };

        this.scrollViewRef = React.createRef();
    }

    scrollTo = (x) => { 
        let scrollOptions = {
            x,
            y: 0,
            animated: true
        };
        this.scrollViewRef.current.scrollTo(scrollOptions);
    }

    renderHeader = () => {
        return (
            <Title>Set new default time</Title>
        );
    }

    renderContent = () => {
        return (
            <View style={styles.bottomSheet}>
                <TextInput
                    label="time"
                    onChangeText={this.setDefaultTime}
                    mode="outlined"
                    style={styles.textInput}
                    placeholder="HH:MM:SS"
                    onBlur={this.verify}
                />
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={styles.screen}>
                <ScrollView style={styles.scrollView} horizontal={true} scrollEnabled={false} ref={this.scrollViewRef}>
                    <Surface style={styles.page}>
                        <Fragments.PageOne scrollViewRef={this.scrollViewRef}/>
                    </Surface>
                    <Surface style={styles.page}>
                        <Fragments.PageTwo scrollViewRef={this.scrollViewRef}/>
                    </Surface>
                    <Surface style={styles.page}>
                        <Fragments.PageThree scrollViewRef={this.scrollViewRef} />
                    </Surface>
                    <Surface style={styles.page}>
                        <Fragments.PageFour scrollViewRef={this.scrollViewRef} navigation={this.props.navigation} />
                    </Surface>
                    <Surface style={styles.page}>
                        <Fragments.PageFive navigation={this.props.navigation}/>
                    </Surface>
                </ScrollView>
                {/* <View style={styles.navBar}>
                    <TouchableRipple>
                        <List.Icon
                            icon="chevron-right"
                        />
                    </TouchableRipple>
                </View> */}
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%",
        backgroundColor: Theme.PRIMARY_COLOR_DARK,
    },
    scrollView: {
        backgroundColor: Colors.white,
        borderTopStartRadius: 10,
        borderTopEndRadius: 10,
        backgroundColor: Theme.PRIMARY_COLOR_DARK,
    },
    container: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        height: "100%",
    },
    textInput: {
        marginBottom: 8,
    },
    page: {
        minWidth: Dimensions.get("window").width,
        maxWidth: Dimensions.get("window").width,
        height: "100%",
        borderTopStartRadius: 30,
        borderTopEndRadius: 30,
        backgroundColor: Colors.white,
        elevation: 1,
    },
    button: {
        width: "60%",
        alignSelf: "center",
        padding: 8,
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
