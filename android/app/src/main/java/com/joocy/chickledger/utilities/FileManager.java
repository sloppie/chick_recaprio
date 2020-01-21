package com.joocy.chickledger.utilities;

// android packages
import android.widget.Toast;

// react native packages
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

// java packages
import java.util.Map;
import java.util.HashMap;
import java.io.File;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.FileNotFoundException;

public class FileManager extends ReactContextBaseJavaModule implements DataQuery {

  private static final String DURATION_SHORT_KEY = "SHORT";
  private static final String DURATION_LONG_KEY = "LONG";
  private final File filesDir = getReactApplicationContext().getFilesDir();
  private ReactContext reactContext = (ReactContext) getReactApplicationContext(); 
  private final File DATA = new File(filesDir,"data");

  public FileManager(ReactApplicationContext reactContext) {
    super(reactContext);

    if(!DATA.exists()) {
      DATA.mkdirs();
    }

    if(new File(DATA, "My Batch").exists()) {
      new File(DATA, "My Batch").delete();
    }

  }

  @Override
  public String getName() {
    return "FileManager";
  }
 
  @ReactMethod
  public void create(String context, String data, Callback state) {
    boolean check = DirectoryCheck.makeDirectories(filesDir, context);
    // listView Dir made!
    try {
      File list = new File(filesDir, "listview/" + context);
      list.mkdirs();
    } catch (Exception e) {

    }
    if(check) {
      createBrief(context, data);
      File eggs = getDir(context, "eggs");
      File feeds = getDir(context, "feeds");
      File casualties = getDir(context, "casualties");
      writeFile(eggs, "[]");
      writeFile(feeds, "[]");
      writeFile(casualties, "{}");
      state.invoke(true, false);
    } else {
      state.invoke(false, true);
    }

    Thread forceUpdate = new Thread(new ForceUpdate(reactContext, ForceUpdate.BATCH_CREATED));
    forceUpdate.start();
  } 

  private void createBrief(String context, String data) {
    File brief = new File(filesDir, "data/" + context + "/brief");
    writeFile(brief, data);
  }

  /**
   * This function is used to write new data to the batch passed in through the context
   * @param context is the nname of the batch in question
   * @param data is the new data to be written to the brief
   */
  @ReactMethod
  public void writeBrief(String context, String data) {
    File brief = new File(filesDir, "data/" + context + "/brief");
    writeFile(brief, data);
  }

  // One method provided to the context then afterwards adds the data to the respective key of the data
  @ReactMethod
  public void addData(String context, String key, String data) {
      writeFile(getDir(context, key), data);
      makeToast("data added to " + key + " store");

      ForceUpdate updatedValue;

      if(data == "eggs") {
        updatedValue = new ForceUpdate(this.reactContext, ForceUpdate.EGGS_ADDED);
      } else if(data == "feeds") {
        updatedValue = new ForceUpdate(this.reactContext, ForceUpdate.FEEDS_ADDED);
      } else {
        updatedValue = new ForceUpdate(this.reactContext, ForceUpdate.CASUALTIES_ADDED);
      }

      new Thread(updatedValue).start();
  }

  // fetching the data 
  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean batchExists(String context) {
    boolean inArchiveDir = new File(filesDir, "ARCHIVE/" + context).exists();
    boolean inDataDir = new File(filesDir, "data/" + context).exists();
    boolean exists = (inArchiveDir || inDataDir);

    return exists;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String fetchBatchNames() {
    File data = new File(filesDir, "data");
    String names = "";
    for(File batch: data.listFiles()) {
      names += batch.getName() + ",";
    }

    return names;
  }

  @ReactMethod
  public void fetchBatches(Callback response) {
    String data = "{";
    File dataFolder = new File(filesDir, "data");
    File[] files = dataFolder.listFiles();
    if(files != null) {
      int length = files.length;
      for(int i=0; i<(length - 1); i++) {
        String brief = fetchBrif(files[i].getName());
        data += "\"" + files[i].getName() + "\"" + ": " ;
        data += brief + ",";
      }
      String brief = fetchBrif(files[(length - 1)].getName());
      data += "\"" + files[(length - 1)].getName() + "\"" + ": " ;
      data += brief;
    }

    data += "}";

    response.invoke(data);
  }

  @ReactMethod
  public void fetchBrief(String context, Callback data) {
    String contents = fetchBrif(context);
    data.invoke(contents);
  }

  private String fetchBrif(String context) {
    File brief = new File(filesDir, "data/" + context + "/brief");
    String contents = readFile(brief);

    return contents;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String fetchBriefSync(String context) {
	String contents = fetchBrif(context);

	return contents;
  }

  @ReactMethod
  public void fetchData(String context, String key, Callback data) {
    data.invoke(readFile(getDir(context, key)));
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String fetchDataSync(String context, String key) {
    String data = readFile(getDir(context, key));
    return data;
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public String fetchForCheck(String context, String key) {
    String data = readFile(getDir(context, key));
    return data;
  }

  // get write directory
  private File getDir(String context, String key) {
    File dataFile = new File(filesDir, "data/" + context + "/" + key);

    if(!dataFile.exists()) {      
      try {
        dataFile.createNewFile();
      } catch (Exception e) {
        // pass
      }
    }

    return dataFile;
  }

  /**
   * *******************************************************
   * 
   * CREATE LIST VIEWS FOR DATA... to allow easy access **** 
   * 
   * *******************************************************
   */
  @ReactMethod
  public void createListView(String context, String type, String data) {
    File list = new File(filesDir, "listview/" + context + "/" + type);
    writeFile(list, data);
  }

  @ReactMethod(isBlockingSynchronousMethod = true)
  public boolean listViewExists(String context, String type) {
    boolean exists = false;
    try {
      File listView = new File(filesDir, "listview/" + context + "/" + type);
      exists = listView.exists();
    } catch (Exception e) {

    }
    return exists;
  }

  @ReactMethod
  public void updateList(String context, String type, String data) {
    File listView = new File(filesDir, "listview/" + context + "/" + type);
    writeFile(listView, data);
  }

  @ReactMethod
  public void fetchList(String context, String type, Callback data) {
    File list = new File(filesDir, "listview/" + context + "/" + type);
    data.invoke(readFile(list));
  }

  private void makeToast(String message) {
    Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
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
      makeToast(file.getAbsolutePath());
    } else {
      try {
        file.createNewFile();

        FileWriter fileWrite = new FileWriter(file);

        fileWrite.write(data);
        fileWrite.flush();
        fileWrite.close();
      makeToast(file.getAbsolutePath());
      } catch (IOException ioe) {
        ioe.printStackTrace();
      }
    }
  }

  // Helper function to send events
  private void sendFile(ReactContext reactContext, String eventName, WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}
