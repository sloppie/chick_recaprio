import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';

import { IncompleteEvents, CompleteEvents } from './fragments';

import EventManager from '../../utilities/EventManager';


export default class Events extends PureComponent {

    renderEvents = () => {
        let { navigation } = this.props;
        let eventType = navigation.getParam("eventType", {
            eventType: EventManager.INCOMPLETE,
        });

        if (eventType == EventManager.INCOMPLETE) 
            return <IncompleteEvents naviagtion={ navigation }/>
        else 
            return <CompleteEvents navigation={ navigation }/>
    }

    render() {
        return this.renderEvents();
    }

}
