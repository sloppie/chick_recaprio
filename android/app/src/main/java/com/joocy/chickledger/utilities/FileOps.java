package com.joocy.chickledger.utilities;

import java.io.File;
import java.io.FileWriter;
import java.io.FileReader;
import java.io.IOException;

public class FileOps {

    public static String readFile(File file) {

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
    public static void writeFile(File file, String data) {
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