import React, { PureComponent } from 'react';
import {
    SafeAreaView,
    Picker,
    ToastAndroid,
    Dimensions,
    StyleSheet,
    NativeModules,
} from 'react-native';
import { TextInput, Button, Caption } from 'react-native-paper';

import InventoryManager from '../../utilities/InventoryManager';
import EventManager from '../../utilities/EventManager';
import SecurityManager from '../../utilities/SecurityManager';
import DATE from '../../utilities/Date';
import { NotificationPreferences } from '../../utilities/NotificationManager';

import Theme from '../../theme';


export default class AddEvent extends PureComponent {

    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            title: "",
            description: "",
            batchName: "",
            time: NotificationPreferences.TIME,
            to: "",
            from: "",
        };
    }

    getTitle = (value) => {
        let title;
        try {
            title = InventoryManager.redoFeedsName(value);
        } catch(err) {
            title = value;
        }
        this.setState({
            title
        });
    }

    getDescription = (description) => {
        this.setState({
            description
        });
    }

    getFromDate = (from) => {
        this.setState({
            from
        });
    }

    getToDate = (to) => {
        this.setState({
            to
        });
    }

    getTime = (time) => {
        this.setState({
            time
        });
    }

    getBatchName = (batchName, position) => {
        this.setState({
            batchName
        });
    }

    renderPickerItems = () => {
        let batches = NativeModules.FileManager.fetchBatchNames();
        let names = batches.split(",");
        names.pop();
        let pickerItems = [];
        for(let i=0; i<names.length; i++) {
            pickerItems.push(<Picker.Item label={names[i]} value={names[i]} key={names[i]}/>);
        }

        return pickerItems;
    }

    formatEvent = () => {
        let {
            title,
            batchName,
            description,
            time, 
            from,
            to,
        } = this.state;
        
        if(time != NotificationPreferences.TIME) {
            date = DATE.toString(from, time);
            from = DATE.toString(from, time);
            // to = DATE.toString(to, time);
            to = (this.state.to != "")? DATE.toString(to, time): "";
        } else {
            date = DATE.toString(from);
            from = DATE.toString(from);
            to = (this.state.to != "")? DATE.toString(to): "";
        }

        let event = { 
            title,
            batchName,
            description,
            date,
            from,
            to
        };

        console.log(event);

        EventManager.addEvent(event);
        this.props.navigation.navigate("Event");
    }

    authenticate = (authenticated) => {
        if(authenticated == true) {
            this.formatEvent();
        } else {
            ToastAndroid.show("Unable to verify password", ToastAndroid.SHORT);
            this.props.navigation.pop();
        }
    }

    callBottomSheet = () => {
        this.bottomSheetRef.current.snapTo(1);
    }

    render() {

        return (
            <SafeAreaView style={styles.screen}>
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.textInput}
                    mode="outlined"
                    label="Title"
                    onChangeText={this.getTitle}
                    value={this.state.title} />
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.textInput}
                    mode="outlined"
                    label="Description"
                    onChangeText={this.getDescription}
                    multiline={true}
                    value={this.state.description} />
                <Caption>From:</Caption>
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.textInput}
                    mode="outlined"
                    label="DD/MM/YYYY"
                    onChangeText={this.getFromDate}
                    value={this.state.from} />
                <Caption>To:</Caption>
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.textInput}
                    mode="outlined"
                    label="DD/MM/YYYY"
                    onChangeText={this.getToDate}
                    value={this.state.to} />
                <TextInput
                    theme={Theme.TEXT_INPUT_THEME}
                    style={styles.textInput}
                    mode="outlined"
                    label="Time"
                    onChangeText={this.getTime}
                    value={this.state.time} />
                <Caption style={styles.caption}>Select Batch Name</Caption>
                <Picker 
                    style={styles.picker}
                    selectedValue={this.state.batchName}
                    onValueChange={this.getBatchName}
                    mode="dropdown">
                        {this.renderPickerItems()}
                    <Picker.Item value="Pick batch" label="Pick batch" />
                </Picker>
                <Button
                    mode="text"
                    style={styles.button}
                    onPress={this.callBottomSheet}
                    color={Theme.SECONDARY_COLOR_DARK}
                >
                    Add Event
                </Button>
                { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
    },
    textInput: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
        marginBottom: 8,
    },
    button: {
        alignSelf: "center",
        width: "40%",
        padding: 8,
    },
    caption: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
        textAlign: "center"
    },
    picker: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
    },
});
