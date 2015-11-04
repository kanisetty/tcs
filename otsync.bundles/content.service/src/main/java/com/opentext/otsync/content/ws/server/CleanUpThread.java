package com.opentext.otsync.content.ws.server;

import com.opentext.otsync.content.listeners.ChunkedContentRequestQueue;
import com.opentext.otsync.content.otag.ContentServerService;

public class CleanUpThread extends Thread {
    private ClientSet clients;
    private volatile boolean stopFlag = true;
    private ChunkedContentRequestQueue chunkedQueue;

    public CleanUpThread(ClientSet clients, ChunkedContentRequestQueue chunkedQueue) {
        super("cleanup");
        this.clients = clients;
        this.chunkedQueue = chunkedQueue;
    }

    @Override
    public void run() {
        stopFlag = false;
        while (!stopFlag) {
            try {
                Thread.sleep(ContentServerService.getSettingsService().getCleanUpInterval() * 1000);
            } catch (Exception ignored) {
                // continue on and wake up from sleep
            }

            clients.discardOldClients();
            chunkedQueue.cleanDownloadRequests();
            chunkedQueue.cleanUploadRequests();
        }
    }

    public synchronized void stopThread() {
        if (stopFlag)
            return;
        stopFlag = true;
        this.interrupt();
    }

}
