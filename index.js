/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import StoreManager, * as Store from './store';

let eventArr = [];

eventArr.push(new Store.Event(Store.EGGS_ADDED));
eventArr.push(new Store.Event(Store.FEEDS_ADDED));
eventArr.push(new Store.Event(Store.CASUALTIES_ADDED));
eventArr.push(new Store.Event(Store.EVENT_ADDED));
eventArr.push(new Store.Event(Store.EVENT_ARCHIVED));
eventArr.push(new Store.Event(Store.INVENTORY_EGGS_ADDED));
eventArr.push(new Store.Event(Store.INVENTORY_FEEDS_ADDED));
eventArr.push(new Store.Event(Store.PICK_UP_ADDED));
eventArr.push(new Store.Event(Store.PICK_UP_PRICE_ADDED));
eventArr.push(new Store.Event(Store.BATCH_CREATED));
eventArr.push(new Store.Event(Store.NEW_FEED_TYPE_ADDED));

const APP_STORE = new StoreManager(eventArr);

export { APP_STORE };

AppRegistry.registerComponent(appName, () => App);
