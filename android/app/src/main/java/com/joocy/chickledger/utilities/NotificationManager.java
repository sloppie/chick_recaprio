package com.joocy.chickledger.utilities;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

import android.widget.Toast;

public class NotificationManager extends ReactContextBaseJavaModule {

    private File cacheDir = getReactApplicationContext().getCacheDir();
    private File filesDir = getReactApplicationContext().getFilesDir();
    private File NOTIFICATION = new File(filesDir, "NOTIFICATION");
    private File NORMAL_PREFERENCES = new File(NOTIFICATION, ".preferences");
    private File EGG_REMINDER_PREFERENCES = new File(NOTIFICATION, ".egg_reminder_preferences");
    private File NOTIFICATION__IDS = new File(NOTIFICATION, ".ids"); 

    public NotificationManager(ReactApplicationContext reactContext) {
        super(reactContext);

        if(!NOTIFICATION.exists()) {
            NOTIFICATION.mkdirs();
            FileOps.writeFile(NORMAL_PREFERENCES, "{\"TIME\": \"08:00:00\", \"PLAY_SOUND\": true, \"VIBRATION\": true}");
            FileOps.writeFile(EGG_REMINDER_PREFERENCES, "{\"ID\":\"69\", \"TIME\": \"08:00:00\", \"PLAY_SOUND\": true, \"VIBRATION\": true}");
            FileOps.writeFile(NOTIFICATION__IDS, "");
        }
    }

    @Override
    public String getName() {
        return "NotificationManager"; 
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchNotificationPref() {
        String preferences = FileOps.readFile(NORMAL_PREFERENCES);

        return preferences;
    }

    @ReactMethod
    public void setNotificationPref(String data) {
        FileOps.writeFile(NORMAL_PREFERENCES, data);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchEggReminderPref() {
        String preferences = FileOps.readFile(EGG_REMINDER_PREFERENCES);

        return preferences;
    }

    @ReactMethod
    public void setEggReminderPref(String data) {
        FileOps.writeFile(EGG_REMINDER_PREFERENCES, data);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchNotificationIds() {
        String ids = FileOps.readFile(NOTIFICATION__IDS);

        return ids;
    }

    @ReactMethod
    public void addNotificationId(String data) {
        FileOps.writeFile(NOTIFICATION__IDS, data);
    }

}