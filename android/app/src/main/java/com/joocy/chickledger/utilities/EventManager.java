
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

public class EventManager extends ReactContextBaseJavaModule {

    private ReactContext reactContext;
    private File filesDir = getReactApplicationContext().getFilesDir();
    private File events = new File(filesDir, "events");
    private File incompleteEvents = new File(events, "incomplete_events");
    private File completeEvents = new File(events, "complete_events");
    private File incompleteEventData = new File(incompleteEvents, "events.json");
    private File completeEventData = new File(completeEvents, "events.json");

    public EventManager(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = (ReactContext) reactContext;
        
        if(!incompleteEvents.exists()) {
            incompleteEvents.mkdirs();
            completeEvents.mkdirs();
        }
        
        if(!incompleteEventData.exists()) {
            FileOps.writeFile(incompleteEventData, "[]");
            FileOps.writeFile(completeEventData, "[]");
        }
    }

    @Override
    public String getName() {
        return "EventManager";
    }

    @ReactMethod
    public void addEvent(String event) {
        FileOps.writeFile(incompleteEventData, event);
        ForceUpdate eventAdded = new ForceUpdate(reactContext, ForceUpdate.EVENT_ADDED);
        new Thread(eventAdded).start();
    }

    @ReactMethod
    public void archiveEvent(String event) {
        FileOps.writeFile(completeEventData, event);
        ForceUpdate eventAdded = new ForceUpdate(reactContext, ForceUpdate.EVENT_ARCHIVED);
        new Thread(eventAdded).start();
    }

    @ReactMethod
    public void fetchIncompleteEvents(Callback response) {
        String data = FileOps.readFile(incompleteEventData);

        response.invoke(data);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchIncompleteEventsSync() {
        String response = FileOps.readFile(incompleteEventData);

        return response;
    }

    @ReactMethod
    public void fetchCompleteEvents(Callback response) {
        String data = FileOps.readFile(completeEventData);

        response.invoke(data);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchCompleteEventsSync() {
        String response = FileOps.readFile(completeEventData);

        return response;
    }

}