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

	ReactContext reactContext;

	public ForceUpdate(ReactContext reactContext) {
		this.reactContext = reactContext;
	}

	public void run() {
		// creating the map to be passed onto the EventEmitter
		WritableMap ready = Arguments.createMap();
		// fileDetails.putString(file.getName(), readFile(file));
		ready.putBoolean("done", true);

		// event send with data
		forceUpdate(reactContext, "update", ready);
	}

	// Helper function to send events
	private void forceUpdate(ReactContext reactContext, String eventName, WritableMap params) {
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}
	
}
