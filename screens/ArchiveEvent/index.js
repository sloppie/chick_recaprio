import React, { PureComponent } from 'react';
import {
    Text,
    View,
    ScrollView,
    StyleSheet,
    Dimensions,
    ToastAndroid,
} from 'react-native';

import { TextInput, Button, List, Card, Paragraph } from 'react-native-paper';
import Icon from 'react-native-ionicons';

import EventManager from '../../utilities/EventManager';
import SecurityManager from '../../utilities/SecurityManager';
import Theme from '../../theme';


export default class ArchiveEvent extends PureComponent {
    constructor(props) {
        super(props);

        this.bottomSheetRef = React.createRef();

        this.state = {
            render: false,
            expenses: ""
        }
    }

    componentDidMount() {
        let event = this.props.navigation.getParam("event", {
            event: {
                title: "",
                batchName: "",
                description: "",
                date: "",
            }
        });

        let date = this.props.navigation.getParam("date", {
            date: {
                dayNumber: "",
                year: "",
                month: "",
                time: ""
            }
        });

        this.setState({
            event,
            date,
            render: true
        });
    }

    getTitle = () => {
        return this.state.event.title;
    }

    getDescription = () => {
        return this.state.event.description;
    }

    getDate = () => {
        return this.state.event.date;
    }

    getTime = () => {
        let { time } = this.state.date;
        time = time.replace(/\W\d{2}/, "");
        return time;
    }

    getDay = () => {
        return this.state.date.dayNumber;
    }

    getMonth = () => {
        return this.state.date.month;
    }

    getYear = () => {
        return this.state.date.year;
    }

    setExpenses = (value) => {
        this.setState({
            expenses: Number(value),
        });
    }

    archiveEvent = () => {
        let { event } = this.state;
        let { expenses } = this.state;
        event.expenses = expenses;

        if(expenses != "") {
            EventManager.archiveEvent(event);
            this.props.navigation.pop();
        } else {
            ToastAndroid.show("Add Expenses to Archive Event", ToastAndroid.SHORT);
        }
    }

    authenticate = (authenticated) => {
        if(authenticated == true) {
            this.archiveEvent();
        } else {
            ToastAndroid.show("Unable to Autheticate. Please try again", ToastAndroid.SHORT);
        }
    }

    callBottomSheet = () => {
        this.bottomSheetRef.current.snapTo(1);
    }

    renderScreen = () => {
        if (this.state.render) {
            return (
                <ScrollView style={styles.screen} stickyHeaderIndices={[0]}>
                    <View style={styles.headerContainer}>
                        <Card style={styles.header}>
                            <Card.Title
                                style={styles.titleContainer}
                                title={this.state.event.batchName ? this.state.event.batchName : "No attatched batch"}
                                titleStyle={styles.headerTitle}
                                right={props => <List.Icon icon="clipboard-check" color={Theme.PRIMARY_COLOR} />} />
                        </Card>
                    </View>
                    <TextInput
                        theme={Theme.TEXT_INPUT_THEME}
                        style={styles.textInput}
                        mode="outlined"
                        keyboardType="numeric"
                        label="Expenses"
                        onChangeText={this.setExpenses}
                        value={String(this.state.expenses)}
                        placeholder="Enter the expenses incurred"
                    />
                    {/* <List.Item 
                        title={this.state.event.batchName}
                    /> */}
                    {/* <List.Item 
                        title={this.getTitle()}
                        description="Title of the event below"
                        left={props => <List.Icon {...props} icon="tag"/>}
                    /> */}
                    <List.Section title="Event description">
                        <Card style={styles.eventDescription}>
                            <Card.Title title={this.getTitle()} subtitle="Name of the event" />
                            <Card.Content>
                                <Paragraph>{this.getDescription()}</Paragraph>
                            </Card.Content>
                        </Card>
                        <List.Item
                            title={`${this.getMonth()} ${this.getDay()}, ${this.getYear()}`}
                            description="Date of the event"
                            left={props => <List.Icon {...props} icon="calendar" color={Theme.PRIMARY_COLOR} />}
                        />
                        <List.Item
                            title={this.getTime()}
                            description="Reminder time for the event"
                            left={props => <List.Icon {...props} icon="clock" color={Theme.PRIMARY_COLOR} />}
                        />
                        {/* <View style={styles.textInputContainer}> */}
                        {/* <Icon name="pricetags" style={styles.expensesIcon}/> */}
                        {/* </View> */}
                    </List.Section>
                    <Button
                        style={styles.button}
                        color={Theme.SECONDARY_COLOR_DARK}
                        icon="archive"
                        mode="outlined"
                        onPress={this.callBottomSheet}>
                        <Text style={styles.buttonIcon}>Complete Event</Text>
                    </Button>
                    { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
                </ScrollView>
            );
        } else {
            return <View />
        }
    }

    render() {
        return (
            this.renderScreen()
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%"
    },
    headerContainer: {
        backgroundColor: Theme.PRIMARY_BACKGROUND_COLOR,
    },
    header: {
        elevation: 0,
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
        fontSize: 16,
        color: "#777"
    },
    eventDescription: {
        elevation: 0,
    },
    textInputContainer: {
        flexDirection: "row",
    },
    expensesIcon: {
        textAlign: "center",
        textAlignVertical: "center",
        color: "#444",
    },
    textInput: {
        alignSelf: "center",
        minWidth: Dimensions.get("window").width - 32,
        maxWidth: Dimensions.get("window").width - 32,
        marginBottom: 8,
    },
    buttonContainer: {
        justifyContent: "flex-end",
        height: "25%"
    },
    button: {
        padding: 8,
        alignSelf: "center",
        width: "60%",
    },
    buttonIcon: {
    },
});
