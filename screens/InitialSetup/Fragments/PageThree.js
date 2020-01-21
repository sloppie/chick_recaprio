import React, { PureComponent } from 'react';
import { 
    SafeAreaView, 
    View, 
    ScrollView, 
    Alert, 
    ToastAndroid, 
    StyleSheet, 
    Dimensions, 
} from 'react-native';
import { Card, Title, TextInput, Button, List, Switch, TouchableRipple, FAB, Colors } from 'react-native-paper';

import * as NotificationManager from '../../../utilities/NotificationManager';
import Theme from '../../../theme';


export default class PageOne extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            vibrationEnabled: true,
            ringtoneEnabled: true,
            defaultTime: NotificationManager.NotificationPreferences.TIME,
            visible: false,
        };

        this.scrollViewRef = React.createRef();
    }

    scrollTo = (x) => {
        let scrollOptions = {
            x,
            y: 0,
            animated: true
        };
        this.props.scrollViewRef.current.scrollTo(scrollOptions);
    }

    setRingtone = () => {
        let { ringtoneEnabled } = this.state;
        ringtoneEnabled = !ringtoneEnabled;
        this.setState({
            ringtoneEnabled
        });

        NotificationManager.NotificationPreferences.PLAY_SOUND = ringtoneEnabled;
    }

    setVibration = () => {
        let { vibrationEnabled } = this.state;
        vibrationEnabled = !vibrationEnabled;

        this.setState({
            vibrationEnabled,
        });

        NotificationManager.NotificationPreferences.VIBRATION = vibrationEnabled;
    }

    setDefaultTime = () => {
        this.setState({
            defaultTime
        });
    }

    verify = () => {
        let format1 = /\d{2}:\d{2}:\d{2}/gi;
        let format2 = /\d{2}:\d{2}/gi;
        let defaultTime = this.state.defaultTime;

        let format = 0;

        if (format2.test(defaultTime)) {
            format = 1;
        }

        if (format1.test(defaultTime)) {
            format = 2;
        }

        if (format == 1) {
            defaultTime += ":00";
        }

        if(format > 0) {
            console.log(context + " is the context. Time is for DEFAULT_TIME, which is: " + defaultTime);
            NotificationManager.NotificationPreferences.TIME = defaultTime;
        } else {
            ToastAndroid.show("Ensure the time entered is correct", ToastAndroid.SHORT);
        }

    }

    nextPage = () => {
        let width = Dimensions.get("window").width;
        let nextPage = width * 3;
        this.scrollTo(nextPage);
    }

    renderTextInput = () => {
        return (
            <TextInput
                theme={Theme.TEXT_INPUT_THEME}
                label="HH:MM"
                onChangeText={this.setDefaultTime}
                mode="outlined"
                value={this.state.defaultTime}
                style={styles.textInput2}
                placeholder="Enter new notification time"
                keyboardType="numeric"
                onBlur={this.verify}
            />
        );
    }

    toggleVisibility = () => {
        this.setState({
            visible: !this.state.visible,
        });
    }

    render() {
        return (
            <View style={styles.screen}>
                <Card style={styles.header}>
                    <Card.Title 
                        style={styles.titleContainer}
                        title="Set up notification preferences" 
                        titleStyle={styles.headerTitle} 
                        right={props => <List.Icon icon="av-timer" color={Theme.PRIMARY_COLOR}/>}/>
                </Card>
                <List.Section
                    title="Default Notifications"
                    titleStyle={styles.sectionTitle}>
                    <View>
                        {this.state.visible ? this.renderTextInput() : <View />}
                    </View>
                    <List.Item
                        title="Default Notification Time"
                        titleStyle={styles.sectionTitle}
                        description={`Current Default Notification time: ${NotificationManager.NotificationPreferences.TIME}.\nPress the clock button below to edit this time`}
                        left={props => <List.Icon {...props} icon="clock" color={Theme.PRIMARY_COLOR_LIGHT}/>}
                    />
                    <List.Item
                        title="Message Tone"
                        titleStyle={styles.sectionTitle}
                        description="Play a sound on new notifications"
                        left={props => <List.Icon {...props} icon="music-circle" color={Theme.PRIMARY_COLOR_LIGHT} />}
                        right={props => <Switch {...props} color={Theme.SECONDARY_COLOR_DARK} value={this.state.ringtoneEnabled} onValueChange={this.setRingtone} />}
                    />
                    <List.Item
                        title="Vibration"
                        titleStyle={styles.sectionTitle}
                        description="Phone vibrates when a new notification displays"
                        left={props => <List.Icon icon="vibrate" {...props} color={Theme.PRIMARY_COLOR_LIGHT}/>}
                        right={props => <Switch {...props} color={Theme.SECONDARY_COLOR_DARK} value={this.state.vibrationEnabled} onValueChange={this.setVibration} />}
                    />
                    <FAB
                        icon="clock"
                        color={Colors.white}
                        onPress={this.toggleVisibility}
                        style={styles.fab}
                    />
                </List.Section>
                <List.Item
                    right={props => (
                        <TouchableRipple onPress={this.nextPage}>
                            <View style={styles.bottomNav}>
                                <Title style={styles.navBarCaption}>Skip</Title>
                                <List.Icon {...props} icon="chevron-right" color={Theme.SECONDARY_COLOR_DARK} />
                            </View>
                        </TouchableRipple>
                    )}
                    style={styles.bottomNavContainer}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
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
    textInput2: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 8,
    },
    fab: {
        marginTop: 8,
        alignSelf: "center",
        backgroundColor: Theme.SECONDARY_COLOR_DARK,
    },
    bottomNavContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
    },
    bottomNav: {
        flexDirection: "row",
    },
    navBarCaption: {
        color: Theme.SECONDARY_COLOR_DARK,
        textAlignVertical: "center",
    },
});
