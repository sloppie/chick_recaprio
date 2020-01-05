import React, { PureComponent } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Dimensions,
} from 'react-native';

import { IncompleteEvent, CompleteEvent } from '../../Calendar/Fragments/Event';

import EventManager from '../../../utilities/EventManager'

const renderEvents = (eventType, navigation) => {
    let events = EventManager.fetchEvents(eventType);
    let eventsArr = [];
    for(let i=0; i<events.length; i++) {
        if(eventType == EventManager.INCOMPLETE)
            eventsArr.push(<IncompleteEvent navigation={navigation} key={i} event={events[i]} />);
        else
            eventsArr.push(<CompleteEvent navigation={props.navigation} key={i} event={events[i]} />);
    }

    return eventsArr;
}


export class IncompleteEvents extends PureComponent {

    render() {
        return (
            <ScrollView>
                {renderEvents(EventManager.INCOMPLETE, this.props.navigation)}
            </ScrollView>
        );
    }

}

export class CompleteEvents extends PureComponent {

    render() {
        return (
            <ScrollView>
                {renderEvents(EventManager.COMPLETE, this.props.navigation)}
            </ScrollView>
        );
    }

}

const styles = StyleSheet.create({

});
