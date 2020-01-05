import { NativeModules } from 'react-native';


export default class NotificationPreferences {

    static get NOTIFICATION_PREF() {
        let preferences;

        try {
            preferences = JSON.parse(NativeModules.NotificationManager.fetchNotificationPref());
        } catch (err) {
            preferences = {
                "TIME": "08:00:00",
                "PLAY_SOUND": true,
                "VIBRATION": true,
            };

            NotificationPreferences.writeNotificatiionsPref(preferences);
        }

        return preferences;
    }

    static writeNotificatiionsPref(preferences) {
        NativeModules.NotificationManager.setNotificationPref(JSON.stringify(preferences));
    }

    static getKey(key) {
        let NOTIFICATION_PREF = NotificationPreferences.NOTIFICATION_PREF;
        let value = NOTIFICATION_PREF[key];

        return value;
    }

    static setKey(key, value) {
        let NOTIFICATION_PREF = NotificationPreferences.NOTIFICATION_PREF;
        NOTIFICATION_PREF[key] = value;

        NotificationPreferences.writeNotificatiionsPref(NOTIFICATION_PREF);
    }

    static get TIME(): String {
        let TIME = NotificationPreferences.getKey("TIME");
        
        return TIME;
    }

    static set TIME(newTime: String) {
        NotificationPreferences.setKey("TIME", newTime);
    }

    static get PLAY_SOUND() {
        let PLAY_SOUND = NotificationPreferences.getKey("PLAY_SOUND");

        return PLAY_SOUND;
    }

    static set PLAY_SOUND(bool: Boolean) {
        NotificationPreferences.setKey("PLAY_SOUND", bool);
    }

    static get VIBRATION() {
        let VIBRATION = NotificationPreferences.getKey("VIBRATION");

        return VIBRATION;
    }

    static set VIBRATION(bool: Boolean) {
        NotificationPreferences.setKey("VIBRATION", bool);
    }

}
