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

public class Security extends ReactContextBaseJavaModule {

    private File cacheDir = getReactApplicationContext().getCacheDir();
    private File filesDir = getReactApplicationContext().getFilesDir();
    private File PROTECTED = new File(filesDir, "PROTECTED");
    private File secs = new File(PROTECTED, ".secs");


    public Security(ReactApplicationContext reactContext) {
        super(reactContext);
        if(!secs.exists()) {
            PROTECTED.mkdirs();
            FileOps.writeFile(secs, "");
        }
    }

    @Override
    public String getName() {
        return "Security"; 
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchSecs() {
        String data = FileOps.readFile(secs);

        return data;
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public Boolean writeSecs(String data) {
        FileOps.writeFile(secs, data);

        return true;
    }

}