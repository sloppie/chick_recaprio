import React, { Component, PureComponent } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { FAB, Button, Caption } from 'react-native-paper';
import { CompleteEvent,IncompleteEvent } from './Fragments/Event';

//utilities
import EventManager from '../../utilities/EventManager';


export default class Calendar extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            incompleteEvents: [],
            completeEvents: [],
            render: false,
        };
    }

    componentDidMount() {
        let incompleteEvents = EventManager.fetchEvents(EventManager.INCOMPLETE);
        let completeEvents = EventManager.fetchEvents(EventManager.COMPLETE);
        console.log(JSON.stringify(completeEvents, null, 2))
        this.setState({
            completeEvents,
            incompleteEvents,
            render: true
        });
    }

    renderEvents = (eventType) => {
        let fetchedEvents = [];
        let events = [];

        if(eventType == EventManager.INCOMPLETE)
            fetchedEvents = this.state.incompleteEvents;
        else
            fetchedEvents = this.state.completeEvents;
        
        let length = (fetchedEvents.length >= 2)? 2: fetchedEvents.length;

        if(eventType == EventManager.INCOMPLETE) {
            for(let i=0; i<length; i++) {
                events.push(<IncompleteEvent navigation={this.props.navigation} event={fetchedEvents[i]} key={i}/>)
            }
        } else {
            for(let i=0; i<length; i++) {
                events.push(<CompleteEvent navigation={this.props.navigation} event={fetchedEvents[i]} key={i}/>)
            }
        }

        return events;
    }

    getIncomplete = () => {
        this.props.navigation.navigate("Events", {
            eventType: EventManager.INCOMPLETE
        });
    }

    getComplete = () => {
        this.props.navigation.navigate("Events", {
            eventType: EventManager.COMPLETE
        });
    }

    addEvent = () => {
        this.props.navigation.navigate("AddEvent");
    }

    render() {

        return (
            <View style={styles.screen}>
                <View style={styles.tab}>
                    <View style={styles.descriptionTab}>
                        <View style={styles.descriptionText}>
                            <Text style={styles.eventType}>Incomplete Events</Text>
                            <Caption>Events that are not complete</Caption>
                        </View>
                        <View style={styles.descriptionButton}>
                            <Button
                                onPress={this.getIncomplete}
                                color="cyan"
                                style={styles.navButton}>
                                <Text>MORE</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.scrollView}>
                        {(this.state.render) ? this.renderEvents(EventManager.INCOMPLETE) : <View />}
                    </View>
                </View>
                <View style={styles.tab}>
                    <View style={styles.descriptionTab}>
                        <View style={styles.descriptionText}>
                            <Text style={styles.eventType}>Complete Events</Text>
                            <Caption>Events that are complete</Caption>
                        </View>
                        <View style={styles.descriptionButton}>
                            <Button
                                onPress={this.getComplete}
                                color="red"
                                style={[styles.navButton, { backgroundColor: "green" }]}>
                                <Text>MORE</Text>
                            </Button>
                        </View>
                    </View>
                    <View style={styles.scrollView}>
                        {(this.state.render) ? this.renderEvents(EventManager.COMPLETE) : <View />}
                    </View>
                </View>
                <FAB
                    onPress={this.addEvent}
                    icon="plus"
                    style={styles.fab} />
            </View>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        height: "100%"
    },
    tab: {
        maxHeight: "50%",
        minHeight: "50%",
    },
    descriptionTab: {
        flexDirection: "row",
        width: (Dimensions.get("window").width - 32),
        alignSelf: "center",
        marginBottom: 16,
    },
    descriptionText: {
        flex: 3,
        paddingStart: 8,
    },
    eventType: {
        fontWeight: "700",
        fontSize: 20,
    },
    descriptionButton: {
        flex: 1,
        justifyContent: "center",
    },
    navButton: {
        backgroundColor: "red",
    },
    scrollView: {
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16
    },
});
