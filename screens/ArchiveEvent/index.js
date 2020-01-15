import React, { PureComponent } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Dimensions,
    ToastAndroid,
} from 'react-native';

import { TextInput, Button, List, Card, Paragraph } from 'react-native-paper';
import Icon from 'react-native-ionicons';

import EventManager from '../../utilities/EventManager';
import SecurityManager from '../../utilities/SecurityManager';


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
                <View style={styles.screen}>
                    {/* <View style={styles.batchNameContainer}>
                        <Text style={styles.batchName}>{this.state.event.batchName}</Text>
                    </View>
                    <View style={styles.titleContainer}>
                        <Icon style={styles.titleIcon} name="pricetag" />
                        <Text style={styles.title}>{this.getTitle()}</Text>
                    </View>
                    <View style={styles.descriptionContainer}>
                        <Text style={styles.description}>{this.getDescription()}</Text>
                    </View>
                    <View style={styles.dateContainer}>
                        <View style={styles.timeContainer}>
                            <Icon style={styles.timeIcon} name="time" />
                            <Text style={styles.time}>{this.getTime()}</Text>
                        </View>
                        <View style={styles.calendarContainer}>
                            <Icon name="calendar" style={styles.calendarIcon} />
                            <Text style={styles.calendar}>{`${this.getMonth()} ${this.getDay()}, ${this.getYear()}`}</Text>
                        </View>
                    </View>
                    <View style={styles.textInputContainer}>
                        <Icon name="pricetags" style={styles.expensesIcon}/>
                        <TextInput
                            style={styles.textInput}
                            mode="outlined"
                            keyboardType="numeric"
                            label="Expenses"
                            onChangeText={this.setExpenses}
                            value={String(this.state.expenses)} />
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button
                            style={styles.button}
                            color="white"
                            icon="archive"
                            mode="outlined"
                            onPress={this.callBottomSheet}>
                            <Text style={styles.buttonIcon}>Complete Event</Text>
                        </Button>
                    </View> */}
                    <List.Item 
                        title={this.state.event.batchName}
                    />
                    {/* <List.Item 
                        title={this.getTitle()}
                        description="Title of the event below"
                        left={props => <List.Icon {...props} icon="tag"/>}
                    /> */}
                    <Card>
                        <Card.Title title={this.getTitle()} subtitle="Name of the event"/>
                        <Card.Content>
                            <Paragraph>{this.getDescription()}</Paragraph>
                        </Card.Content>
                    </Card>
                    <List.Item 
                        title={this.getTime()}
                        description="Reminder time for the event"
                        left={props => <List.Icon {...props} icon="clock"/>}
                    />
                    <List.Item 
                        title={`${this.getMonth()} ${this.getDay()}, ${this.getYear()}`}
                        description="Date of the event"
                        left={props => <List.Icon {...props} icon="calendar"/>}
                    />
                    <View style={styles.textInputContainer}>
                        <Icon name="pricetags" style={styles.expensesIcon}/>
                        <TextInput
                            style={styles.textInput}
                            mode="outlined"
                            keyboardType="numeric"
                            label="Expenses"
                            onChangeText={this.setExpenses}
                            value={String(this.state.expenses)} />
                    </View>
                    <Button
                        style={styles.button}
                        color="white"
                        icon="archive"
                        mode="outlined"
                        onPress={this.callBottomSheet}>
                        <Text style={styles.buttonIcon}>Complete Event</Text>
                    </Button>
                    { SecurityManager.runAuthenticationQuery(this.bottomSheetRef, this.authenticate) }
                </View>
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
        padding: 16,
        minHeight: "100%"
    },
    batchNameContainer: {
    },
    batchName: {
        fontSize: 30,
        fontWeight: "700",
        color: "#444",
        textAlign: "center",
    },
    titleContainer: {
        flexDirection: "row",
    },
    title: {
        flex: 8,
        fontSize: 30,
        fontWeight: "600",
        color: "#444",
    },
    titleIcon: {
        flex: 1,
        textAlign: "center",
        textAlignVertical: "center",
    },
    descriptionContainer: {
        borderStartWidth: 3,
        borderStartColor: "#666",
        width: "70%",
        alignSelf: "center",
        height: "30%"
    },
    description: {
        paddingStart: 8
    },
    dateContainer: {
    },
    timeContainer: {
        flexDirection: "row",
    },
    timeIcon: {
        textAlign: "center",
        textAlignVertical: "center",
        color: "#444",
    },
    time: {
        flex: 8,
        fontSize: 30,
        fontWeight: "700",
        color: "#444",
        paddingStart: 8
    },
    calendarContainer: {
        flexDirection: "row",
    },
    calendarIcon: {
        textAlign: "center",
        textAlignVertical: "center",
        color: "#444",
    },
    calendar: {
        flex: 8,
        fontSize: 30,
        fontWeight: "700",
        color: "#444",
        paddingStart: 8
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
        marginStart: 8,
        flex: 7,
        alignSelf: "center",
        // minWidth: Dimensions.get("window").width - 32,
        // maxWidth: Dimensions.get("window").width - 32,
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
