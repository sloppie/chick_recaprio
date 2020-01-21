import React, { Component, PureComponent } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    ScrollView,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { FAB, Button, Caption, Card, List, Colors, Surface, IconButton } from 'react-native-paper';
import { CompleteEvent,IncompleteEvent } from './Fragments/Event';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

//utilities
import EventManager from '../../utilities/EventManager';
import Theme from '../../theme';
import { APP_STORE } from '../..';
import { EVENT_ADDED, EVENT_ARCHIVED } from '../../store';


export default class Calendar extends PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            incompleteEvents: [],
            completeEvents: [],
            render: false,
            iconButtColor: [Theme.SECONDARY_COLOR_DARK, Theme.PRIMARY_COLOR],
        };

        this.scrollViewRef = React.createRef();
    }

    componentDidMount() {
        let incompleteEvents = EventManager.fetchEvents(EventManager.INCOMPLETE);
        let completeEvents = EventManager.fetchEvents(EventManager.COMPLETE);
        this.setState({
            completeEvents,
            incompleteEvents,
            render: true
        });
        this.eventsAdded = APP_STORE.subscribe(EVENT_ADDED, this.fetchIncompleteEvents.bind(this));
        this.eventsArchived = APP_STORE.subscribe(EVENT_ARCHIVED, this.fetchCompleteEvents.bind(this));
    }

    componentWillUnmount() {
        APP_STORE.unsubscribe(EVENT_ADDED, this.eventsAdded);
        APP_STORE.unsubscribe(EVENT_ARCHIVED, this.eventsArchived);
    }

    fetchIncompleteEvents = () => {
        let incompleteEvents = EventManager.fetchEvents(EventManager.INCOMPLETE);
        this.setState({
            incompleteEvents,
        });
    }

    fetchCompleteEvents = () => {
        let completeEvents = EventManager.fetchEvents(EventManager.COMPLETE);
        this.setState({
            completeEvents,
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

    renderRedButton = () => {
        return (
            <Button
                onPress={this.getIncomplete}
                color={Colors.green500}
                style={[styles.navButton, { backgroundColor: Colors.red500 }]}>
                <Text>MORE</Text>
            </Button>
        );
    }

    renderGreenButton = (props) => {
        return (
            <Button
                onPress={this.getComplete}
                color="red"
                style={[styles.navButton, { backgroundColor: Colors.red500 }]}>
                <Text>MORE</Text>
            </Button>
        );
    }

    scrollTo = (x) => {
        let iconButtColor;
        let scrollObj = {
            x,
            y: 0,
            animated: true,
        };

        this.scrollViewRef.current.scrollTo(scrollObj)

        if(x == 0) {
            iconButtColor = [Theme.SECONDARY_COLOR_DARK, Theme.PRIMARY_COLOR];
        } else {
            iconButtColor = [Theme.PRIMARY_COLOR, Theme.SECONDARY_COLOR_DARK]
        }

        this.setState({
            iconButtColor,
        });
    }

    render() {

        let { width } = Dimensions.get("window");

        return (
            <SafeAreaView>
                <ScrollView 
                    nestedScrollEnabled={true}
                    horizontal={true} 
                    style={styles.screen}
                    ref={this.scrollViewRef}
                    scrollEnabled={false}
                >
                    <ScrollView 
                        style={styles.eventContainer}
                        stickyHeaderIndices={[0]}
                    >
                        <View style={styles.headerContainer}>
                            <Card style={styles.header}>
                                <Card.Title
                                    style={styles.titleContainer}
                                    title="Incomplete Events"
                                    titleStyle={styles.headerTitle}
                                    right={props => <List.Icon icon="calendar-clock" color={Theme.PRIMARY_COLOR} />} />
                            </Card>
                        </View>
                        <List.Section
                            title="Events that have not yet been archived"
                        >
                            {/* <List.Item
                                onPress={this.getIncomplete.bind(this)}
                            /> */}
                            {(this.state.render) ? this.renderEvents(EventManager.INCOMPLETE) : <View />}
                        </List.Section>
                    </ScrollView>
                    <ScrollView style={styles.eventContainer}>
                        <View style={styles.headerContainer}>
                            <Card style={styles.header}>
                                <Card.Title
                                    style={styles.titleContainer}
                                    title="Incomplete Events"
                                    titleStyle={styles.headerTitle}
                                    right={props => <List.Icon icon="calendar-multiple-check" color={Theme.PRIMARY_COLOR} />} />
                            </Card>
                        </View>
                        <List.Section
                            title="Events that have been archived"
                        >
                            {/* <List.Item
                                onPress={this.getComplete.bind(this)}
                            /> */}
                            {(this.state.render) ? this.renderEvents(EventManager.COMPLETE) : <View />}
                        </List.Section>
                    </ScrollView>
                </ScrollView>
                <Surface style={styles.bottomNavBar}>
                    <View>
                        <IconButton
                            icon="calendar-clock"
                            rippleColor={Theme.SECONDARY_COLOR_DARK}
                            color={this.state.iconButtColor[0]}
                            onPress={this.scrollTo.bind(this, 0)}
                        />
                        <Icon style={styles.pageIndicator} name="circle-medium" color={this.state.iconButtColor[0]}/>
                    </View>
                    <View>
                        <IconButton
                            icon="calendar-multiple-check"
                            rippleColor={Theme.SECONDARY_COLOR_DARK}
                            color={this.state.iconButtColor[1]}
                            onPress={this.scrollTo.bind(this, width)}
                        />
                        <Icon style={styles.pageIndicator} name="circle-medium" color={this.state.iconButtColor[1]} />
                    </View>
                </Surface>
                <FAB
                    onPress={this.addEvent}
                    icon="plus"
                    style={styles.fab} />
            </SafeAreaView>
        );
    }

}

const styles = StyleSheet.create({
    screen: {
        minHeight: "100%",
        maxHeight: "100%",
    },
    eventContainer: {
        width: Dimensions.get("window").width,
        height: "100%",
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
        textAlign: "center",
        fontSize: 16,
        color: "#777"
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
        height: "70%"
    },
    scrollView: {
    },
    bottomNavBar: {
        position: "absolute",
        bottom: 0,
        marginBottom: 16,
        flexDirection: "row",
        alignSelf: "center"
    },
    pageIndicator: {
        textAlign: "center",
        padding: 0,
        margin: 0,
    },
    fab: {
        position: "absolute",
        right: 0,
        bottom: 0,
        margin: 16,
        backgroundColor: Theme.SECONDARY_COLOR_DARK,
    },
});
