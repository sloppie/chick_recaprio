import { NativeModules } from 'react-native';

import DATE from '../Date';

import NotificationManager from '../NotificationManager';

export default class EventManager {

    static get INCOMPLETE() {
        return "incomplete";
    }

    static get COMPLETE() {
        return "complete";
    }
    
    static addEvent(event) {
        let events = EventManager.fetchEvents(EventManager.INCOMPLETE);
        events.unshift(event);
        
        // test
        for (let i = 1; i < events.length; i++) {
            let previousEvent = events[i - 1];
            let currentEvent = events[i];
            if (DATE.isSooner(previousEvent.date, currentEvent.date)) {
                break;
            } else {
                events[i - 1] = currentEvent;
                events[i] = previousEvent;
            }
        }
        
        EventManager.createEventNotifications(event);
        EventManager.writeEvents(EventManager.INCOMPLETE, events);
    }

    static fetchEvents(eventType) {
        let events;
        try {
            if (eventType == EventManager.COMPLETE)
                events = JSON.parse(NativeModules.EventManager.fetchCompleteEventsSync());
            else
                events = JSON.parse(NativeModules.EventManager.fetchIncompleteEventsSync());
            console.log(events)
        } catch (err) {
            events = [];
        }


        return events;
    }

    static archiveEvent(event) {
        let { expenses } = event;
        let incompleteEvents = EventManager.fetchEvents(EventManager.INCOMPLETE);
        let completeEvents = EventManager.fetchEvents(EventManager.COMPLETE);

        let result = EventManager.deleteEvent(incompleteEvents, event);
        incompleteEvents = result[0];
        let completedEvent = result[1];
        completedEvent['expenses'] = expenses;
        completeEvents.unshift(completedEvent);

        EventManager.writeEvents(EventManager.INCOMPLETE, incompleteEvents);
        EventManager.writeEvents(EventManager.COMPLETE, completeEvents);
    }

    // splice function
    static deleteEvent(eventsArr, event) {
        let events = eventsArr;
        let index = -1;
        for (let i = 0; i < eventsArr.length; i++) {
            if (event.date == eventsArr[i].date && eventsArr[i].title == event.title) {
                index = i;
            }
        }
        let splicedEvent = events.splice(index, 1)[0];
        let response = [events, splicedEvent];

        return response;
    }

    static spreadEvents(evnt) {
        let event = evnt;
        let offset = 1;
        let events = [];
        let from = DATE.parse(event.from).date;
        let dateObj = DATE.parse(event.to);
        let to = dateObj.date;
        let currentDate = dateObj.date;
        let time = DATE.parse(event.from).time;
        let { title, description, batchName } = event;

        while (currentDate != from) {
            let date = EventManager.stringify(offset, to);
            offset++;
            currentDate = date;
            date += ` ${time}`;
            let currentEvent = {
                title,
                description,
                date,
                batchName
            }

            events.push(currentEvent);
        }
        let date = event.to
        let lastEvent = {
            title,
            description,
            date,
            batchName
        }

        events.unshift(lastEvent);

        return events;
    }

    static createEventNotifications(event) {
        if(event.from == event.to || event.to == "") {
            NotificationManager.scheduleEvent(event);
        } else {
            let eventsArr = EventManager.spreadEvents(event);

            for(let i=0; i<eventsArr.length; i++) {
                NotificationManager.scheduleEvent(eventsArr[i]);
            }
        }
    }

    static writeEvents(eventType, data) {
        let stringifiedData = JSON.stringify(data);
        if (eventType == EventManager.INCOMPLETE) {
            NativeModules.EventManager.addEvent(stringifiedData);
        } else {
            NativeModules.EventManager.archiveEvent(stringifiedData);
        }
    }

    static stringify(offset, dt) {
        let arr = dt.split(" ");
        
        // let todaysDate = new Date(dt);
        let day;// = todaysDate.getDay();
        let date = Number(arr[1]);// = todaysDate.getDate();
        let month;// = todaysDate.getMonth();
        let year = Number(arr[2]); // = todaysDate.getFullYear();
        for(let i=0; i<12; i++) {
            if(DATE.months[i][0] == arr[0]) {
                month = i;
                console.log("This is month: " + month)
                break;
            }
        }

        for (let i = 0; i < offset; i++) {
            if (date > 1) {
                date--;
            } else {
                month--;
                date = DATE.months[month][1];
            }
        }

        return `${DATE.months[month][0]} ${DATE.normaliseDate(date)} ${year}`;

    }
}
