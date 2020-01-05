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
} from 'react-native-paper';

// utilities
import DATE from '../../../utilities/Date';


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
        console.log(JSON.stringify(date, null, 2))
    }

    getTime = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.time;
        }
    }

    getDay = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.dayNumber;
        }
    }

    getMonth = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.month;
        }
    }

    getYear = () => {
        if(!this.state.date) {
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
            <TouchableHighlight onPress={this.archiveEvent} underlayColor="#444">
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
            </TouchableHighlight>
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
        console.log("complete event" + JSON.stringify(this.props.event));
        let date = this.props.event["date"];
        console.log("This is the date: " + date);
        date = DATE.parse(date);
        this.setState({
            date
        });
        console.log(JSON.stringify(date, null, 2))
    }

    getTime = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.time;
        }
    }

    getDay = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.dayNumber;
        }
    }

    getMonth = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.month;
        }
    }

    getYear = () => {
        if(!this.state.date) {
            return "";
        } else {
            return this.state.date.year;
        }
    }

    render() {
        return (
            <View style={styles.card}>
            {/* <TouchableHighlight onPress={this.archiveEvent} underlayColor="#444"> */}
                <View style={styles.description}>
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
                <View style={[styles.status, {backgroundColor: "green"}]}></View>
                {/*</TouchableHighlight>*/}
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
});
