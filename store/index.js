import { DeviceEventEmitter } from 'react-native';

const EVENT_ADDED = "EVENT_ADDED";
const EVENT_ARCHIVED = "EVENTS_ARCHIVED";
const EGGS_ADDED = "EGGS_ADDED";
const FEEDS_ADDED = "FEEDS_ADDED";
const CASUALTIES_ADDED = "CASUALTIES_ADDED";
const INVENTORY_FEEDS_ADDED = "INV_FEEDS_ADDED";
const INVENTORY_EGGS_ADDED = "INV_EGGS_ADDED";
const BATCH_CREATED = "BATCH_CREATED";
const PICK_UP_ADDED = "PICK_UP_ADDED";
const PICK_UP_PRICE_ADDED = "PICK_UP_PRICE_ADDED";
const NEW_FEED_TYPE_ADDED = "NEW_FEED_TYPE_ADDED";


export default class Store {
    
    constructor(evnts) {
        let regEvents = evnts

        this.events = {};

        regEvents.forEach(event => {
            this.events[event.name] = event;
        });
        // console.log(`this are the events: ${JSON.stringify(this.events, null, 2)}`)
    }

    subscribe(eventName, action) {
        let eventKey = eventName.toUpperCase();
        let eventId = this.events[eventName].subscribe(action);

        return eventId;
    }

    unsubscribe(eventName, componentId) {
        this.events[eventName].unsubscribe(componentId);
    }

}


export class Event {

    constructor(name: string) {
        this.id = 1;
        this.eventName = name.toUpperCase();
        this.subscribedComponents = {};
        this.event = DeviceEventEmitter.addListener(this.eventName, this.actionCallback.bind(this));
    }

    get name() {
        return this.eventName;
    }

    subscribers() {
        let all = Object.keys(this.subscribedComponents);
        console.log("All in its glory: " + JSON.stringify(all, null, 2))

        let active = [];
        all.forEach(sub => {
            if(typeof this.subscribedComponents[sub] == "function")
                active.push(sub);
        });

        console.log(JSON.stringify(active, null, 2))

        return active;
    }

    get ID() {
        let pID = `${this.name}_${this.id}`;
        this.id++;

        return pID;
    }

    subscribe(action) {
        let componentId = this.ID;
        this.subscribedComponents[componentId] = action;

        return componentId;
    }

    unsubscribe(componentId) {
        this.subscribedComponents[componentId] = undefined;
    }

    isSubscriber(component) {
        let active = this.subscribers;
        let subscriber = (active.indexOf(component) !== -1);

        return subscriber;
    }

    actionCallback() {
            let followers = this.subscribers();
            console.log(JSON.stringify(followers, null, 2));
            // followers.forEach(subscriber => {
            //     this.subscribedComponents[subscriber]();
            // });
            for(let i=0; i<followers.length; i++) {
                let sub = followers[i];
                let action = this.subscribedComponents[sub];
                action();
            }
    }    

}

export {
    EGGS_ADDED,
    FEEDS_ADDED,
    CASUALTIES_ADDED,
    INVENTORY_EGGS_ADDED,
    INVENTORY_FEEDS_ADDED,
    EVENT_ADDED,
    EVENT_ARCHIVED,
    BATCH_CREATED,
    PICK_UP_ADDED,
    PICK_UP_PRICE_ADDED,
    NEW_FEED_TYPE_ADDED,
};
