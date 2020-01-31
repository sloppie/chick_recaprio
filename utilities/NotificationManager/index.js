import { NativeModules } from 'react-native';
// var PushNotification = require("react-native-push-notification");
import PushNotification from 'react-native-push-notification';
import DATE from '../Date';

import EggPreferences from './utilities/EggPreferences';
import NotificationPreferences from './utilities/NotificationPreferences';
import NotificationId from './utilities/NotificationIds';


export default class NotificationManager {

    static get EGG_REMINDER_ID() {
        return '69';
    }

    constructor() {
        PushNotification.configure({
            // (optional) Called when Token is generated (iOS and Android)
            onRegister: function (token) {
                console.log("TOKEN:", token);
            },

            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                console.log("NOTIFICATION:", notification);

                // process the notification

                // required on iOS only (see fetchCompletionHandler docs: https://github.com/react-native-community/react-native-push-notification-ios)
                // notification.finish(PushNotificationIOS.FetchResult.NoData);
            },

            // ANDROID ONLY: GCM or FCM Sender ID (product_number) (optional - not required for local notifications, but is need to receive remote push notifications)
            senderID: "YOUR GCM (OR FCM) SENDER ID",

            // IOS ONLY (optional): default: all - Permissions to register.
            permissions: {
                alert: true,
                badge: true,
                sound: true
            },

            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
             * (optional) default: true
             * - Specified if permissions (ios) and token (android and ios) will requested or not,
             * - if not, you must call PushNotificationsHandler.requestPermissions() later
             */
            requestPermissions: true
        });
    }

    static fetchNotificationId() {
        let id = NativeModules.Sessions.fetchNotificationId();

        return id;
    }

    static writeNotificationId(id) {
        let nextId = Number(id) + 1;
        NativeModules.Sessions.writeNotificationId(String(nextId));
    }

    static redoTime(dt) {
       
    }

    addScheduledEvent(notificationsObj) {
        console.log("Custom event got to this part");
        let event = notificationsObj;
        let id = NotificationManager.fetchNotificationId();
        let newDate = `${event.date} GMT+0300`;
        let date = new Date(newDate);
        let { title, description } = event;
        let timestamp = Date.parse(newDate);
        if(isNaN(timestamp)) {
            newDate = DATE.getNumeralDate(newDate);
            timestamp = Date.parse(newDate);
            console.log("Scheduled date: " + timestamp);
        }

        PushNotification.scheduleLocalNotification({
            id,
            color: "red",
            subText: "Event notification",
            autoCancel: true,
            largeIcon: "chicken",
            smallIcon: "chicken",
            vibrate: NotificationPreferences.VIBRATION,
            vibration: 300,
            priority: "high",
            visibility: "private",
            group: "group",
            importance: "high",

            title,
            message: description,
            fireDate: timestamp
        });

        console.log("event set: " + timestamp)
        NotificationManager.writeNotificationId(id);
        NotificationId.addNotificationId(id, event);
    } 

    static scheduleEvent(notificationsObj) {
        let se = notificationsObj;
        let event = new NotificationManager();
        event.addScheduledEvent(se);
    }

    static eggCollectionReminder() {
        new NotificationManager();
        let time = EggPreferences.TIME;
        time.split(":");
        let date;
        let timeToday = new Date().getHours();
        let timeString;
        if(timeToday <= Number(time[0])) {
            date = new Date();
            let currentDate = date.getDate();
            date.setDate(currentDate + 1);
            timeString = date.toDateString() + " " + time + " GMT+0300";
        } else {
            timeString = new Date().toDateString() + " " + time + " GMT+0300";
        }

        let timestamp = Date.parse(timeString);
        if(isNaN(timestamp)) {
            timestamp = Date.parse(DATE.getNumeralDate(timeString));
        }
        PushNotification.scheduleLocalNotification({
            /* Android Only Properties */
            id: EggPreferences.ID,
            autoCancel: true,
            largeIcon: "chicken",
            smallIcon: "chicken",
            bigText: "This is a set reminder to ensure you input the number of eggs collected today",
            subText: "Input Reminder",
            color: "red",
            vibrate: EggPreferences.VIBRATION,
            vibration: 300,
            tag: 'some_tag',
            group: "group",
            ongoing: false,
            priority: "high",
            visibility: "private",
            importance: "high",         

            /* iOS and Android properties */
            title: "Eggs Collected",
            message: "Input number of eggs collected today",
            playSound: EggPreferences.PLAY_SOUND,
            soundName: 'default',
            repeatType: 'time',
            repeatTime: 86400000,
            number: '10',
            actions: '["Yes", "No"]',
            fireDate: timestamp,
        });
    }

} 


export { EggPreferences, NotificationPreferences };
