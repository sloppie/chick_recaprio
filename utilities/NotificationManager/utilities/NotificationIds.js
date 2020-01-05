import { NativeModules } from 'react-native';


export default class NotificationId {

    static get NOTIFICATION_IDS() {
        let ids;

        try {
            ids = JSON.parse(NativeModules.NotificationManager.fetchNotificationIds());
        } catch(err) {
            ids = {};
            NotificationId.writeNotifications(ids);
        }

        return ids;
    }

    static writeNotifications(data) {
        NativeModules.NotificationManager.addNotificationId(JSON.stringify(data));
    }

    static formatNotificationId(eventObj) {
        let event = eventObj;
        let notificationId = `${event.batchName}_${event.title}_${event.description}`;

        return notificationId;
    }

    static addNotificationId(id: String, eventObj) {
        let NOTIFICATION_IDS = NotificationId.NOTIFICATION_IDS;
        NOTIFICATION_IDS[id] = NotificationId.formatNotificationId(eventObj);

        NotificationId.writeNotifications(NOTIFICATION_IDS);
    }

}