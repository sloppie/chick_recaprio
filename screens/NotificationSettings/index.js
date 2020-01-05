import React, { PureComponent } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import {
    Title,
    TextInput,
    Card,
    List,
    Switch
} from 'react-native-paper';

import BottomSheet from 'reanimated-bottom-sheet';

import * as NotificationManager from '../../utilities/NotificationManager';


export default class NotificationSettings extends PureComponent {


    constructor(props) {
        super(props);
        this.bottomSheetRef = React.createRef();

        this.state = {
            ringtoneEnabled: false,
            vibrationEnabled: false,
            defaultTime: ""
        };
    }

    componentDidMount() {
        let ringtoneEnabled = NotificationManager.NotificationPreferences.PLAY_SOUND;
        let vibrationEnabled = NotificationManager.EggPreferences.VIBRATION;
        let defaultTime = NotificationManager.NotificationPreferences.TIME;

        this.setState({
            ringtoneEnabled,
            vibrationEnabled,
            defaultTime
        });
    }

    editTime = () => {
        this.bottomSheetRef.current.snapTo(1);
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

    setDefaultTime = (defaultTime) => {
        this.setState({
            defaultTime
        });
    }

    verify = () => {
        let format1 = /\d{2}:\d{2}:\d{2}/gi;
        let format2 = /\d{2}:\d{2}/gi;
        let { defaultTime } = this.state;
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

        NotificationManager.NotificationPreferences.TIME = defaultTime;
        this.bottomSheetRef.current.snapTo(0);
    }

    render() {
        return (
            <View style={styles.screen}>
                <List.Section
                    title="Notifications">
                    <List.Item
                        title="Default Notification Time"
                        description={`Current Default Notification time: ${NotificationManager.NotificationPreferences.TIME}`}
                        left={props => <List.Icon {...props} icon="clock" />}
                        right={props => <List.Icon {...props} icon="pencil" />}
                        onPress={this.editTime}
                    />
                    <List.Item
                        title="Message Tone"
                        description="Play a sound on new notifications"
                        left={props => <List.Icon {...props} icon="music-circle" />}
                        right={props => <Switch {...props} value={this.state.ringtoneEnabled} onValueChange={this.setRingtone} />}
                    />
                    <List.Item
                        title="Vibration"
                        left={props => <List.Icon icon="vibrate" {...props} />}
                        right={props => <Switch {...props} value={this.state.vibrationEnabled} onValueChange={this.setVibration} />}
                    />
                </List.Section>
                <BottomSheet
                    renderContent={this.renderContent}
                    renderHeader={this.renderHeader}
                    snapPoints={["0%", "50%", "80%"]}
                    initialSnap={0}
                    ref={this.bottomSheetRef}
                />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
    },
    textInput: {
        marginTop: 8,
        marginBottom: 8,
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
    },
    bottomSheet: {
        height: "100%",
        backgroundColor: "#fff"
    },
});
