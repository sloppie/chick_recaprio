import { NativeModules } from 'react-native';


export default class EggPreferences {

    static get EGG_PREF() {
        let preferences;
        try {
            preferences = JSON.parse(NativeModules.NotificationManager.fetchEggReminderPref());
        } catch(err) {
            preferences = null;
        }

        return preferences;
    }

    static writePrefernces(preferences) {
        NativeModules.NotificationManager.setEggReminderPref(JSON.stringify(preferences));
    }

    static getKey(key) {
        let EGG_PREF = EggPreferences.EGG_PREF;
        let value = EGG_PREF[key];

        return value;
    }

    static setKey(key, value) {
        let EGG_PREF = EggPreferences.EGG_PREF;
        EGG_PREF[key] = value;

        EggPreferences.writePrefernces(EGG_PREF);
    }

    static get ID() {
        let id = EggPreferences.getKey("ID");

        return id;
    }

    static get TIME() {
        let time = EggPreferences.getKey("TIME")

        return time;
    }

    static set TIME(value) {
        EggPreferences.setKey("TIME", value);
    }

    static get VIBRATION() {
        let vibration = EggPreferences.getKey("VIBRATION");

        return vibration;
    }

    static set VIBRATION(bool) {
        EggPreferences.setKey("VIBRATION", bool);
    }

    static get PLAY_SOUND() {
        let PLAY_SOUND = EggPreferences.getKey("PLAY_SOUND");

        return PLAY_SOUND;
    }

    static set PLAY_SOUND(bool) {
        EggPreferences.setKey("PLAY_SOUND", bool);
    }

}