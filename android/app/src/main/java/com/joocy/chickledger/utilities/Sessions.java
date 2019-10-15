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
    File SESSIONS = new File(cacheDir, "SESSIONS"); 
    File INV = new File(cacheDir, "INV");
    ReactContext context = (ReactContext) getReactApplicationContext();

    public Sessions(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "Sessions";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getCurrentSession() {
        if(dirExists()) {
            String sesh = readFile(SESSIONS);
            makeToast("Current session: " + sesh);
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