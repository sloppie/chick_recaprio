package com.joocy.chickledger.utilities;

// facebook packages
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactMethod;

//Android Packages
import android.os.Environment;
import android.widget.Toast;

// java packages
import java.io.File;

public class DirectoryCheck{
    public DirectoryCheck(){
    }

    /**
     * 
     * @param dirname checks whether the batch name exists for the chicken in question
     * @return a boolean to show of the findings made
     */
    public static boolean checkDirectory(File context, String dirname){
        return new File(context, dirname).exists(); 
    }

    /**
     * This method checks whether the "data" directory is in place, if not, the folder is created to store data for the farmer's chicken
     * @return
     */
    public static boolean checkDirectory(File context){
        return new File(context, "data").exists();
    }

    /**
     * This method creates a folder with the name "batchName" to store data for the respective batch
     * 
     * @param batchName this is the name of the batch of chicken to be kept data for
     * @return boolean to indicate whether the action was successfully carried out
     */
    public static boolean makeDirectories(File context, String batchName){
        if(DirectoryCheck.checkDirectory(context)){
            File newBatch = new File(context, "data/" + batchName);
            if(!newBatch.exists()){
                newBatch.mkdirs();
                return DirectoryCheck.checkDirectory(context, "data/" + batchName);
            }else{
                return DirectoryCheck.checkDirectory(context, "data/" + batchName);
            }
        }else{
            File newBatch = new File(context, "data/" + batchName);

            newBatch.mkdirs();
            return DirectoryCheck.checkDirectory(context, "data/" + batchName);
        }
    }

    /**
     * This function adds a folder with the name "weekNumber" to add to the data in the chicken batch
     * 
     * @param context gives the batch name of the chicken to give the function context on where to carry out the action
     * @param weekNumber this is the week number to be added to the folder for the respecive chicken batch
     * @return Boolean that shows whether the action was successfully completed
     */
    public static boolean addWeek(File context, String batchName, int weekNumber){
        File chickenBatch = new File(context, "data/" + batchName + "/" + DirectoryCheck.stringify(weekNumber));

        if(!chickenBatch.exists()){
            return chickenBatch.mkdir();
        }
		return true;
    }
    
    public static String stringify(int number) {
        if(number < 10)
            return "0" + number;
        else 
            return "" + number + "";
    }
}
