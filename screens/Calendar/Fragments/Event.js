import React, { Component, PureComponent } from 'react';
import {
    Text,
    View,
    TouchableHighlight,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Caption,
    List,
    Colors
} from 'react-native-paper';

// utilities
import DATE from '../../../utilities/Date';
import Theme from '../../../theme';


export class IncompleteEvent extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            done: false,
            date: null
        };

    }

    componentDidMount() {
        this.timeConverter();
    }

    timeConverter = () => {
        let date = DATE.parse(this.props.event.date)
        this.setState({
            date
        });
    }

    getTime = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.time;
        }
    }

    getDay = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.dayNumber;
        }
    }

    getMonth = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.month;
        }
    }

    getYear = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.year;
        }
    }

    archiveEvent = () => {
        let { event } = this.props;
        let { date } = this.state;
        this.props.navigation.navigate("ArchiveEvent", {
            event,
            date
        });
    }

    render() {
        return (
            <View>
                {/* <TouchableHighlight onPress={this.archiveEvent} underlayColor="#444">
            <View style={styles.card}>
                <View style={styles.description}>
                    <Text style={styles.title}>{this.props.event.title}</Text>
                    <Caption>{this.props.event.description}</Caption>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>#{this.props.event.batchName}</Text>
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{this.getTime()}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                        <Text style={styles.day}>{this.getDay()}</Text>
                    </View>
                    <View style={styles.yearContainer}>
                        <Text style={styles.year}>{`${this.getMonth()} ${this.getYear()}`}</Text>
                    </View>
                </View>
                <View style={[styles.status, {backgroundColor: "red"}]}></View>
            </View>
            </TouchableHighlight> */}
                <View style={styles.eventContainer}>
                    <List.Accordion
                        theme={Theme.TEXT_INPUT_THEME}
                        title={this.props.event.title}
                        description={this.props.event.description}
                        left={props => <List.Icon {...props} icon="calendar-clock" />}
                        style={[styles.eventAccordion, styles.incompleteEvent]}
                    >
                        <List.Item
                            title="Time"
                            titleStyle={styles.eventItemTitle}
                            description={`${this.getTime()} on: ${this.getMonth()} ${this.getDay()}, ${this.getYear()}`}
                            left={props => <List.Icon {...props} icon="clock" color={Theme.PRIMARY_COLOR} />}
                            style={[styles.eventItems, styles.incompleteEvent]}
                        />
                        <List.Item
                            title="Archive"
                            titleStyle={styles.eventItemTitle}
                            description="Press to run the archive dialog"
                            left={props => <List.Icon {...props} icon="archive" color={Theme.PRIMARY_COLOR} />}
                            onPress={this.archiveEvent}
                            style={[styles.eventItems, styles.incompleteEvent]}
                        />
                    </List.Accordion>
                </View>

            </View>
        );
    }

}


export class CompleteEvent extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            done: false,
            date: null
        };

    }

    componentDidMount() {
        this.timeConverter();
    }

    timeConverter = () => {
        let date = this.props.event["date"];
        date = DATE.parse(date);
        this.setState({
            date
        });
    }

    getTime = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.time;
        }
    }

    getDay = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.dayNumber;
        }
    }

    getMonth = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.month;
        }
    }

    getYear = () => {
        if (!this.state.date) {
            return "";
        } else {
            return this.state.date.year;
        }
    }

    render() {
        return (
            <View style={styles.eventContainer}>
                {/* <TouchableHighlight onPress={this.archiveEvent} underlayColor="#444"> */}
                {/* <View style={styles.description}>
                    <Text style={styles.title}>{this.props.event.title}</Text>
                    <Caption>{this.props.event.description}</Caption>
                    <View style={styles.expenses}>
                        <Text>KSH{this.props.event.expenses}</Text>
                    </View>
                    <View style={styles.tag}>
                        <Text style={styles.tagText}>#{this.props.event.batchName}</Text>
                    </View>
                </View>
                <View style={styles.dateContainer}>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>{this.getTime()}</Text>
                    </View>
                    <View style={styles.dayContainer}>
                        <Text style={styles.day}>{this.getDay()}</Text>
                    </View>
                    <View style={styles.yearContainer}>
                        <Text style={styles.year}>{`${this.getMonth()} ${this.getYear()}`}</Text>
                    </View>
                </View>
                <View style={[styles.status, {backgroundColor: "green"}]}></View> */}
                {/*</TouchableHighlight>*/}
                <List.Accordion
                    title={this.props.event.title}
                    description={this.props.event.description}
                    left={props => <List.Icon {...props} icon="calendar-check" />}
                    style={[styles.eventAccordion, styles.completeEvent]}
                >
                    <List.Item
                        title="Time"
                        description={`${this.getTime()} on: ${this.getMonth()} ${this.getDay()}, ${this.getYear()}`}
                        left={props => <List.Icon {...props} icon="clock" />}
                        style={[styles.eventItems, styles.completeEvent]}
                    />
                    <List.Item
                        title={`KSH${this.props.event.expenses}`}
                        description="Expenses"
                        left={props => <List.Icon {...props} icon="tag" />}
                        style={[styles.eventItems, styles.completeEvent]}
                    />
                </List.Accordion>
            </View>
        );
    }

}

const styles = StyleSheet.create({
    th: {
        borderRadius: 10,
    },
    card: {
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        flexDirection: "row",
        borderRadius: 10,
        marginBottom: 8,
    },
    description: {
        flex: 6,
        padding: 8,
    },
    title: {
        fontSize: 18
    },
    caption: {},
    tag: {
        borderRadius: 10,
        minWidth: "30%",
        maxWidth: "30%",
        padding: 4,
        backgroundColor: "#f1f1f1"
    },
    tagText: {
        textAlign: "center",
    },
    dateContainer: {
        flex: 3,
        textAlign: "center",
        justifyContent: "center"
    },
    timeContainer: {
    },
    time: {
        textAlign: "center",
    },
    dayContainer: {
    },
    day: {
        fontSize: 30,
        fontWeight: "700",
        textAlign: "center",
    },
    yearContainer: {},
    year: {
        textAlign: "center",
    },
    date: {
        textAlign: "center",
    },
    status: {
        flex: 1,
        borderTopEndRadius: 10,
        borderBottomEndRadius: 10,
    },
    eventContainer: {
        minWidth: (Dimensions.get("window").width - 32),
        maxWidth: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 4,
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
    },
    eventAccordion: {
        borderTopEndRadius: 0,
        borderTopStartRadius: 0,
    },
    eventItems: {
        minWidth: (Dimensions.get("window").width - 64),
        maxWidth: (Dimensions.get("window").width - 64),
        alignSelf: "flex-end",
    },
    eventItemTitle: {
        color: Theme.PRIMARY_COLOR,
    },
    completeEvent: {
        borderEndColor: Colors.green500,
        borderEndWidth: 3,
    },
    incompleteEvent: {
        borderEndColor: Colors.red500,
        borderEndWidth: 3,
    },
});
