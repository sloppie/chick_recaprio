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
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;

import android.widget.Toast;

public class BatchManager extends ReactContextBaseJavaModule {

    private final File cacheDir = getReactApplicationContext().getCacheDir();
    private final File filesDir = getReactApplicationContext().getFilesDir();
    private final File ARCHIVE = new File(filesDir, "ARCHIVE");
    private final File DATA = new File(filesDir, "data");


    public BatchManager(ReactApplicationContext reactContext) {
        super(reactContext);
        if(!ARCHIVE.exists()) {
            ARCHIVE.mkdirs();
        }
    }

    @Override
    public String getName() {
        return "BatchManager"; 
    }

    @ReactMethod
    public void archive(String batchName) {
        File oldFolder = getBatchFolder(batchName);

        boolean copied = moveFiles(oldFolder, ARCHIVE);

        String message;

        if(copied) {
            message = "Successfully archived the batch: " + batchName;
        } else {
            message = "Unable to archive the batch: " + batchName;
        }

        makeToast(message);
    }

    @ReactMethod
    public void rename(String previous, String newName) {
        boolean renamed = renameFolder(previous, newName);

        String message;
        if(renamed) {
            message = "Successfully renamed " + previous + " to: " + newName;
        } else {
            message = "Unable to rename batch: " + previous;
        }

        makeToast(message);
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public boolean delete(String batchName) {
        File folder = new File(DATA, batchName);
        boolean listViewDeleted = deleteListView(batchName);
        boolean folderDeleted = deleteFolder(folder);
        boolean batchDeleted = folderDeleted && listViewDeleted;

        return batchDeleted;
    }

    private void makeToast(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }

    private boolean archiveFiles(String batchName) {
        boolean archived;
        File oldFolder = getBatchFolder(batchName);
        File newFolder = new File(ARCHIVE, batchName);
        archived = moveFiles(oldFolder, newFolder);
        deleteListView(batchName);

        return archived;
    }

    private boolean renameFolder(String previous, String newName) {
        File oldFolder = new File(DATA, previous);
        File newFolder = new File(DATA, newName);
        boolean renamed = moveFiles(oldFolder, newFolder);

        return renamed;
    }

    private File getBatchFolder(String batchName) {
        File batchFolder = new File(DATA, batchName);

        return batchFolder;
    }

    private boolean moveFiles(File oldFolder, File newFolder) {
        File batchFolder = oldFolder;
        File newBatchFolder = newFolder;
        boolean moved = true;
        
        if(!newBatchFolder.exists()) {
            newBatchFolder.mkdirs();
        }

        for(File batchFile: batchFolder.listFiles()) {
            String fileName = batchFile.getName();
            String data = FileOps.readFile(batchFile);
            File newBatchFile = new File(newBatchFolder, fileName);
            FileOps.writeFile(newBatchFile, data);
        }

        moved = deleteFolder(batchFolder);

        return moved;
    }

    private boolean deleteFolder(File folder) {
        File folderToDelete = folder;
        boolean successful = true;

        for(File file: folderToDelete.listFiles()) {
            if(successful) {
                successful = file.delete();
            } else {
                break;
            }
        }

        return successful;
    }

    private boolean deleteListView(String batchName) {
        File LISTVIEW = new File(filesDir, "listview");
        File batchListView = new File(LISTVIEW, batchName);
        boolean deleted = deleteFolder(batchListView);

        return deleted;
    }

    private File getKey(File batchFolder, String key) {
        File keyFile = new File(batchFolder, key);

        return keyFile;
    }

    private File getBrief(File batchFolder) {
        File briefFile = getKey(batchFolder, "brief");

        return briefFile;
    }

}