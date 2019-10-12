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

public class ThreadRunner implements Runnable {

	private File file;
	private ReactContext reactContext;
	private String weekNumber;
	private String category;

	public ThreadRunner() {
	}

	public ThreadRunner(File file, ReactContext context, String category, String weekNumber) {
		this.file = file;
		this.reactContext = context;
		this.weekNumber = weekNumber;
		this.category = category;
	}

	public void run() {
		// creating the map to be passed onto the EventEmitter
		WritableMap fileDetails = Arguments.createMap();
		// fileDetails.putString(file.getName(), readFile(file));
		fileDetails.putString(weekNumber, readFile(file));

		// event send with data
		sendFile(reactContext, "read" + category, fileDetails);
	}

	// Helper function for reading files
	private String readFile(File file) {

		String data = "";

		try {
			int c;

			FileReader fileRead = new FileReader((file));
			while ((c = fileRead.read()) != -1) {
				data += (char) c;
			}

			fileRead.close();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return data;
	}

	// Helper function for writing to files
	private void writeFile(File file, String data) {
		if (file.exists()) {
			try {
				FileWriter fileWrite = new FileWriter(file);

				fileWrite.write(data);
				fileWrite.flush();
				fileWrite.close();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			}
		} else {
			try {
				file.createNewFile();

				FileWriter fileWrite = new FileWriter(file);

				fileWrite.write(data);
				fileWrite.flush();
				fileWrite.close();
			} catch (IOException ioe) {
				ioe.printStackTrace();
			}
		}
	}

	private String stringify(int number) {
		String answer;
		if(number < 10) {
			answer = "0" + number;
		} else {
			answer = "" + number + "";
		}

		return answer;
	}

	// Helper function to send events
	private void sendFile(ReactContext reactContext, String eventName, WritableMap params) {
		reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
	}
}
