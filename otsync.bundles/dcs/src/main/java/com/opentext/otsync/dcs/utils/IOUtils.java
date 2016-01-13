package com.opentext.otsync.dcs.utils;

import java.io.File;
import java.nio.file.Paths;

public class IOUtils {

  public static String appendToFileName(String fileName, String suffix) {
    return Paths.get(fileName).getParent() +"\\"+getFileName(fileName, false) + suffix + "." + getFileExtension(fileName);
  }

  private static String getFileName(String path, Boolean includeExt) {
    File file = new File(path);
    String fileName = file.getName();

    if (!includeExt) {
      int i = fileName.lastIndexOf('.');

      if (i > 0) {
        fileName = fileName.substring(0, i);
      }

    }
    return fileName;
  }

  private static String getFileExtension(String path) {
    File file = new File(path);
    String fileName = file.getName();

    int i = fileName.lastIndexOf('.');

    return fileName.substring(i + 1, fileName.length());
  }
}
