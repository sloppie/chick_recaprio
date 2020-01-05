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

public class Sessions extends ReactContextBaseJavaModule {
    private File cacheDir = getReactApplicationContext().getCacheDir();
    private File filesDir = getReactApplicationContext().getFilesDir();
    File SESSIONS = new File(cacheDir, "SESSIONS"); 
    File INV = new File(cacheDir, "INV");
    File NOTIFICATION_FOLDER = new File(filesDir, "NOTIFICATIONS");
    File NOTIFICATION_IDS = new File(NOTIFICATION_FOLDER, "NOTIFICATIONS");
    ReactContext context = (ReactContext) getReactApplicationContext();

    public Sessions(ReactApplicationContext reactContext) {
        super(reactContext);

        if(!NOTIFICATION_FOLDER.exists()) {
            NOTIFICATION_FOLDER.mkdirs();
            writeFile(NOTIFICATION_IDS, "100");
        }
    }

    @Override
    public String getName() {
        return "Sessions";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getCurrentSession() {
        if(dirExists()) {
            String sesh = readFile(SESSIONS);
            return sesh;
        } else {
            return "Cache not available!";
        }
    }

    @ReactMethod
    public void createSession(String context, Callback onSuccess) {
        if(!dirExists()) {
            createCacheFile("SESSIONS");
        }  
        writeFile(SESSIONS, context);
        onSuccess.invoke(true);
    }

    @ReactMethod
    public void createInventorySession(String context) {
        if(!INV.exists()) {
            createCacheFile("INV");
        }

        writeFile(INV, context);
    }

	@ReactMethod
	public void resetSession() {
		// This is to mimmick a hard reset on the Session incase the user presses back button at the top
		writeFile(INV, "");
	}

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getInventorySession() {
        return readFile(INV);
    }

    public void createCacheFile(String file) {
        if(!dirExists()) {
            // makeToast("ALREADY\n" + SESSIONS.getAbsolutePath());
            try{
                // SESSIONS = File.createTempFile("SESSIONS", null, cacheDir);
                File newCacheFile = new File(cacheDir, file);
                newCacheFile.createNewFile();
                SESSIONS = newCacheFile;
            } catch(Exception ex) {
                // pass
            }
        } else {
        }
    }

    private boolean dirExists() {
        return (SESSIONS != null && SESSIONS.exists());
    }

    @ReactMethod
    public void endSession() {
        try{
            SESSIONS.delete();
        } catch(Exception ex) {
            // unable to delete
        }
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchNotificationId() {
        String data = readFile(NOTIFICATION_IDS);

        return data;
    }

    @ReactMethod
    public void writeNotificationId(String data) {
        writeFile(NOTIFICATION_IDS, data);
    }

    private void makeToast(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

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
}
