package com.opentext.otsync.dcs.conversion;

import java.util.HashMap;
import java.util.Map;

public class DocConversionResult {

    private int totalPages;

    private Map<Integer, String> pageFilesMap = new HashMap<>();

    public DocConversionResult() {
    }

    public int getTotalPages() {
        return totalPages;
    }

    public void setTotalPages(int totalPages) {
        this.totalPages = totalPages;
    }

    public Map<Integer, String> getPageFilesMap() {
        return pageFilesMap;
    }

    public void setPageFilesMap(Map<Integer, String> pageFilesMap) {
        this.pageFilesMap = pageFilesMap;
    }

    public void addPageFile(int pageNumber, String filePath) {
        this.pageFilesMap.put(pageNumber, filePath);
    }

}
