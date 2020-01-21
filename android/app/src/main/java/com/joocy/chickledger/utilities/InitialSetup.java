package com.joocy.chickledger.utilities;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;

import com.facebook.react.bridge.Callback;

import android.widget.Toast;

public class InitialSetup extends ReactContextBaseJavaModule {

    private final File cacheDir = getReactApplicationContext().getCacheDir();
    private final File filesDir = getReactApplicationContext().getFilesDir();
    private final File SETUP = new File(filesDir, ".setup");

    public InitialSetup(ReactApplicationContext reactContext) {
        super(reactContext);

        if(!SETUP.exists()) {
            FileOps.writeFile(SETUP, "F");
        }
    }

    @Override
    public String getName() {
        return "InitialSetup"; 
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean isSetup() {
        String state = FileOps.readFile(SETUP);
        boolean isSet = state.contains("T");

        return isSet;
    }

    @ReactMethod
    public void userIsSet() {
        FileOps.writeFile(SETUP, "T");
    }
}