package com.joocy.chickledger.utilities;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;

import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

import android.widget.Toast;

public class InventoryManager extends ReactContextBaseJavaModule {
    
    private File cacheDir = getReactApplicationContext().getCacheDir();
    private File filesDir = getReactApplicationContext().getFilesDir();
    private ReactContext reactContext = (ReactContext) getReactApplicationContext();
    File inventory = new File(filesDir, "inventory");
	File currentInventory = new File(inventory, "currentInventory.json");
	File history = new File(inventory, "history.json");
	File feedsDirectory = new File(inventory, "feeds");
	File pickUp = new File(inventory, "pickUp.json");
    ReactContext context = (ReactContext) getReactApplicationContext();

    public InventoryManager(ReactApplicationContext reactContext) {
        super(reactContext);
		createInventory();
    }

    @Override
    public String getName() {
        return "InventoryManager";
    }

    private void createInventory() {
		if(!inventory.exists()) {
			try {
				inventory.mkdirs();
				feedsDirectory.mkdirs();
				writeFile(currentInventory, "[[], {}]");
				writeFile(history, "[]");
                writeFile(pickUp, "[]");
                makeToast(pickUp.getAbsolutePath());
			} catch (Exception e) {

			}
		}
    }

    /**
     * 
     * @param type name of the feeds to be added, e.g: "pembe_growers_mash"
     * @param data data of the feeds
     */
	@ReactMethod
	public void addFeeds(String type, String data) { 
		File feeds = new File(feedsDirectory, type + ".json");
        writeFile(feeds, data);
        Thread forceUpdate = new Thread(new ForceUpdate(reactContext, ForceUpdate.INVENTORY_FEEDS_ADDED));
        forceUpdate.start();
    }
    
    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean typeExists(String type) {
        File feeds = new File(feedsDirectory, type + ".json");

        return feeds.exists();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String fetchFeeds(String feedsName) {
        File feeds = new File(feedsDirectory, feedsName + ".json");
        String data = readFile(feeds);

        return data;
    }

    @ReactMethod
    public void fetchFeedsAsync(String feedsName, Promise onData) {
        File feeds = new File(feedsDirectory, feedsName + ".json");
        String data = readFile(feeds);

        onData.resolve(data);
    }

	@ReactMethod
	public void addHistory(String data) {
		writeFile(history, data);
	}

	@ReactMethod(isBlockingSynchronousMethod = true)
	public String fetchHistory() {
		String data = readFile(history);
		return data;
	}

	@ReactMethod
	public void addCurrentInventory(String data) {
		writeFile(currentInventory, data);
        Thread forceUpdate = new Thread(new ForceUpdate(reactContext, ForceUpdate.INVENTORY_FEEDS_ADDED));
        forceUpdate.start();
	}

	@ReactMethod(isBlockingSynchronousMethod = true)
	public String fetchCurrentInventory() {
		String data = readFile(currentInventory);
		return data;
    }
    
	@ReactMethod
	public void fetchCurrentInventoryAsync(Promise onData) {
		String data = readFile(currentInventory);
        
        onData.resolve(data);
	}

	@ReactMethod
	public void addPickUp(String data) {
        writeFile(pickUp, data);
        ForceUpdate pickUpUpdated = new ForceUpdate(reactContext, ForceUpdate.PICK_UP_ADDED);
        new Thread(pickUpUpdated).start();
	}

	@ReactMethod(isBlockingSynchronousMethod = true)
	public String fetchPickUp() {
		String data = readFile(pickUp);
		return data;
    }
    
    @ReactMethod
    public void fetchPickUpAsync(Promise onData) {
        String data = readFile(pickUp);

        onData.resolve(data);
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
