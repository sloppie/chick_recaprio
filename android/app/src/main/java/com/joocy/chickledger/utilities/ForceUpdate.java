package com.joocy.chickledger.utilities;

//React Packages
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.Arguments;

// Java Packages
import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

public class ForceUpdate implements Runnable {

	public static String EVENT_ADDED = "EVENT_ADDED";
	public static String EVENT_ARCHIVED = "EVENTS_ARCHIVED";
	public static String EGGS_ADDED = "EGGS_ADDED";
	public static String FEEDS_ADDED = "FEEDS_ADDED";
	public static String CASUALTIES_ADDED = "CASUALTIES_ADDED";
	public static String INVENTORY_FEEDS_ADDED = "INV_FEEDS_ADDED";
	public static String INVENTORY_EGGS_ADDED = "INV_EGGS_ADDED";
	public static String BATCH_CREATED = "BATCH_CREATED";
	public static String PICK_UP_ADDED = "PICK_UP_ADDED";
	public static String PICK_UP_PRICE_ADDED = "PICK_UP_PRICE_ADDED";

	private ReactContext reactContext;
	public String type;

	public ForceUpdate(ReactContext reactContext, String type) {
		this.reactContext = reactContext;
		this.type = type;
	}

	public void run() {
		// creating the map to be passed onto the EventEmitter
		WritableMap ready = Arguments.createMap();
		ready.putBoolean("done", true);

		// event send with data
		forceUpdate(reactContext, this.type, ready);
	}

	// Helper function to send events
	private void forceUpdate(ReactContext reactContext, String eventName, WritableMap params) {
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}

}
